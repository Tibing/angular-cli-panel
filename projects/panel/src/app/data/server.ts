import { Injectable } from '@angular/core';
import * as SocketIO from 'socket.io';


@Injectable()
export class Server {

  constructor() {
    const port = 9838;
    const server = SocketIO(port);

    server.on('error', err => {
      // eslint-disable-next-line no-console
      console.log(err);
    });

    server.on('connection', socket => {
      socket.on('message', (message, ack) => {
        console.log(message, ack);
      });
    });
  }
}
