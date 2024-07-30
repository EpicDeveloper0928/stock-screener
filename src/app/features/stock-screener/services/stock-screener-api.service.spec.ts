import { TestBed } from '@angular/core/testing';

import { StockScreenerApiService } from './stock-screener-api.service';

describe('StockScreenerApiService', () => {
  let service: StockScreenerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockScreenerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
