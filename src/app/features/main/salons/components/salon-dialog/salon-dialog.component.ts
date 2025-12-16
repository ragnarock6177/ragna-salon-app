import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { LucideAngularModule } from 'lucide-angular';
import { Salon } from '../../../../../shared/models/salon';
import { ApiService } from '../../../../../services/api.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-salon-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        LucideAngularModule
    ],
    templateUrl: './salon-dialog.component.html',
    styles: []
})
export class SalonDialogComponent implements OnInit {
    form: FormGroup;
    isEditMode: boolean;
    private apiService = inject(ApiService);
    cities: any[] = [];

    servicesList: string[] = [
        'Haircut',
        'Hair Coloring',
        'Hairstyling',
        'Manicure',
        'Pedicure',
        'Makeup',
        'Facial',
        'Massage',
        'Waxing',
        'Nail Art'
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SalonDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Salon | null
    ) {
        this.isEditMode = !!data;
        this.form = this.fb.group({
            name: [data?.name || '', [Validators.required]],
            address: [data?.address || '', [Validators.required]],
            phone: [data?.phone || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            email: [data?.email || '', [Validators.required, Validators.email]],
            owner_name: [data?.owner_name || '', [Validators.required]],
            services: [JSON.parse(data?.services || '[]') || [], [Validators.required]],
            rating: [data?.rating || '', [Validators.required, Validators.min(0), Validators.max(5)]],
            city_id: [data?.city_id || '', [Validators.required]]
        });
    }

    ngOnInit() {
        this.apiService.getCities().pipe(
            map((response: any) => response.data)
        ).subscribe({
            next: (cities) => {
                this.cities = cities;
            },
            error: (err) => console.error('Error loading cities', err)
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

    onCancel() {
        this.dialogRef.close();
    }
}
