import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';

import { ITickerRow } from '../../shared/models/ticker';
import { ScreenerFilterDialogComponent } from './components/screener-filter-dialog/screener-filter-dialog.component';
import { StockScreenerApiService } from './services/stock-screener-api.service';
import { StockScreenerService } from './services/stock-screener.service';
import { IFilterItem } from '../../shared/models/filter';

@Component({
  selector: 'app-stock-screener',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatBadgeModule,
  ],
  providers: [StockScreenerApiService],
  templateUrl: './stock-screener.component.html',
  styleUrl: './stock-screener.component.scss',
})
export class StockScreenerComponent implements OnInit {
  displayedColumns: string[] = [
    'symbol',
    'price',
    'change',
    'changePercent',
    'high',
    'low',
    'volume',
  ];
  dataSource: MatTableDataSource<ITickerRow> =
    new MatTableDataSource<ITickerRow>([]);
  tableData: ITickerRow[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  activeFilters: [string, IFilterItem][] = [];

  constructor(
    private stockScreenerApiService: StockScreenerApiService,
    private stockScreenerService: StockScreenerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.stockScreenerApiService.getTickerPriceChange().subscribe(res => {
      this.tableData = res
        .filter(ticker => ticker.symbol.includes('USDT'))
        .map(ticker => {
          return {
            symbol: ticker.symbol,
            price: ticker.highPrice,
            change: ticker.priceChange,
            changePercent: ticker.priceChangePercent,
            high: ticker.highPrice,
            low: ticker.lowPrice,
            volume: ticker.volume,
          };
        });
      this.dataSource.data = this.tableData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.subscribeFilters();
    });
  }

  private subscribeFilters() {
    this.stockScreenerService.stockFilters.subscribe(filters => {
      this.activeFilters = Object.entries(filters).filter(
        ([_, value]) => !!value.type && !!value.min
      );
      this.dataSource.data = this.stockScreenerService.filterData(
        this.tableData,
        this.activeFilters
      );
    });
  }

  openFilterDialog() {
    this.dialog.open(ScreenerFilterDialogComponent, {
      maxWidth: '1440px',
      minWidth: '768px',
    });
  }
}
