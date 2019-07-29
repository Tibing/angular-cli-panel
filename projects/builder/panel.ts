import { ExecutionTransformer } from '@angular-devkit/build-angular';
import { WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { BuilderContext } from '@angular-devkit/architect';
import * as webpack from 'webpack';
import { NEVER, Observable, Subject } from 'rxjs';
// @ts-ignore
import { bootstrapPanel, Event } from '@cli-panel/panel';

import { WebpackDataPlugin } from './webpack-data-plugin';
import { CliPanelBuilderSchema } from './schema';

interface BuilderTransforms {
  webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
  logging?: WebpackLoggingCallback;
}

type Builder<T extends CliPanelBuilderSchema, R>
  = (options: T, context: BuilderContext, transforms?: BuilderTransforms) => Observable<R>;

export function withPanel<T extends CliPanelBuilderSchema, R>(builder: Builder<T, R>): Builder<T, R> {
  return (options: T, context: BuilderContext, transforms?: BuilderTransforms): Observable<R> => {

    if (options.raw) {
      return builder(options, context, transforms);
    }

    return executeBuilderWithPanel(builder, options, context, transforms);
  };
}

function executeBuilderWithPanel<T extends CliPanelBuilderSchema, R>(
  builder: Builder<T, R>, rawOptions: T, context: BuilderContext,
  rawTransforms?: BuilderTransforms): Observable<R> {

  const eventBus = new Subject<Event>();
  bootstrapPanel(eventBus.asObservable());

  const options = { ...rawOptions, progress: false };
  const transforms = {
    ...rawTransforms,
    webpackConfiguration: webpackConfigTransformer(eventBus),
    logging: noop,
  };

  builder(options, context, transforms)
    .subscribe();

  return NEVER;
}

function webpackConfigTransformer(eventBus: Subject<Event>): ExecutionTransformer<webpack.Configuration> {
  return (config: webpack.Configuration) => {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        new WebpackDataPlugin(eventBus),
      ],
    };
  };
}

function noop() {
}
