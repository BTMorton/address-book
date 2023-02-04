import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAddressBookContact } from 'src/app/interfaces/iaddress-book-contact';
import { AddressBookService } from 'src/app/services/address-book.service';

@Component({
	selector: 'app-address-book-contact',
	templateUrl: './address-book-contact.component.html',
	styleUrls: ['./address-book-contact.component.scss']
})
export class AddressBookContactComponent {
	constructor(
		private readonly addressBookService: AddressBookService,
		@Inject(MAT_DIALOG_DATA) public contact: IAddressBookContact
	) {}

	public removeContact(contact: IAddressBookContact) {
		this.addressBookService.removeContact(contact);
	}
}
