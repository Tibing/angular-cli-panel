import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { Observable } from 'rxjs';

import { BrowserBuilderOptions, BrowserBuilderOutput, executeBrowserBuilder } from '@angular-devkit/build-angular';
import { withPanel } from '../panel';

function createCliPanel(schema: BrowserBuilderOptions, context: BuilderContext): Observable<BuilderOutput> {
  const browserBuilder = withPanel<BrowserBuilderOptions, BrowserBuilderOutput>(executeBrowserBuilder);
  return browserBuilder(schema, context);
}

export default createBuilder<json.JsonObject & BrowserBuilderOptions>(createCliPanel);

