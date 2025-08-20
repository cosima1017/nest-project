import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { IResponse } from 'src/common/interfaces/response.interface';

const storage = multer.diskStorage({
  destination: './uploads',
  filename(req, file, cb) {
    const ext = extname(file.originalname);
    const filename = uuid() + ext;
    cb(null, filename);
  },
});

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<string>> {
    return this.uploadService.uploadSingleFile(file);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage,
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IResponse<string[]>> {
    console.log(files, 23422);
    return this.uploadService.uploadMultipleFiles(files);
  }
}
