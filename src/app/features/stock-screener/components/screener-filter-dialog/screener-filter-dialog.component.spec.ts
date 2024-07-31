import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenerFilterDialogComponent } from './screener-filter-dialog.component';

describe('ScreenerFilterDialogComponent', () => {
  let component: ScreenerFilterDialogComponent;
  let fixture: ComponentFixture<ScreenerFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenerFilterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenerFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
