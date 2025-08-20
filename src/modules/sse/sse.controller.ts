import { Body, Controller, Post, Query, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
import { interval, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IMessageEvent } from 'src/common/interfaces/sse.interface';
import { v4 as uuid } from 'uuid';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('events')
  sse(@Query('clientId') clientId: string): Observable<IMessageEvent> {
    const eventStream = this.sseService.getEventStream(clientId);

    const heartbeatStream = interval(10000).pipe(
      map(() => ({
        type: 'heartbeat',
        data: {},
      })),
    );

    const mockStream = interval(5000).pipe(
      map(() => ({
        id: uuid(),
        type: 'marker',
        data: {
          id: uuid(),
          longitude: 113.2644 + Math.random() * 2 ,
          latitude: 23.1291 + Math.random() * 2,
          description: 'mock point',
          height: '600m',
          name: 'mock point',
          iconUrl: 'map/markers/marker.svg',
          iconWidth: 40,
          iconHeight: 45
        },
      })),
    );

    const connectionStream = new Observable<IMessageEvent>((subscriber) => {
      subscriber.next({
        type: 'connection',
        data: {},
      });
    });
    return merge(eventStream, heartbeatStream, connectionStream, mockStream);
  }

  @Post('broadcast')
  broadcastEvent(@Body() event: IMessageEvent) {
    this.sseService.broadcastEvent(event);
  }
}
