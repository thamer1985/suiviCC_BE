import { Body, Controller, Get, Param, Post, Res, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { FileManagerService } from './filemanager..service';
import { Response } from 'express';
import { extname } from 'path';



@Controller('filemanager')
export class FileManagerController {
    constructor(private readonly fileManagerService: FileManagerService) {}

    @Post('dossier/:dossierId')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Param('dossierId') dossierId: number, @UploadedFile() file: Express.Multer.File) {
        return this.fileManagerService.uploadFile(file, dossierId);
    }
    // @Post('download/:dossierId')
    // readFile(@Param('dossierId') dossierId: string,@Body() data: {fileName: string}) {
    //     return this.FileManagerService.readFile(+dossierId, data.fileName);
    // }

    @Post('download/:dossierId')
    async readFile(@Param('dossierId') dossierId: string, @Body() data: {fileName: string}, @Res() res: Response) {
        const { fileContent } = await this.fileManagerService.readFile(+dossierId, data.fileName);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${data.fileName}`
        });
        res.send(fileContent);
    }

    @Get('list/:dossierId')
    listFiles(@Param('dossierId') dossierId: number) {
        return this.fileManagerService.listFiles(dossierId);
    }


    @Post('chronologie/:chronologieId/dossier/:dossierId')
    @UseInterceptors(FileInterceptor('file'))
    async uploadChronologieFile(@Param('dossierId') dossierId: number, @Param('chronologieId') chronologieId: number , @UploadedFile() file: Express.Multer.File) {
        const result = await this.fileManagerService.uploadChronologieFile(file, +dossierId, +chronologieId);
        // Here you might want to update the Chronologie record with the filePath
        // await this.someService.updateChronologieFilePath(chronologieId, result.filePath);
        return result;
    }

    @Post('download/chronologie/:chronologieId/dossier/:dossierId')
    async readChronologieFile(@Param('dossierId') dossierId: number, @Param('chronologieId') chronologieId: number, @Body() data: { fileName: string }, @Res() res: Response) {
        const fileContent = await this.fileManagerService.readChronologieFile(dossierId, chronologieId, data.fileName);
        const fileExt = extname(data.fileName).toLowerCase();
        let contentType = 'application/octet-stream';

        switch (fileExt) {
            case '.pdf':
                contentType = 'application/pdf';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.csv':
                contentType = 'text/csv';
                break;
            case '.xls':
                contentType = 'application/vnd.ms-excel';
                break;
            case '.xlsx':
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
        }

        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename=${data.fileName}`
        });

        res.send(fileContent);
    }

    @Get('chronologie/:dossierId/:chronologieId')
    async listChronologieFiles(@Param('dossierId') dossierId: number, @Param('chronologieId') chronologieId: number) {
        return this.fileManagerService.listchronologieFiles(dossierId, chronologieId);
    }
    

}
