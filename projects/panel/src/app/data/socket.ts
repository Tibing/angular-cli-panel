import { ApplicationRef, Injectable } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, mergeMap, startWith, tap } from 'rxjs/operators';

import { Event, EventBus, OperationEvent, ProgressPayload, StatusPayload } from '../event-bus';
import { formatAssets } from '../util/format-assets';
import { parseProblems, parseSizes } from './stats-parser';

@Injectable()
export class Socket {

  private errors = new Subject<string>();
  errors$: Observable<string> = this.errors.asObservable().pipe(
    map(errors => errors || `No errors! You're awesome!`),
  );
  private operation = new Subject<OperationEvent>();
  operation$: Observable<OperationEvent> = this.operation.asObservable();
  private progress = new Subject<ProgressPayload>();
  progress$: Observable<ProgressPayload> = this.progress.asObservable();
  private stats = new Subject<any>();
  stats$: Observable<any> = this.stats.asObservable();
  sizes$: Observable<any> = this.stats$.pipe(
    mergeMap(parseSizes),
  );
  assets$: Observable<any> = this.sizes$.pipe(
    map(sizes => sizes.value.assets),
    map(formatAssets),
  );
  modules$: Observable<any> = this.sizes$.pipe(
    map(sizes => sizes.value.assets),
  );
  private hasErrors$: Observable<boolean> = this.stats$.pipe(
    map(data => data.errors && data.errors.length),
  );
  private status = new Subject<StatusPayload>();
  status$: Observable<StatusPayload> = combineLatest([
    this.status.asObservable(),
    this.hasErrors$.pipe(startWith(false)),
  ])
    .pipe(
      map(([status, hasErrors]) => {
        if (hasErrors) {
          return 'failed';
        } else {
          return status;
        }
      }),
    );
  private problems$: Observable<any> = this.stats$.pipe(
    mergeMap(parseProblems),
  );

  private handlers = {
    log: this.errors.next.bind(this.errors),
    status: this.status.next.bind(this.status),
    operation: this.operation.next.bind(this.operation),
    progress: this.progress.next.bind(this.progress),
    stats: this.stats.next.bind(this.stats),

    clear: () => this.errors.next(''),
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
