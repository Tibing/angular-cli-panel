import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `Bundling {{ counter$ | async }}%`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  counter$: Observable<number> = interval(100)
    .pipe(
      tap((i: number) => {
        if (i === 100) {
          process.exit(0);
        }
      }),
    );
}
