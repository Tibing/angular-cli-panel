import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { NEVER, Observable } from 'rxjs';

import { CliPanelBuilderSchema } from './schema';

function createCliPanel(schema: CliPanelBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  return NEVER;
}

export default createBuilder<json.JsonObject & CliPanelBuilderSchema>(createCliPanel);

