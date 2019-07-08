import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { BrowserBuilderOutput, executeBrowserBuilder } from '@angular-devkit/build-angular';

import { withPanel } from '../panel';
import { CliPanelBrowserSchema } from './schema';

function createCliPanel(schema: CliPanelBrowserSchema, context: BuilderContext): Observable<BuilderOutput> {
  const browserBuilder = withPanel<CliPanelBrowserSchema, BrowserBuilderOutput>(executeBrowserBuilder);
  return browserBuilder(schema, context);
}

export default createBuilder<json.JsonObject & CliPanelBrowserSchema>(createCliPanel);

