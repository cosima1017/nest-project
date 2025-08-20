import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  providers: [AxiosService],
  exports: [AxiosService],
  imports: [HttpModule],
})
export class AxiosModule {}
