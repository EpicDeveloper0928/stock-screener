import { TestBed } from '@angular/core/testing';

import { StockScreenerService } from './stock-screener.service';

describe('StockScreenerService', () => {
  let service: StockScreenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockScreenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
