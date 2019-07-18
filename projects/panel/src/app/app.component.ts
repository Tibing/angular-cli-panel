import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `Bundling {{ counter$ | async }}%`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  counter$: Observable<number> = of(1);
}
