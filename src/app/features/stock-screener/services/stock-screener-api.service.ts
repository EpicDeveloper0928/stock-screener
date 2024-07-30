import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment.development';
import { ITicker } from '../../../shared/models/ticker';

@Injectable({
  providedIn: 'root',
})
export class StockScreenerApiService {
  constructor(private http: HttpClient) {}
  public baseURL = environment.API_URL;

  public getTickerPriceChange() {
    return this.http.get<ITicker[]>(this.baseURL + '/ticker/24hr');
  }
}
