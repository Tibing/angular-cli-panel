import { platformTerminalDynamic } from 'platform-terminal';
import { enableProdMode, NgModuleRef } from '@angular/core';
import { from, Observable } from 'rxjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function bootstrapPanel(): Observable<NgModuleRef<AppModule>> {

  if (environment.production) {
    enableProdMode();
  }

  return from(platformTerminalDynamic().bootstrapModule(AppModule));
}
