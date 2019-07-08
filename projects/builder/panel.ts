import { ExecutionTransformer } from '@angular-devkit/build-angular';
import { WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { BuilderContext } from '@angular-devkit/architect';
import * as webpack from 'webpack';
import { NEVER, Observable } from 'rxjs';
import { bootstrapPanel } from '@cli-panel/panel';

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

  bootstrapPanel();

  const options = { ...rawOptions, progress: false };
  const transforms = {
    ...rawTransforms,
    webpackConfiguration: webpackConfigTransformer,
    logging: noop,
  };

  builder(options, context, transforms)
    .subscribe(noop);

  return NEVER;
}

function webpackConfigTransformer(config: webpack.Configuration): ExecutionTransformer<webpack.Configuration> {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new WebpackDataPlugin(),
    ],
  };
}

function noop() {
}
