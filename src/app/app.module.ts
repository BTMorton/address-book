import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddressBookComponent } from './components/address-book/address-book.component';
import { EditContactComponent } from './components/edit-contact/edit-contact.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule } from '@angular/forms';
import { AddressBookContactComponent } from './components/address-book-contact/address-book-contact.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
	declarations: [
		AppComponent,
		AddressBookComponent,
		EditContactComponent,
		AddressBookContactComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatTableModule,
		MatSortModule,
		MatDialogModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
