import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AssetsEvent, ProgressPayload } from '../event-bus';

import { Socket } from './socket';

@Injectable()
export class DataFacade {

  progress$: Observable<number> = this.socket.progress$
    .pipe(map((payload: ProgressPayload) => payload.percentage * 100));

  errors$: Observable<string> = this.socket.errors$;

  status$: Observable<string> = this.socket.status$;

  operation$: Observable<string> = this.socket.operation$;

  assets$: Observable<AssetsEvent> = this.socket.assets$;

  sizes$: Observable<any> = this.socket.sizes$;

  constructor(private socket: Socket) {
  }
}
