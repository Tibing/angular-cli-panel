import { Injectable } from '@angular/core';
import * as SocketIO from 'socket.io';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

enum ActionType {
  PROGRESS = 'progress',
  STATUS = 'status',
  OPERATIONS = 'operations',
}

interface Action {
  type: string;
  value: any;
}

@Injectable()
export class Server {

  private progress = new Subject<number>();
  readonly progress$: Observable<number> = this.progress.asObservable()
    .pipe(
      map(val => val * 100),
      distinctUntilChanged(),
    );

  private status = new Subject<string>();
  readonly status$: Observable<string> = this.status.asObservable().pipe(distinctUntilChanged());

  private operations = new Subject<string>();
  readonly operations$: Observable<string> = this.operations.asObservable().pipe(distinctUntilChanged());

  constructor() {
    const port = 9838;
    const server = SocketIO(port);

    server.on('error', err => {
      // eslint-disable-next-line no-console
      console.log(err);
    });

    server.on('connection', socket => {
      socket.on('message', (message, ack) => {
        this.dispatchAction(message);
      });
    });
  }

  private dispatchAction(actions: Action[]) {
    for (const action of actions) {
      const dispatcher: Subject<any> = this.getDispatcher(action);

      if (dispatcher) {
        dispatcher.next(action.value);
      }
    }
  }

  private getDispatcher({ type }: Action): Subject<any> {
    switch (type) {
      case ActionType.OPERATIONS:
        return this.operations;
      case ActionType.PROGRESS:
        return this.progress;
      case ActionType.STATUS:
        return this.status;
    }
  }
}
