import { Component, TemplateRef, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

import { DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../environments/environment';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'tc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatToolbarModule, DashboardComponent],
})
export class AppComponent {
  private dialog = inject(MatDialog);
  private titleService = inject(Title);
  private document = inject<Document>(DOCUMENT);

  public appname: string;

  public constructor() {
    this.appname = environment.appname;
    this.titleService.setTitle(this.appname);
    this.document.body.classList.add(`${environment.theme}-theme`);
  }

  openDialog(ref: TemplateRef<Element>): void {
    this.dialog.open(ref, {
      maxWidth: '800px',
    });
  }
}
