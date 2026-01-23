import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule, Scan, X } from 'lucide-angular';

@Component({
    selector: 'app-scanner',
    standalone: true,
    imports: [
        CommonModule,
        ZXingScannerModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        LucideAngularModule
    ],
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannerComponent implements OnInit {
    allowedFormats = [BarcodeFormat.QR_CODE];
    scanResult: string | null = null;
    isScanning = true;
    hasPermission: boolean = false;

    readonly ScanIcon = Scan;
    readonly CloseIcon = X;

    constructor() { }

    ngOnInit(): void {
    }

    onScanSuccess(result: string) {
        console.log('Scan result:', result);
        this.scanResult = result;
        this.isScanning = false;
    }

    onPermissionResponse(permission: boolean) {
        this.hasPermission = permission;
    }

    resetScan() {
        this.scanResult = null;
        this.isScanning = true;
    }
}
