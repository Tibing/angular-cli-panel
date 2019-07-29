import { ApplicationRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Event, EventBus, OperationEvent, ProgressPayload, StatusPayload } from '../event-bus';
import { formatAssets } from '../util/format-assets';
import { parseProblems, parseSizes } from './stats-parser';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class Socket {

  private log = new Subject<string>();
  log$: Observable<string> = this.log.asObservable();

  private status = new Subject<StatusPayload>();
  status$: Observable<StatusPayload> = this.status.asObservable();

  private operation = new Subject<OperationEvent>();
  operation$: Observable<OperationEvent> = this.operation.asObservable();

  private progress = new Subject<ProgressPayload>();
  progress$: Observable<ProgressPayload> = this.progress.asObservable();


  private stats = new Subject<any>();
  stats$: Observable<any> = this.stats.asObservable();

  private sizes$: Observable<any> = this.stats$.pipe(
    mergeMap(parseSizes),
  );

  assets$: Observable<any> = this.sizes$.pipe(
    map(sizes => sizes.value.assets),
    map(formatAssets),
  );

  private problems$: Observable<any> = this.stats$.pipe(
    mergeMap(parseProblems),
  );

  private handlers = {
    log: this.log.next.bind(this.log),
    status: this.status.next.bind(this.status),
    operation: this.operation.next.bind(this.operation),
    progress: this.progress.next.bind(this.progress),
    stats: this.stats.next.bind(this.stats),

    clear: () => this.log.next(''),
  };

  constructor(eventBus: EventBus, private appRef: ApplicationRef) {
    eventBus.subscribe((event: Event) => this.handleEvent(event));
  }

  private handleEvent<T>(event: Event) {
    const handler = this.handlers[event.type];

    if (handler) {
      handler(event.payload);
    } else {
      throw new Error(`No handler for event: ${event.type}`);
    }

    this.appRef.tick();
  }
}
