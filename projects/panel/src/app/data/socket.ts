import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Event, EVENT_BUS, EventBus } from '../event-bus';

@Injectable()
export class Socket {

  private progress = new Subject<number>();
  progress$: Observable<number> = this.progress.asObservable();

  constructor(@Inject(EVENT_BUS) eventBus: EventBus,
              private appRef: ApplicationRef) {
    eventBus.subscribe((event: Event) => this.persistEvent(event));
  }

  private persistEvent(event: Event) {
    const handler: Subject<any> = this.resolveHandler(event.type);

    if (handler) {
      handler.next(event.value);
    }

    this.appRef.tick();
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
