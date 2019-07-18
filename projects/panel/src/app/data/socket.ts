import { Inject, Injectable } from '@angular/core';

import { EVENT_BUS, EventBus } from '../event-bus';

@Injectable()
export class Socket {

  constructor(@Inject(EVENT_BUS) eventBus: EventBus) {
    eventBus.subscribe();
  }
}
