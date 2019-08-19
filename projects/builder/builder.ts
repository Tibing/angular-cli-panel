import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { createBrowserLoggingCallback } from '@angular-devkit/build-angular/src/browser';
import { NEVER, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ExecutionTransformer } from '@angular-devkit/build-angular';
import { Socket } from 'socket.io';
import * as webpack from 'webpack';
import * as io from 'socket.io-client';
import { Event } from '@cli-panel/panel';

import { WebpackDataPlugin } from './webpack-data-plugin';
import { Builder, BuilderTransforms } from './model';
import { CliPanelBuilderSchema } from './schema';

export function executeBuilder<T extends CliPanelBuilderSchema, R extends BuilderOutput>(
  builder: Builder<T, R>,
  options: CliPanelBuilderSchema,
  context: BuilderContext,
  rawTransforms?: BuilderTransforms,
): Observable<R> {
  const eventBus = createEventBus(options.ebport);
  const transforms = createTransforms(eventBus, options, context, rawTransforms);

  // @ts-ignore
  return builder(options, context, transforms).pipe(
    map(() => {
      log('[BDDD] success');
      return ({ success: true });
    }),
    catchError((err) => {
      log('[BDDD] fail', err);
      return of({ success: false });
    }),
    switchMap(() => NEVER),
  );
}

function createTransforms(
  eventBus: Subject<Event>,
  options: CliPanelBuilderSchema,
  context: BuilderContext,
  transforms?: BuilderTransforms,
): BuilderTransforms {
  return {
    ...transforms,
    webpackConfiguration: webpackConfigTransformer(eventBus),
    // @ts-ignore
    logging: createBrowserLoggingCallback(!!options.verbose, context.logger),
  };
}

function webpackConfigTransformer(eventBus: Subject<Event>): ExecutionTransformer<webpack.Configuration> {
  return (config: webpack.Configuration) => {
    config.plugins.push(new WebpackDataPlugin(eventBus));
    return config;
  };
}

function createEventBus(port: number): Subject<Event> {
  log('[SENDING ON PORT]', port);
  const socket: Socket = io(`http://localhost:${port}`, { transports: ['websocket'] });
  socket.on('connect', () => {
    log('[CONNECT]');
  });
  socket.on('error', (err: Error) => {
    log('[SOCKET ERROR]', err.name, err.message, err.stack);
    process.exit(1);
  });
  socket.on('disconnect', (msg) => {
    log('[DISCONNECT]', msg);
    process.exit(1);
  });
  const s = new Subject<Event>();
  s.subscribe({
    next: (event) => {
      socket.emit('message', event);
    },
    complete: () => {
      log('[PLUGIN CLOSE]');
      // @ts-ignore
      socket.close();
    },
    // @ts-ignore
    error: (err) => {
      log('[PLUGIN ERROR]', err);
      // @ts-ignore
      socket.close();
    },
  });
  return s;
}

// @ts-ignore
export function log(...msg: any[]) {
  if (process.env.TRACE) {
    require('fs').appendFileSync('log.txt', `${JSON.stringify(msg)}\n`);
  }
}
