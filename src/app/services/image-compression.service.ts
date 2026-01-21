import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';

@Injectable({
    providedIn: 'root'
})
export class ImageCompressionService {

    constructor() { }

    async compressImage(file: File): Promise<File> {
        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.7
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Image compression failed:', error);
            // Fallback to original file if compression fails
            return file;
        }
    }
}
