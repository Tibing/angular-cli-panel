import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { NEVER, Observable } from 'rxjs';
import { bootstrap } from '@cli-panel/panel';

import { CliPanelBuilderSchema } from './schema';

function createCliPanel(schema: CliPanelBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  bootstrap();
  return NEVER;
}

export default createBuilder<json.JsonObject & CliPanelBuilderSchema>(createCliPanel);

