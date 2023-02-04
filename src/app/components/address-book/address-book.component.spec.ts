import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { IAddressBookContact } from 'src/app/interfaces/iaddress-book-contact';
import { AddressBookService } from 'src/app/services/address-book.service';
import { AddressBookContactComponent } from '../address-book-contact/address-book-contact.component';
import { EditContactComponent } from '../edit-contact/edit-contact.component';

import { AddressBookComponent } from './address-book.component';

describe('AddressBookComponent', () => {
	let component: AddressBookComponent;
	let fixture: ComponentFixture<AddressBookComponent>;
	let addressBookService: jasmine.SpyObj<AddressBookService>;
	let contacts: IAddressBookContact[] = [];
	const contactChangeSubject = new Subject<IAddressBookContact[]>();
	const routes = [
		{ path: "", component: AddressBookComponent },
		{ path: "edit/:id", component: EditContactComponent },
	]

	beforeEach(async () => {
		addressBookService = jasmine.createSpyObj<AddressBookService>(
			"Address Book Service Spy",
			[
				"removeContact"
			],
			{
				contacts: [],
				contactChanges: contactChangeSubject.asObservable()
			}
		);

		(Object.getOwnPropertyDescriptor(addressBookService, "contacts")?.get as jasmine.Spy).and.callFake(() => contacts);

		await TestBed.configureTestingModule({
			imports: [
				NoopAnimationsModule,
				MatToolbarModule,
				MatTableModule,
				MatIconModule,
				MatDialogModule,
				MatFormFieldModule,
				ReactiveFormsModule,
				MatTooltipModule,
				MatInputModule,
				MatSortModule,
				RouterTestingModule.withRoutes(routes)
			],
			declarations: [
				AddressBookComponent,
				EditContactComponent
			],
			providers: [
				{
					provide: AddressBookService,
					useValue: addressBookService
				}
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(AddressBookComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe("when there are no contacts", () => {
		it("should display a help message", () => {
			const helpMessage = fixture.debugElement.query(By.css(".no-contacts"));
			expect(helpMessage).not.toBeNull();

			expect(helpMessage.nativeElement.textContent.trim()).toEqual("Add a new contact to get started");
		});
	});

	describe("when some contacts have been configured", () => {
		beforeEach(async () => {
			contacts = [
				{
					id: 1,
					firstName: "Peter",
					lastName: "Parker"
				},
				{
					id: 2,
					firstName: "Matt",
					lastName: "Murdock"
				},
				{
					id: 3,
					firstName: "Otto",
					lastName: "Octavius"
				},
				{
					id: 4,
					firstName: "Steven",
					lastName: "Strange"
				}
			]
			contactChangeSubject.next(contacts);

			fixture.detectChanges();
			await fixture.whenRenderingDone();
		});

		it("should not display a help message", () => {
			const helpMessage = fixture.debugElement.query(By.css(".no-contacts"));
			expect(helpMessage).toBeNull();
		});

		it("should display a list of contacts", () => {
			const rows = fixture.debugElement.queryAll(By.css("tr"));
			expect(rows.length).toBe(5);
		});

		it("should navigate to the edit page when clicking edit", inject([Router], async (router: Router) => {
			const firstContactRow = fixture.debugElement.queryAll(By.css("tr"))[1];

			const editButton = firstContactRow.query(By.css("button"));
			(editButton.nativeElement as HTMLElement).click();

			await fixture.whenStable();

			expect(router.url).toBe("/edit/1");
		}));

		it("should remove the contact when clicking delete", async () => {
			const firstContactRow = fixture.debugElement.queryAll(By.css("tr"))[1];

			const editButton = firstContactRow.queryAll(By.css("button"))[1];
			(editButton.nativeElement as HTMLElement).click();

			await fixture.whenStable();

			expect(addressBookService.removeContact).toHaveBeenCalledWith(contacts[0]);
		});

		it("should show a details dialog when clicking the contact", inject([MatDialog], (dialog: MatDialog) => {
			spyOn(dialog, "open").and.stub();

			const firstContactRow = fixture.debugElement.queryAll(By.css("tr"))[1];
			(firstContactRow.nativeElement as HTMLElement).click();

			expect(dialog.open).toHaveBeenCalledWith(
				AddressBookContactComponent,
				{
					data: contacts[0],
					closeOnNavigation: true
				}
			);
		}));

		describe("when sorting by first name", () => {
			it("should sort contacts alphabetically, ascending", () => {
				const firstNameHeader = fixture.debugElement.query(By.css("tr th.mat-column-firstName .mat-sort-header-container"));

				firstNameHeader.nativeElement.click();
				fixture.detectChanges();

				const firstNameCells = fixture.debugElement.queryAll(By.css("tr td.mat-column-firstName"));
				expect(firstNameCells[0].nativeElement.textContent).toBe("Matt");
				expect(firstNameCells[1].nativeElement.textContent).toBe("Otto");
				expect(firstNameCells[2].nativeElement.textContent).toBe("Peter");
				expect(firstNameCells[3].nativeElement.textContent).toBe("Steven");
			});

			it("should sort contacts alphabetically, descending", () => {
				const firstNameHeader = fixture.debugElement.query(By.css("tr th.mat-column-firstName"));

				firstNameHeader.nativeElement.click();
				fixture.detectChanges();

				firstNameHeader.nativeElement.click();
				fixture.detectChanges();

				const firstNameCells = fixture.debugElement.queryAll(By.css("tr td.mat-column-firstName"));
				expect(firstNameCells[0].nativeElement.textContent).toBe("Steven");
				expect(firstNameCells[1].nativeElement.textContent).toBe("Peter");
				expect(firstNameCells[2].nativeElement.textContent).toBe("Otto");
				expect(firstNameCells[3].nativeElement.textContent).toBe("Matt");
			});
		});

		describe("when sorting by last name", () => {
			it("should sort contacts alphabetically, ascending", () => {
				const lastNameHeader = fixture.debugElement.query(By.css("tr th.mat-column-lastName .mat-sort-header-container"));

				lastNameHeader.nativeElement.click();
				fixture.detectChanges();

				const lastNameCells = fixture.debugElement.queryAll(By.css("tr td.mat-column-lastName"));
				expect(lastNameCells[0].nativeElement.textContent).toBe("Murdock");
				expect(lastNameCells[1].nativeElement.textContent).toBe("Octavius");
				expect(lastNameCells[2].nativeElement.textContent).toBe("Parker");
				expect(lastNameCells[3].nativeElement.textContent).toBe("Strange");
			});
			it("should sort contacts alphabetically, descending", () => {
				const lastNameHeader = fixture.debugElement.query(By.css("tr th.mat-column-lastName .mat-sort-header-container"));

				lastNameHeader.nativeElement.click();
				fixture.detectChanges();

				lastNameHeader.nativeElement.click();
				fixture.detectChanges();

				const lastNameCells = fixture.debugElement.queryAll(By.css("tr td.mat-column-lastName"));
				expect(lastNameCells[0].nativeElement.textContent).toBe("Strange");
				expect(lastNameCells[1].nativeElement.textContent).toBe("Parker");
				expect(lastNameCells[2].nativeElement.textContent).toBe("Octavius");
				expect(lastNameCells[3].nativeElement.textContent).toBe("Murdock");
			});
		});

		describe("when searching for an entry", () => {
			it("should search by first name", async () => {
				const searchBar = fixture.debugElement.query(By.css(".search input")).nativeElement as HTMLInputElement;
				searchBar.value = "st";
				searchBar.dispatchEvent(new Event('input'));

				fixture.detectChanges();
				await fixture.whenStable();

				const firstNameCells = fixture.debugElement.queryAll(By.css("tr td.mat-column-firstName"));
				expect(firstNameCells.length).toBe(1);
				expect(firstNameCells[0].nativeElement.innerText).toBe("Steven");
			});

			it("should search by last name", async () => {
				const searchBar = fixture.debugElement.query(By.css(".search input")).nativeElement as HTMLInputElement;
				searchBar.value = "oct";
				searchBar.dispatchEvent(new Event('input'));

				fixture.detectChanges();
				await fixture.whenStable();

				const lastNameCells = fixture.debugElement.queryAll(By.css("tr td.mat-column-lastName"));
				expect(lastNameCells.length).toBe(1);
				expect(lastNameCells[0].nativeElement.innerText).toBe("Octavius");
			});
		});
	});
});
