import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const EVENT_BUS = new InjectionToken<EventBus>('Event Bus');

export class EventBus extends Observable<Event> {
}

export interface Event {
  type: 'status' | 'progress' | 'operations' | 'stats' | 'log' | 'clear';
  value: any;
}
