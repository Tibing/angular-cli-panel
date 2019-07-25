import { interval, Subject } from 'rxjs';
// @ts-ignore
import { Event } from '@cli-panel/panel';

export class WebpackDataPlugin {
  constructor(eventBus: Subject<Event>) {
    interval(100).subscribe(value => {
      eventBus.next({ type: 'progress', payload: value });
    });
  }

  apply() {
  }
}
