import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ProgressPayload } from '../event-bus';

import { Socket } from './socket';

@Injectable()
export class DataFacade {

  progress$: Observable<number> = this.socket.progress$
    .pipe(map((payload: ProgressPayload) => payload.percentage * 100));

  log$: Observable<string> = this.socket.log$;

  status$: Observable<string> = this.socket.status$;

  constructor(private socket: Socket) {
  }
}
