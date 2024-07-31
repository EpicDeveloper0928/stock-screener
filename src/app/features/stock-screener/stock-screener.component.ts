import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { IFilterItem } from '../../shared/models/filter';
import { ITickerRow } from '../../shared/models/ticker';
import { ScreenerFilterDialogComponent } from './components/screener-filter-dialog/screener-filter-dialog.component';
import { StockScreenerApiService } from './services/stock-screener-api.service';
import { StockScreenerService } from './services/stock-screener.service';

@Component({
  selector: 'app-stock-screener',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    HighchartsChartModule,
    NgScrollbarModule,
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

  priceSubscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  activeFilters: [string, IFilterItem][] = [];
  selectedSymbol: string | undefined;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      zooming: {
        type: 'x',
      },
    },
    title: {
      text: '24h Price History Chart',
      align: 'left',
    },
    subtitle: {
      text:
        document.ontouchstart === undefined
          ? 'Click and drag in the plot area to zoom in'
          : 'Pinch the chart to zoom in',
      align: 'left',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Price',
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, 'rgb(199, 113, 243)'],
            [0.7, 'rgb(76, 175, 254)'],
          ],
        },
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },

    series: [
      {
        type: 'area',
      },
    ],
  };

  constructor(
    private stockScreenerApiService: StockScreenerApiService,
    private stockScreenerService: StockScreenerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.stockScreenerApiService.getTickerPriceChange().subscribe(res => {
      this.tableData = res.map(ticker => {
        return {
          symbol: ticker.symbol,
          price: ticker.bidPrice,
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
      this.updatePrices();
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

  updatePrices() {
    this.selectedSymbol = undefined;
    this.priceSubscription = this.stockScreenerApiService
      .getRealTimePrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.dataSource.data = this.tableData.map(row => ({
          ...row,
          price: res.find(item => item.symbol === row.symbol)?.price ?? '-',
        }));
      });
  }

  openFilterDialog() {
    this.dialog.open(ScreenerFilterDialogComponent, {
      maxWidth: '1440px',
      minWidth: '768px',
    });
  }

  getPriceChartData(symbol: string) {
    this.selectedSymbol = symbol;

    this.stockScreenerApiService.get24hPriceHistory(symbol).subscribe(data => {
      const prices = data.map(d => parseFloat(d[4]));
      const times = data.map(d => new Date(d[0]).toLocaleTimeString());

      (this.chartOptions.xAxis as Highcharts.XAxisOptions).categories = times;
      (this.chartOptions.series![0] as Highcharts.SeriesLineOptions).data =
        prices;
      (this.chartOptions.series![0] as Highcharts.SeriesLineOptions).name =
        symbol;

      Highcharts.chart('price-chart', this.chartOptions);

      this.priceSubscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
