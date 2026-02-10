import { Component, Inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-scanner-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ZXingScannerModule, LucideAngularModule],
  template: `
    <div class="relative bg-black rounded-2xl overflow-hidden max-w-md w-full mx-auto shadow-2xl">
      <!-- Close Button -->
      <button (click)="close()" 
        class="absolute top-4 right-4 z-30 text-white bg-black/40 backdrop-blur-md p-2.5 rounded-full hover:bg-black/60 transition-all hover:rotate-90 duration-300 border border-white/20">
        <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
      </button>

      <!-- Scanner Container -->
      <div class="relative aspect-square bg-black">
        <!-- Permission Denied Message -->
        @if (!hasPermission()) {
          <div class="absolute inset-0 flex flex-col items-center justify-center text-white z-30 p-8 text-center bg-black/95 backdrop-blur-sm">
            <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <lucide-icon name="camera-off" class="w-10 h-10 text-red-400"></lucide-icon>
            </div>
            <h3 class="text-lg font-bold mb-2">Camera Access Required</h3>
            <p class="text-slate-300 text-sm mb-4">Please allow camera access to scan QR codes.</p>
          </div>
        }
        
        <!-- Scanner -->
        <zxing-scanner 
          [formats]="allowedFormats" 
          (scanSuccess)="onScanSuccess($event)"
          (permissionResponse)="onPermissionResponse($event)"
          [tryHarder]="true"
          class="w-full h-full object-cover">
        </zxing-scanner>

        <!-- Guide Frame with Corners -->
        <div class="absolute inset-0 z-10 pointer-events-none">
          <div class="absolute inset-0 flex items-center justify-center">
            <!-- Dark Overlay -->
            <div class="absolute inset-0 bg-black/60"></div>
            
            <!-- Scanning Frame -->
            <div class="relative w-64 h-64 z-10">
              <!-- Corner Brackets -->
              <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-xl"></div>
              <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-xl"></div>
              <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-xl"></div>
              <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-xl"></div>
              
              <!-- Center Border -->
              <div class="absolute inset-0 border-2 border-white/30 rounded-2xl"></div>
              
              <!-- Scanning Line Animation -->
              @if (hasPermission()) {
                <div class="absolute inset-0 overflow-hidden rounded-2xl">
                  <div class="scan-line"></div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Success Animation -->
        @if (isScanning()) {
          <div class="absolute inset-0 flex items-center justify-center z-30 bg-green-500/20 backdrop-blur-sm animate-fade-in">
            <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
              <lucide-icon name="check" class="w-10 h-10 text-white"></lucide-icon>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }

    .animate-scale-in {
      animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannerDialogComponent {
  allowedFormats = [BarcodeFormat.QR_CODE];
  hasPermission = signal(true);
  isScanning = signal(false);

  constructor(
    public dialogRef: MatDialogRef<ScannerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onPermissionResponse(permission: boolean) {
    this.hasPermission.set(permission);
  }

  onScanSuccess(result: string) {
    this.isScanning.set(true);
    // Show success animation briefly before closing
    setTimeout(() => {
      this.dialogRef.close(result);
    }, 500);
  }

  close() {
    this.dialogRef.close();
  }
}
