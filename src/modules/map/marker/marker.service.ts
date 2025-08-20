import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma/prisma.service';
import type { IMarker } from 'src/common/interfaces/map/marker.interface';
import type { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class MarkerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMarker(marker: Partial<IMarker>, user: IUser | null = null): Promise<IMarker> {
    return await this.prismaService.create<IMarker, Partial<IMarker>>('map_markers', {
      ...marker,
      createdBy: user ? user.id : null,
    });
  }
}
