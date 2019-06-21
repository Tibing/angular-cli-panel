import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from './data/server';

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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  progress$: Observable<number> = this.server.progress$;
  status$: Observable<string> = this.server.status$;
  operations$: Observable<string> = this.server.operations$;

  constructor(private server: Server) {
  }
}
