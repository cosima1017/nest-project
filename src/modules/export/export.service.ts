import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { Response } from 'express';

@Injectable()
export class ExportService {
  /**
   * 导出Exccel文件
   * @param headers 表头配置文件名
   * @param data 数据
   * @param fileName 文件名
   * @param sheetName 工作表名
   * @returns 文件路径
   */
  async exportExcel<T>(
    res: Response,
    headers: {
      key: string;
      header: string;
      witch?: number;
    }[],
    data: T[],
    fileName: string,
    sheetName: string = 'Sheet1',
    user?: any,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    // 设置工作簿属性
    workbook.creator = user?.username || 'Admin';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastModifiedBy = user?.username || 'Admin';
    // 添加工作表
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = headers.map((header) => ({
      header: header.header,
      key: header.key,
      width: header.witch || 20,
    }));
    // 添加数据
    worksheet.addRows(data);

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    // 设置响应头
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent(fileName)}.xlsx`,
    );

    // 直接将工作簿写入响应流
    await workbook.xlsx.write(res);
    res.end();
  }

  /**
   * 导出文件
   * @param fileName 文件名
   * @param customDir 自定义目录
   * @returns 流文件
   * */
  async exportFile(
    res: Response,
    fileName: string,
    customDir: string = 'exports',
  ): Promise<void> {
    try {
      const exportDir = path.join(process.cwd(), customDir);
      if (!fs.existsSync(exportDir)) {
        throw new Error('文件不存在');
      }

      const filePath = path.join(exportDir, fileName);
      if (!fs.existsSync(filePath)) {
        throw new Error('文件不存在');
      }

      const fileExt = path.extname(filePath).toLowerCase();

      const MIMETYPES = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.txt': 'text/plain',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.7z': 'application/x-7z-compressed',
        '.tar': 'application/x-tar',
        '.gz': 'application/gzip',
        '.exe': 'application/octet-stream',
        '.svg': 'image/svg+xml',
        '.xml': 'application/xml',
        '.json': 'application/json',
        '.csv': 'text/csv',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.log': 'text/plain',
        '.md': 'text/markdown',
        '.yml': 'text/yaml',
        '.yaml': 'text/yaml',
      };

      const mimeType = MIMETYPES[fileExt] || 'application/octet-stream';

      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${encodeURIComponent(fileName)}`,
      );

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (err) => {
        console.error(`error: ${err}`);
        if (!res.headersSent) {
          res.status(500).send('Internal Server Error');
        } else {
          res.end();
        }
      });
    } catch (error) {
      throw new Error(`导出文件错误: ${error.message || error}`);
    }
  }
}
