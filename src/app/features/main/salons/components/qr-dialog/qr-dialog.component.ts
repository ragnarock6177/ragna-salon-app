import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-qr-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, LucideAngularModule],
    templateUrl: './qr-dialog.component.html',
    styleUrl: './qr-dialog.component.scss'
})
export class QrDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<QrDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { qrUrl: any, salonName: string }
    ) {
        console.log(this.data);
    }

    downloadQr() {
        const qrCodeUrl = this.data.qrUrl?.qrCodeUrl;
        if (!qrCodeUrl) return;

        // If it's a data URL, we can use it directly, but fetch -> blob is safer for proper downloading
        fetch(qrCodeUrl)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `QR-${this.data.salonName.replace(/\s+/g, '-')}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            })
            .catch(console.error);
    }

    close() {
        this.dialogRef.close();
    }
}
