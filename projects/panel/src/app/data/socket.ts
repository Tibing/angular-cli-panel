import { ApplicationRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AssetsEvent, Event, EventBus, ModulesEvent, OperationEvent, StatusEvent } from '../event-bus';

@Injectable()
export class Socket {

  private log = new Subject<string>();
  log$: Observable<string> = this.log.asObservable();

  private status = new Subject<StatusEvent>();
  status$: Observable<StatusEvent> = this.status.asObservable();

  private operation = new Subject<OperationEvent>();
  operation$: Observable<OperationEvent> = this.operation.asObservable();

  private progress = new Subject<number>();
  progress$: Observable<number> = this.progress.asObservable();

  private modules = new Subject<ModulesEvent>();
  modules$: Observable<ModulesEvent> = this.modules.asObservable();

  private assets = new Subject<AssetsEvent>();
  assets$: Observable<AssetsEvent> = this.assets.asObservable();

  private handlers = {
    log: this.log.next.bind(this.log),
    status: this.status.next.bind(this.status),
    operation: this.operation.next.bind(this.operation),
    progress: this.progress.next.bind(this.progress),
    modules: this.modules.next.bind(this.modules),
    assets: this.assets.next.bind(this.assets),

    clear: () => this.log.next(''),
  };

  constructor(eventBus: EventBus, private appRef: ApplicationRef) {
    eventBus.subscribe((event: Event) => this.handleEvent(event));
  }

  private handleEvent<T>(event: Event) {
    const handler = this.handlers[event.type];

    if (handler) {
      handler(event.payload);
    }

    this.appRef.tick();
  }
}
