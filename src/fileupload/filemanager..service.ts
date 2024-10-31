import { Injectable, UploadedFile } from '@nestjs/common';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
@Injectable()
export class FileManagerService {

    async uploadFile(file: Express.Multer.File, dossierId: number) {
        const uploadPath = join(__dirname, '..', 'uploads', `${dossierId}_documents`);

        // Ensure the directory exists
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }

        const filePath = join(uploadPath, file.originalname);

        try {
            writeFileSync(filePath, file.buffer);
            return { message: 'File uploaded successfully!', file: file.originalname, path: filePath };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Error uploading file');
        }
    }

    async readFile(dossierId: number, fileName: string) {
        const filePath = join(__dirname, '..', 'uploads', `${dossierId}_documents`, fileName);
        try {
            const fileContent = readFileSync(filePath);
            return { fileContent };
        } catch (error) {
            console.error('Error reading file:', error);
            throw new Error('Error reading file');
        }
    }


    async listFiles(dossierId: number) {
        const uploadPath = join(__dirname, '..', 'uploads', `${dossierId}_documents`);
        try {
            if (!existsSync(uploadPath)) {
                return { message: 'No files found!', files: [] };
            }
            const files = readdirSync(uploadPath);
            return { message: 'Files listed successfully!', files };
        } catch (error) {
            console.error('Error listing files:', error);
            return { message: 'Error listing files', files: [] };
        }
    }
    
}