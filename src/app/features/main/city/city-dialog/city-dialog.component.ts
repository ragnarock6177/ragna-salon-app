import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../../services/api.service';
import { City } from '../../../../shared/models/city';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-city-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        LucideAngularModule
    ],
    templateUrl: './city-dialog.component.html',
    styleUrl: './city-dialog.component.scss',
})
export class CityDialogComponent {
    cityForm: FormGroup;
    isEditMode: boolean = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CityDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { city?: City },
        private apiService: ApiService
    ) {
        this.isEditMode = !!data?.city;

        this.cityForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]]
        });

        if (this.isEditMode && data.city) {
            this.cityForm.patchValue(data.city);
        }
    }

    onSubmit(): void {
        if (this.cityForm.valid) {
            const cityData = this.cityForm.value;
            if (this.isEditMode) {
                this.apiService.updateCity(this.data.city?.id!, cityData).subscribe({
                    next: () => this.dialogRef.close(cityData),
                    error: (err) => console.error('Add failed', err)
                });
            } else {
                this.apiService.addCity(cityData).subscribe({
                    next: () => this.dialogRef.close(cityData),
                    error: (err) => console.error('Add failed', err)
                });
            }
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
