import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import type { IMessageEvent } from 'src/common/interfaces/sse.interface';

@Injectable()
export class SseService implements OnModuleDestroy {
  private clients: Map<string, Subject<IMessageEvent>> = new Map();

  getEventStream(clientId: string): Observable<IMessageEvent> {
    let subject = this.clients.get(clientId);
    if (!subject) {
      subject = new Subject<IMessageEvent>();
      this.clients.set(clientId, subject);
    }

    subject.subscribe({
        complete: () => {
            this.removeEventStream(clientId)
        }
    })
    return subject.asObservable();
  }

  removeEventStream(clientId: string) {
    const subject = this.clients.get(clientId);
    if (subject) {
      subject.complete();
    }
    this.clients.delete(clientId);
  }

  sendEventToClient(clientId: string, event: IMessageEvent) {
    const subject = this.clients.get(clientId);
    if (subject) {
      subject.next(event);
    }
  }

  broadcastEvent(event: IMessageEvent) {
    this.clients.forEach((subject) => {
      subject.next(event);
    });
  }

  onModuleDestroy() {
    // 清除所有客户端的订阅
    this.clients.forEach((subject) => {
      subject.complete();
    });
    this.clients.clear();
  }
}
