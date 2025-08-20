import type { JsonValue } from '@prisma/client/runtime/library';

export interface IMarker {
  id: number;
  title: string;
  description: JsonValue;
  latitude: number;
  longitude: number;
  address: string;
  iconUrl: string;
  markerColor: string;
  isVisible: boolean;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number | null;
  updatedBy: number | null;
}