import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { addDays, format } from 'date-fns';
import jsPDF from 'jspdf';

export interface Row {
  week: string;
  tenant: string;
  completed: string;
}

@Component({
  selector: 'tc-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  form!: FormGroup;

  readonly displayedColumns: string[] = ['week', 'tenant', 'completed'];
  dataSource = new MatTableDataSource<Row>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tenantLeft: [''],
      tenantMiddle: [''],
      tenantRight: [''],
    });
  }

  onSubmit(): void {
    const startDate = new Date(2025, 0, 6);
    const endDate = new Date(2025, 11, 31);
    let emptyRow = false;
    let weekStartDate = startDate;
    let weekEndDate = addDays(startDate, 6);
    const rows: Row[] = [];
    while (endDate > weekEndDate) {
      const test = {
        week: format(weekStartDate, 'dd.MM.yyyy') + ' - ' + format(weekEndDate, 'dd.MM.yyyy'),
        tenant: emptyRow ? '' : 'Mieter',
        completed: '',
      } as Row;
      rows.push(test);
      emptyRow = !emptyRow;
      weekStartDate = addDays(weekEndDate, 1);
      weekEndDate = addDays(weekStartDate, 6);
    }
    this.dataSource = new MatTableDataSource(rows);
  }

  generatePDF() {
    const element = document.getElementById('canvas');
    if (!element) {
      console.error('Element not found!');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

    doc.html(element, {
      callback: function (doc) {
        // Save the PDF
        doc.save('document-html.pdf');
      },
      margin: [10, 10, 10, 10],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 675,
    });
  }
}
