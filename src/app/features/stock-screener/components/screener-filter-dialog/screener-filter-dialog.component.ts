import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FilterConstants } from '../../../../shared/constant/filter';
import { StockScreenerService } from '../../services/stock-screener.service';
import { IFilterItem } from '../../../../shared/models/filter';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-screener-filter-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [FilterConstants],
  templateUrl: './screener-filter-dialog.component.html',
  styleUrl: './screener-filter-dialog.component.scss',
})
export class ScreenerFilterDialogComponent {
  filterFormGroup!: FormGroup;
  constructor(
    public filterConstants: FilterConstants,
    private stockScreenerService: StockScreenerService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterFormGroup = this.formBuilder.group({
      volume: this.formBuilder.group({
        type: [''],
        min: [''],
        max: [''],
      }),
      changePercent: this.formBuilder.group({
        type: [''],
        min: [''],
        max: [''],
      }),
      price: this.formBuilder.group({
        type: [''],
        min: [''],
        max: [''],
      }),
    });

    this.stockScreenerService.stockFilters.subscribe(filters => {
      this.filterFormGroup.patchValue(filters);
    });
  }

  public applyFilter() {
    this.stockScreenerService.stockFilters.next(
      this.filterFormGroup.value as Record<string, IFilterItem>
    );
  }

  public resetFilter() {
    this.filterFormGroup.reset();
    this.stockScreenerService.stockFilters.next({});
  }

  public closeDialog() {
    this.dialog.closeAll();
  }
}
