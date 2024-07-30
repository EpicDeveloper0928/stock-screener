import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StockScreenerApiService } from './services/stock-screener-api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

export interface ITickerRow {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  high: string;
  low: string;
  volume: string;
}

@Component({
  selector: 'app-stock-screener',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule],
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

  constructor(private stockScreenerApiService: StockScreenerApiService) {}

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
      this.dataSource = new MatTableDataSource<ITickerRow>(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
