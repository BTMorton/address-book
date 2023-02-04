import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressBookComponent } from './components/address-book/address-book.component';
import { EditContactComponent } from './components/edit-contact/edit-contact.component';

const routes: Routes = [
	{ path: "", component: AddressBookComponent },
	{ path: "add", component: EditContactComponent },
	{ path: "edit/:uid", component: EditContactComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
