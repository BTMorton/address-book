import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EditContactComponent } from './edit-contact.component';

describe('EditContactComponent', () => {
	let component: EditContactComponent;
	let fixture: ComponentFixture<EditContactComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatFormFieldModule,
				MatInputModule,
				ReactiveFormsModule,
				RouterTestingModule,
				MatIconModule,
				MatInputModule,
				NoopAnimationsModule
			],
			declarations: [
				EditContactComponent
			],
			providers: [
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(EditContactComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
