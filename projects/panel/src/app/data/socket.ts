import { Inject, Injectable } from '@angular/core';

import { Event, EVENT_BUS, EventBus } from '../event-bus';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class Socket {

  private progress = new Subject<number>();
  progress$: Observable<number> = this.progress.asObservable();

  constructor(@Inject(EVENT_BUS) eventBus: EventBus) {
    eventBus.subscribe((event: Event) => this.persistEvent(event));
  }

  private persistEvent(event: Event) {
    const handler: Subject<any> = this.resolveHandler(event.type);

    if (handler) {
      // require('fs').appendFileSync('tmp.txt', `${event.value}\n`);
      handler.next(event.value);
    }
  }

  private resolveHandler(type: string): Subject<any> {
    switch (type) {
      case 'clear':
      case 'log':
      case 'operations':
      case 'progress':
        return this.progress;
      case 'stats':
      case 'status':
      default:
    }
  }
}
