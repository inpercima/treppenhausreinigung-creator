import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { addDays, format } from 'date-fns';
import jsPDF from 'jspdf';
import { dateRangeValidator } from './date-range.validator';
import { Row } from './interfaces/row.interface';

@Component({
  selector: 'tc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MatButtonModule, MatCardModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatTableModule, ReactiveFormsModule],
})
export class DashboardComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #dateAdapter = inject<DateAdapter<Date>>(DateAdapter);

  form = this.#formBuilder.group(
    {
      tenantLeft: this.#formBuilder.control(''),
      tenantMiddle: this.#formBuilder.control(''),
      tenantRight: this.#formBuilder.control(''),
      floor: this.#formBuilder.control('1', [Validators.required]),
      startDate: this.#formBuilder.control(new Date(2025, 0, 6), [Validators.required]),
      endDate: this.#formBuilder.control(new Date(2025, 11, 29), [Validators.required]),
    },
    { validators: dateRangeValidator() }
  );

  constructor() {
    this.#dateAdapter.setLocale('de-DE');
    this.#dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };

    this.form.valueChanges.subscribe((x) => {
      console.log(this.form.errors?.['dateRange']);
    });
  }

  readonly displayedColumns: string[] = ['week', 'tenant', 'completed'];
  dataSource = new MatTableDataSource<Row>();

  onSubmit(): void {
    const tenants: string[] = [];
    if (this.form.value.tenantLeft) {
      tenants.push(this.form.value.tenantLeft);
    }
    if (this.form.value.tenantMiddle) {
      tenants.push(this.form.value.tenantMiddle);
    }
    if (this.form.value.tenantRight) {
      tenants.push(this.form.value.tenantRight);
    }
    const rows: Row[] = this.#defineRows(tenants);
    this.dataSource = new MatTableDataSource(rows);
  }

  isContent(): boolean {
    return !!this.dataSource.data.length;
  }

  #defineRows(tenants: string[]) {
    let emptyRow = false;
    let weekStartDate = this.form.value.startDate;
    let weekEndDate = addDays(weekStartDate!, 6);
    const rows: Row[] = [];

    let index = 0;
    while (this.form.value.endDate! > weekEndDate) {
      const row = {
        week: `${format(weekStartDate!, 'dd.MM.yyyy')} - ${format(weekEndDate, 'dd.MM.yyyy')}`,
        tenant: emptyRow ? '' : tenants[index],
        completed: '',
      } as Row;
      rows.push(row);

      if (!emptyRow) {
        index = index < tenants.length - 1 ? ++index : 0;
      }
      emptyRow = !emptyRow;
      weekStartDate = addDays(weekEndDate, 1);
      weekEndDate = addDays(weekStartDate, 6);
    }
    return rows;
  }

  generatePDF() {
    const element = document.getElementById('canvas');
    if (!element) {
      console.error('Element not found!');
      return;
    }

    const doc = new jsPDF(); // Portrait, millimeters, A4 size

    doc.html(element, {
      callback: (doc) => {
        // Save the PDF
        doc.save('treppenreinigung-plan.pdf');
      },
      margin: [0, 10, 5, 10],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 675,
    });
  }
}
