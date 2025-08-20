import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma/prisma.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { IUploadFile } from 'src/common/interfaces/upload.interface';

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 上传文件(单文件)
   * @param file 文件
   * @returns 文件信息
   */
  async uploadSingleFile(
    file: Express.Multer.File,
    userId?: number,
  ): Promise<IResponse<string>> {
    const {
      originalname: originalName,
      filename: fileName,
      path: filePath,
      size: fileSize,
      mimetype: fileType,
    } = file;
    const fileExt = fileName.split('.').pop();
    const fileUrl = `/uploads/${fileName}`;
    await this.prismaService.create<string, Partial<IUploadFile>>(
      'file_uploads',
      {
        originalName,
        fileName,
        fileExt,
        filePath,
        fileSize,
        fileType,
        fileUrl,
        createdBy: userId ?? null,
      },
    );
    return {
      message: '上传成功',
      data: fileUrl,
    };
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    userId?: number,
  ): Promise<IResponse<string[]>> {
    const fileUrls = await Promise.all(
      files.map((file) => this.uploadSingleFile(file, userId)),
    );
    return {
      message: '上传成功',
      data: fileUrls.map((fileUrl) => fileUrl.data).filter(Boolean) as string[],
    };
  }
}
