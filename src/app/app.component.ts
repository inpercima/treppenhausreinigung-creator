import { Component, DOCUMENT, inject, type TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'tc-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [MatButtonModule, MatDialogModule, MatToolbarModule, DashboardComponent],
})
export class AppComponent {
  readonly #dialog = inject(MatDialog);
  readonly #titleService = inject(Title);
  readonly #document = inject<Document>(DOCUMENT);

  appname: string;

  public constructor() {
    this.appname = environment.appname;
    this.#titleService.setTitle(this.appname);
    this.#document.body.classList.add(`${environment.theme}-theme`);
  }

  openDialog(ref: TemplateRef<Element>): void {
    this.#dialog.open(ref, {
      maxWidth: '800px',
    });
  }
}
