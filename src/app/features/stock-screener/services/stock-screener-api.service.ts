import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment.development';
import { ITicker } from '../../../shared/models/ticker';
import { Observable, interval, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockScreenerApiService {
  constructor(private http: HttpClient) {}
  public baseURL = environment.API_URL;

  public getTickerPriceChange() {
    return this.http
      .get<ITicker[]>(this.baseURL + '/ticker/24hr')
      .pipe(map(data => data.filter(item => item.symbol.endsWith('USDT'))));
  }

  public getRealTimePrice() {
    return interval(8000).pipe(
      switchMap(() =>
        this.http.get<{ symbol: string; price: string }[]>(
          this.baseURL + '/ticker/price'
        )
      ),
      map(data => data.filter(item => item.symbol.endsWith('USDT')))
    );
  }

  public get24hPriceHistory(symbol: string) {
    return this.http.get<any[][]>(this.baseURL + '/klines', {
      params: {
        symbol,
        interval: '1h',
        limit: '24',
      },
    });
  }
}
