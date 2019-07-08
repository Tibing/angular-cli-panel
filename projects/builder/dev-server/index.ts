import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { DevServerBuilderOutput, executeDevServerBuilder } from '@angular-devkit/build-angular';

import { withPanel } from '../panel';
import { CliPanelDevServerSchema } from './schema';

function createCliPanel(schema: CliPanelDevServerSchema, context: BuilderContext): Observable<BuilderOutput> {
  const devServerBuilder = withPanel<CliPanelDevServerSchema, DevServerBuilderOutput>(executeDevServerBuilder);
  return devServerBuilder(schema, context);
}

export default createBuilder<json.JsonObject & CliPanelDevServerSchema>(createCliPanel);


