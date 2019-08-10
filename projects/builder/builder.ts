import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { createBrowserLoggingCallback } from '@angular-devkit/build-angular/src/browser';
import { Observable, Subject } from 'rxjs';
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
  const eventBus = createEventBus(options.port);
  const transforms = createTransforms(eventBus, options, context, rawTransforms);

  // @ts-ignore
  return builder(options, context, transforms);
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
  const socket: Socket = io(`http://localhost:${port}`);
  const s = new Subject<Event>();
  s.subscribe((event) => socket.emit('message', event));
  return s;
}
