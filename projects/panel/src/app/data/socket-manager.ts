import { Injectable, NgZone } from '@angular/core';
import * as SocketIO from 'socket.io';
import { Server, Socket } from 'socket.io';
import { Observable, Subject } from 'rxjs';

export interface Action {
  type: string;
  value: any;
}

@Injectable()
export class SocketManager {

  private actions = new Subject<Action>();
  readonly actions$: Observable<Action> = this.actions.asObservable();

  private server: Server;

  constructor(zone: NgZone) {
    this.createServer();

    zone.runOutsideAngular(() => {
      this.bootstrap();
    });
  }

  private createServer() {
    const port = 9838;
    this.server = SocketIO(port);
  }

  private bootstrap() {
    this.setupErrorHandler();
    this.connect();
  }

  private setupErrorHandler() {
    this.server.on('error', err => {
      console.log(err);
      process.exit(1);
    });
  }

  private connect() {
    this.server.on('connection', (socket: Socket) => {
      this.listenMessages(socket);
    });
  }

  private listenMessages(socket: Socket) {
    socket.on('message', (actions: Action[]) => {
      this.dispatchActions(actions);
    });
  }

  private dispatchActions(actions: Action[]) {
    for (const action of actions) {
      this.actions.next(action);
    }
  }
}
