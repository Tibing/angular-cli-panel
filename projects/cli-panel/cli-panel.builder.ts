import { CliPanelBuilderSchema } from './schema';
import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { bindNodeCallback, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { getSystemPath, json, normalize } from '@angular-devkit/core';
import { writeFile } from 'fs';

export function createTimestamp(
  schema: CliPanelBuilderSchema,
  { workspaceRoot, logger }: BuilderContext,
): Observable<BuilderOutput> {
  const { path, format } = schema;

  const timestampFileName = `${getSystemPath(normalize(workspaceRoot))}/${path}`;
  const writeFileObservable = bindNodeCallback(writeFile);
  const timestampLogger = logger.createChild('Timestamp');
  return writeFileObservable(timestampFileName, new Date())
    .pipe(
      map(() => ({ success: true })),
      tap(() => timestampLogger.info('Timestamp created')),
      catchError(e => {
        timestampLogger.error('Failed to create timestamp', e);
        return of({ success: false });
      }),
    );
}

export default createBuilder<json.JsonObject & CliPanelBuilderSchema>(createTimestamp);

