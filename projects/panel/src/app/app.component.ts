import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DataFacade } from './data/data.facade';

@Component({
  selector: 'app-root',
  template: `Bundling {{ progress$ | async }}%`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  progress$: Observable<number> = this.dataFacade.progress$.pipe(
    tap(() => this.cd.detectChanges()),
  );

  constructor(private dataFacade: DataFacade,
              private cd: ChangeDetectorRef) {
  }
}
