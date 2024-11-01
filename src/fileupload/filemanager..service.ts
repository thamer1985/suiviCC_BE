import { Injectable, UploadedFile } from '@nestjs/common';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class FileManagerService {
    constructor(
        private prismaService: PrismaService
      ) {}

    async uploadFile(file: Express.Multer.File, dossierId: number) {
        const uploadPath = join(__dirname, '..', 'uploads', `${dossierId}_documents`,'Dossier');

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
        const filePath = join(__dirname, '..', 'uploads', `${dossierId}_documents`,'Dossier', fileName);
        try {
            const fileContent = readFileSync(filePath);
            return { fileContent };
        } catch (error) {
            console.error('Error reading file:', error);
            throw new Error('Error reading file');
        }
    }


    async listFiles(dossierId: number) {
        const uploadPath = join(__dirname, '..', 'uploads', `${dossierId}_documents`,'Dossier');
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

    async readChronologieFile(dossierId: number, chronologieId: number, fileName: string) {
        const filePath = join(__dirname, '..', 'uploads', `${dossierId}_documents`, `${chronologieId}`, fileName);
        
        try {
            const fileContent = readFileSync(filePath);
            return fileContent;
        } catch (error) {
            console.error('Error reading file:', error);
            throw new Error('Error reading file');
        }
    }

    async uploadChronologieFile(file: Express.Multer.File, dossierId: number, chronologieId: number) {
        const uploadPath = join(__dirname, '..', 'uploads', `${dossierId}_documents`, `${chronologieId}`);
        
        // Ensure the directory exists
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }
        
        const filePath = join(uploadPath, file.originalname);
        
        try {
            writeFileSync(filePath, file.buffer);
            await this.prismaService.chronologie.update({ where: { id: chronologieId }, data: { filePath: filePath } });
            return { message: 'File uploaded successfully!', filePath };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Error uploading file');
        }
    }
    async listchronologieFiles(dossierId: number, chronologieId: number) {
        const uploadPath = join(__dirname, '..', 'uploads', `${dossierId}_documents`, `${chronologieId}`);
        
        try {
            const files = existsSync(uploadPath) ? readdirSync(uploadPath) : [];
            return { message: 'Files listed successfully!', files };
        } catch (error) {
            console.error('Error listing files:', error);
            return { message: 'Error listing files', files: [] };
        }
    }

    
}