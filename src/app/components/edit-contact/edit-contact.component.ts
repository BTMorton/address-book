import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, first, fromEvent, map, Subject, takeUntil } from 'rxjs';
import { IAddressBookContact } from 'src/app/interfaces/iaddress-book-contact';
import { AddressBookService } from 'src/app/services/address-book.service';

@Component({
	selector: 'app-edit-contact',
	templateUrl: './edit-contact.component.html',
	styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements AfterViewInit, OnDestroy {
	//	Generic intl phone number regex, based on one found at: https://uibakery.io/regex-library/phone-number
	static readonly PhoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}(\s*x[0-9]{1,5})?$/
	readonly #unsubscribe = new Subject<void>();

	public editingContact?: IAddressBookContact;
	@ViewChild("form") public formElement?: ElementRef;
	public contactDetails = new FormGroup({
		firstName: new FormControl("", { nonNullable: true, validators: [ Validators.required ]}),
		lastName: new FormControl("", { nonNullable: true, validators: [ Validators.required ]}),
		phoneNumber: new FormControl("", { nonNullable: true, validators: [ Validators.pattern(EditContactComponent.PhoneRegex) ] }),
		email: new FormControl("", { nonNullable: true, validators: [ Validators.email ] }),
		address: new FormControl("", { nonNullable: true }),
	});

	constructor(
		private readonly addressBookService: AddressBookService,
		private readonly router: Router,
		route: ActivatedRoute
	) {
		route.params.pipe(
			first(),
			map(data => parseInt(data["uid"], 10)),
			map(id => this.addressBookService.getContact(id)),
		)
			.subscribe(contact => {
				this.editingContact = contact;

				if (contact != null)
					//	Need to re-create the object to match the form's type and fill in any blank properties
					this.contactDetails.setValue({
						firstName: contact.firstName,
						lastName: contact.lastName,
						phoneNumber: contact.phoneNumber ?? "",
						email: contact.email ?? "",
						address: contact.address ?? ""
					});
			});
	}

	public ngAfterViewInit(): void {
		fromEvent(this.formElement?.nativeElement, "submit")
			.pipe(
				takeUntil(this.#unsubscribe),
				filter(() => this.contactDetails.valid),
				//	Need to ensure first and last name are specified as they are required by the interface
				//	Default empty values will be overriden by the spread operator
				map(() => ({
					firstName: "",
					lastName: "",
					...this.contactDetails.value
				})),
				map((contact) => this.addressBookService.updateContact(contact, this.editingContact?.id))
			)
			.subscribe(() => {
				this.router.navigateByUrl(`/`)
			});
	}

	public ngOnDestroy(): void {
		this.#unsubscribe.next();
	}
}
