import { Injectable } from '@angular/core';
import { IAddressBookContact } from '../interfaces/iaddress-book-contact';
import { faker } from "@faker-js/faker";
import { ReplaySubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AddressBookService {
	readonly #contactChangeSubject = new ReplaySubject<IAddressBookContact[]>(1);
	#contacts = new Map<number, IAddressBookContact>();
	#nextId = 1;

	constructor() {
		this.#contacts = new Map(
			Array.from({ length: 20 }, () => ({
				id: this.#nextId++,
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				phoneNumber: faker.phone.number(),
				email: faker.internet.email(),
				address: `${faker.address.streetAddress()}\n${faker.address.cityName()}\n${faker.address.country()}`
			} as IAddressBookContact))
				.map(contact => [contact.id, contact])
		);
		this.#nextId = Math.max.apply(null, [...this.#contacts.keys()]) + 1;

		this.onContactsChange();
	}

	public get contactChanges() {
		return this.#contactChangeSubject.asObservable();
	}

	public get contacts() {
		return Array.from(this.#contacts.values());
	}

	public updateContact(contactDetails: Omit<IAddressBookContact, "id">, id?: number) {
		if (id == null)
			id = this.#nextId++;

		const contact = {
			...contactDetails,
			id,
		};
		this.#contacts.set(id, contact);
		this.onContactsChange();

		return id;
	}

	public getContact(id: number) {
		return this.#contacts.get(id);
	}

	public removeContactById(id: number) {
		this.#contacts.delete(id);
		this.onContactsChange();
	}

	public removeContact(entry: IAddressBookContact) {
		this.removeContactById(entry.id);
	}

	private onContactsChange() {
		this.#contactChangeSubject.next([...this.#contacts.values()]);
	}
}
