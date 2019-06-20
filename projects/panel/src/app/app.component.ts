import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `Bundling {{ counter$ | async }}%`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  counter$: Observable<number> = interval(500);
}
