import { Component, Inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
    selector: 'app-scanner-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, ZXingScannerModule, LucideAngularModule],
    template: `
    <div class="relative bg-black rounded-xl overflow-hidden max-w-md w-full mx-auto shadow-2xl">
      <!-- Header Overlay -->
      <div class="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-linear-to-b from-black/80 to-transparent">
        <span class="text-white font-medium text-sm bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">Scan Salon QR</span>
        <button (click)="close()" class="text-white bg-black/40 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors">
          <lucide-icon [name]="'x'" class="w-5 h-5"></lucide-icon>
        </button>
      </div>

      <!-- Scanner -->
      <div class="relative aspect-square bg-black">
        @if (!hasPermission()) {
          <div class="absolute inset-0 flex items-center justify-center text-white z-10 p-6 text-center">
            <p>Camera permission is required to scan QR codes.</p>
          </div>
        }
        
        <zxing-scanner 
          [formats]="allowedFormats" 
          (scanSuccess)="onScanSuccess($event)"
          (permissionResponse)="onPermissionResponse($event)"
          [tryHarder]="true"
          class="w-full h-full object-cover">
        </zxing-scanner>

        <!-- Guide Frame -->
        <div class="absolute inset-0 border-2 border-violet-500/30 z-0 pointer-events-none">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-64 h-64 border-2 border-white/80 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    <div class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-violet-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                    <div class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-violet-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                    <div class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-violet-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                    <div class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-violet-500 -mb-1 -mr-1 rounded-br-lg"></div>
                </div>
            </div>
        </div>
      </div>
      
      <div class="bg-zinc-900 p-4 text-center">
        <p class="text-zinc-400 text-sm">Align the salon's QR code within the frame to redeem.</p>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannerDialogComponent {
    allowedFormats = [BarcodeFormat.QR_CODE];
    hasPermission = signal(true);

    constructor(
        public dialogRef: MatDialogRef<ScannerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onPermissionResponse(permission: boolean) {
        this.hasPermission.set(permission);
    }

    onScanSuccess(result: string) {
        this.dialogRef.close(result);
    }

    close() {
        this.dialogRef.close();
    }
}
