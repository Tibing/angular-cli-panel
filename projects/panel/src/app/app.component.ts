import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EventBus } from './data/event-bus';

@Component({
  selector: 'app-root',
  template: `
    <box>
      Operations {{ operations$ | async }}
    </box>

    <box top="1">
      Status {{ status$ | async }}
    </box>

    <box top="2">
      Progress {{ progress$ | async }}%
    </box>

    <box top="3">
      Bundle Size {{ bundleSize$ | async }}Kb
    </box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  progress$: Observable<number> = this.eventBus.progress$;
  status$: Observable<string> = this.eventBus.status$;
  operations$: Observable<string> = this.eventBus.operations$;
  bundleSize$: Observable<number> = this.eventBus.bundleSize$;

  constructor(private eventBus: EventBus) {
  }
}
