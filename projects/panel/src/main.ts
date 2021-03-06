import { platformTerminalDynamic } from 'platform-terminal';
import { enableProdMode, NgModuleRef, StaticProvider } from '@angular/core';
import { from, Observable } from 'rxjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { EventBus } from './app/event-bus';

export function bootstrapPanel(eventBus: Observable<any>): Observable<NgModuleRef<AppModule>> {

  if (environment.production) {
    enableProdMode();
  }

  const providers: StaticProvider[] = [{ provide: EventBus, useValue: eventBus }];

  return from(platformTerminalDynamic(providers).bootstrapModule(AppModule));
}
