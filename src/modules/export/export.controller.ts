import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
// import path from 'path';
import { ExportExcelDto } from './dto/export-excel.dto';
import dayjs from 'dayjs';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('excel')
  async exportExcel(
    @Body() exportDto: ExportExcelDto,
    @Res() res: Response,
  ): Promise<void> {
    const { headers, data, fileName, sheetName } = exportDto;

    await this.exportService.exportExcel(
      res,
      headers,
      data,
      fileName,
      sheetName,
    );
  }

  @Get('log/error/today')
  async exportLog(@Res() res: Response): Promise<void> {
    await this.exportService.exportFile(
      res,
      `error-${dayjs().format('YYYY-MM-DD')}.log`,
      'logs',
    );
  }
}
