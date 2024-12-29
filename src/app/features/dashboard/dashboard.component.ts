import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { addDays, format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { dateRangeValidator } from './date-range.validator';

@Component({
  selector: 'tc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MatButtonModule, MatCardModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
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
  }

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
    const rows = this.#defineRows(tenants);
    this.#generatePDF(rows);
  }

  #defineRows(tenants: string[]): RowInput[] {
    let emptyRow = false;
    let weekStartDate = this.form.value.startDate;
    let weekEndDate = addDays(weekStartDate!, 6);
    const rows: RowInput[] = [];

    let index = 0;
    while (this.form.value.endDate! > weekEndDate) {
      const row = {
        week: `${format(weekStartDate!, 'dd.MM.yyyy')} - ${format(weekEndDate, 'dd.MM.yyyy')}`,
        tenant: emptyRow ? '' : tenants[index],
        completed: '',
      } as RowInput;
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

  #generatePDF(rows: RowInput[]): void {
    const doc = new jsPDF(); // Portrait, millimeters, A4 size

    const floor = this.form.value.floor === '0' ? 'EG' : `${this.form.value.floor}. OG`;
    const title = `Treppenreinigung ${floor}`;
    doc.setFontSize(19);
    doc.setFont('Helvetica', 'normal', 'bold');
    doc.text(title, 10, 18);

    const img = new Image();
    img.src = 'treppenhaus.png';
    const pageSize = doc.internal.pageSize;
    doc.addImage(img, 'png', pageSize.getWidth() - 78, 5, 68, 28);

    autoTable(doc, {
      head: [{ week: 'Woche', tenant: 'Mietpartei', completed: 'Erledigt durch/am' }],
      body: rows,
      styles: { cellPadding: 0.8, fontSize: 8 },
      startY: 35,
      margin: { left: 10, right: 10 },
    });

    doc.save('treppenreinigung-plan.pdf');
  }
}
