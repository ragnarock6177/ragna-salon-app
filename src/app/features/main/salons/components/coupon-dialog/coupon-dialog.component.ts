import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-coupon-dialog',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    templateUrl: './coupon-dialog.component.html',
    styles: [`
    mat-form-field {
      width: 100%;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouponDialogComponent {
    private fb = inject(FormBuilder);
    private dialogRef = inject(MatDialogRef<CouponDialogComponent>);

    form: FormGroup = this.fb.group({
        code: ['', Validators.required],
        description: [''],
        discount: [null, [Validators.required, Validators.min(0)]],
        max_usage: [null],
        valid_from: ['', Validators.required],
        valid_to: ['', Validators.required],
        status: ['active', Validators.required]
    });

    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

    close() {
        this.dialogRef.close();
    }
}
