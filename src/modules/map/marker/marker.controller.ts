import { Controller, Post } from '@nestjs/common';
import { MarkerService } from './marker.service';
// import type { IMarker } from 'src/common/interfaces/map/marker.interface';
import { Body } from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';

@Controller('marker')
export class MarkerController {
  constructor(private readonly markerService: MarkerService) {}

  @Post('/create')
  async createMarker(@Body() marker: CreateMarkerDto) {
    return this.markerService.createMarker(marker);
  }
}
