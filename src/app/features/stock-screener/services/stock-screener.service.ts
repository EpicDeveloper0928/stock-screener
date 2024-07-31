import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IFilterItem } from '../../../shared/models/filter';
import { ITickerRow } from '../../../shared/models/ticker';

@Injectable({
  providedIn: 'root',
})
export class StockScreenerService {
  stockFilters: BehaviorSubject<Record<string, IFilterItem>> =
    new BehaviorSubject({});
  constructor() {}

  filterData(data: ITickerRow[], filters: [string, IFilterItem][]) {
    return data.filter(row => {
      return filters.every(([key, filter]) => {
        return this.applyFilter(+row[key as keyof ITickerRow], filter);
      });
    });
  }

  private applyFilter(value: number, filter: IFilterItem) {
    if (filter.type && filter.min) {
      switch (filter.type) {
        case 'above':
          return value > +filter.min;
        case 'aboveOrEqual':
          return value >= +filter.min;
        case 'below':
          return value < +filter.min;
        case 'belowOrEqual':
          return value <= +filter.min;
        case 'between':
          return filter.max && value >= +filter.min && value <= +filter.max;
        case 'notBetween':
          return value < +filter.min || (filter.max && value > +filter.max);
        case 'equal':
          return value === +filter.min;
        case 'notEqual':
          return value !== +filter.min;
        default:
          return true;
      }
    }
    return false;
  }
}
