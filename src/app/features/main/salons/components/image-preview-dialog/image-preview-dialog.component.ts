import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, LucideAngularModule],
  template: `
    <div class="relative w-full h-full flex flex-col bg-black/90">
      <div class="absolute top-4 right-4 z-50">
        <button mat-icon-button (click)="close()" class="text-white hover:bg-white/20">
          <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
        </button>
      </div>
      
      <div class="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <img [src]="data.imageUrl" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" alt="Preview">
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
