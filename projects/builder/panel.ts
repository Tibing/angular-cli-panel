import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { from, NEVER, Observable, Observer, of } from 'rxjs';
import { bootstrapPanel, Event } from '@cli-panel/panel';
import * as io from 'socket.io';
import { Server, Socket } from 'socket.io';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as portfinder from 'portfinder';

import { CliPanelBuilderSchema, ExecutionMode } from './schema';
import { Builder, BuilderTransforms } from './model';
import { executeBuilder, log } from './builder';
import { spawn } from './fs-util';

export function withPanel<T extends CliPanelBuilderSchema, R extends BuilderOutput>(builder: Builder<T, R>): Builder<T, R> {
  return (options: T, context: BuilderContext, transforms?: BuilderTransforms): Observable<R> => {

    if (options.mode === ExecutionMode.BUILDER) {
      return executeBuilder(builder, options as any, context, transforms) as any;
    }

    if (options.raw) {
      return builder(options, context, transforms);
    }

    return executeBuilderWithPanel() as any;
  };
}

function executeBuilderWithPanel(): Observable<BuilderOutput> {

  return choosePort().pipe(
    tap(runBuilder),
    map(createEventBus),
    mergeMap(bootstrapPanel),
    map(() => ({ success: true })),
    catchError(() => of({ success: false })),
    switchMap(() => NEVER),
  );
}

function choosePort(): Observable<number> {
  return from<Promise<number>>(portfinder.getPortPromise());
}

function createEventBus(port: number): Observable<Event> {
  log('[LISTEN ON PORT]', port);
  return new Observable((observer: Observer<void>) => {
    const server: Server = io(port);

    server.on('error', err => {
      log('[SERVER ERROR]', err);
      observer.error(err);
    });
    server.on('connect', (socket: Socket) => {
      log('[SERVER CONNECTION]');
      socket.on('message', (msg) => {
        log('[SERVER MESSAGE]', msg);
        observer.next(msg);
      });
      socket.on('disconnect', (msg) => {
        log('[SERVER DISCONNECT]', msg);
        observer.complete();
      });
    });
  });
}

function runBuilder(port: number) {
  const [procPath, ...args] = process.argv;
  spawn(procPath, [...args, `--mode=builder`, `--port=${port}`])
    .subscribe();
}
