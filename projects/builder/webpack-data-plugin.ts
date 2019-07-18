import { interval, Subject } from 'rxjs';
import { Event } from '@cli-panel/panel';

export class WebpackDataPlugin {
  constructor(private eventBus: Subject<Event>) {
    interval(100).subscribe(eventBus.next.bind(eventBus));
  }

  apply(compiler) {
  }
}
