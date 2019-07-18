import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Socket } from './socket';

@Injectable()
export class DataFacade {

  progress$: Observable<number> = this.socket.progress$;

  constructor(private socket: Socket) {
  }
}
