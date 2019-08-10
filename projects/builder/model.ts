import { ExecutionTransformer } from '@angular-devkit/build-angular';
import { WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { CliPanelBuilderSchema } from './schema';
import { BuilderContext } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';

export interface BuilderTransforms {
  webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
  logging?: WebpackLoggingCallback;
}

export type Builder<T extends CliPanelBuilderSchema, R>
  = (options: T, context: BuilderContext, transforms?: BuilderTransforms) => Observable<R>;
