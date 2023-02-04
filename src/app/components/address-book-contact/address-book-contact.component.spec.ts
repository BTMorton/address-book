import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAddressBookContact } from 'src/app/interfaces/iaddress-book-contact';
import { AddressBookService } from 'src/app/services/address-book.service';

import { AddressBookContactComponent } from './address-book-contact.component';

describe('AddressBookContactComponent', () => {
	let component: AddressBookContactComponent;
	let fixture: ComponentFixture<AddressBookContactComponent>;
	let contact: IAddressBookContact;
	let addressBookService: AddressBookService;

	beforeEach(async () => {
		addressBookService = jasmine.createSpyObj<AddressBookService>("Address Book Service Spy", [], {
			contacts: []
		});

		await TestBed.configureTestingModule({
			imports: [
				MatDialogModule
			],
			declarations: [
				AddressBookContactComponent,
			],
			providers: [
				{
					provide: AddressBookService,
					useValue: addressBookService
				},
				{
					provide: MAT_DIALOG_DATA,
					useFactory: () => contact
				}
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(AddressBookContactComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
