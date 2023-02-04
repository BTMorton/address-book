import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { IAddressBookContact } from 'src/app/interfaces/iaddress-book-contact';
import { AddressBookService } from 'src/app/services/address-book.service';
import { AddressBookContactComponent } from '../address-book-contact/address-book-contact.component';

@Component({
	selector: 'app-address-book',
	templateUrl: './address-book.component.html',
	styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements AfterViewInit, OnDestroy {
	#unsubscribe = new Subject<void>();
	#contacts: IAddressBookContact[] = [];

	@ViewChild(MatSort, { static: false })
	public matSort!: MatSort;
	public searchField = new FormControl();
	public dataSource = new MatTableDataSource<IAddressBookContact>();

	public columnDefs = ["icon", "firstName", "lastName", "phoneNumber", "email", "actions"];

	constructor(
		private readonly addressBookService: AddressBookService,
		private readonly dialog: MatDialog
	) {
		this.subscribeToAddressBookChanges();
		this.subscribeToSearch();
		this.dataSource.filterPredicate = (data, filter) => {
			return data.firstName.toLowerCase().startsWith(filter.toLowerCase())
				|| data.lastName.toLowerCase().startsWith(filter.toLowerCase());
		};
	}

	get contacts() {
		return this.#contacts;
	}

	set contacts(contacts: IAddressBookContact[]) {
		this.#contacts = contacts;
		this.dataSource.data = contacts;
	}

	public ngAfterViewInit(): void {
		this.dataSource.sort = this.matSort;
	}

	public ngOnDestroy(): void {
		this.#unsubscribe.next();
		this.#unsubscribe.complete();
	}

	public trackBy(_: number, contact: IAddressBookContact) {
		return contact.id;
	}

	public removeContact(contact: IAddressBookContact) {
		this.addressBookService.removeContact(contact);
	}

	public showContact(contact: IAddressBookContact) {
		this.dialog.open(AddressBookContactComponent, {
			closeOnNavigation: true,
			data: contact
		});
	}

	public clearSearch() {
		this.searchField.setValue("");
		this.dataSource.filter = "";
	}

	private subscribeToAddressBookChanges() {
		this.addressBookService.contactChanges
			.pipe(
				takeUntil(this.#unsubscribe)
			)
			.subscribe((contacts) => this.contacts = contacts);
	}

	private subscribeToSearch() {
		this.searchField.valueChanges
			.pipe(
				takeUntil(this.#unsubscribe),
				debounceTime(500)
			)
			.subscribe(search => this.dataSource.filter = search);
	}
}
