import { Body, Controller, Get, Param, Post, Res, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { FileManagerService } from './filemanager..service';
import { Response } from 'express';



@Controller('filemanager')
export class FileManagerController {
    constructor(private readonly FileManagerService: FileManagerService) {}

    @Post('dossier/:dossierId')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Param('dossierId') dossierId: number, @UploadedFile() file: Express.Multer.File) {
        return this.FileManagerService.uploadFile(file, dossierId);
    }
    // @Post('download/:dossierId')
    // readFile(@Param('dossierId') dossierId: string,@Body() data: {fileName: string}) {
    //     return this.FileManagerService.readFile(+dossierId, data.fileName);
    // }

    @Post('download/:dossierId')
    async readFile(@Param('dossierId') dossierId: string, @Body() data: {fileName: string}, @Res() res: Response) {
        const { fileContent } = await this.FileManagerService.readFile(+dossierId, data.fileName);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${data.fileName}`
        });
        res.send(fileContent);
    }


    
    @Get('list/:dossierId')
    listFiles(@Param('dossierId') dossierId: number) {
        return this.FileManagerService.listFiles(dossierId);
    }

}
