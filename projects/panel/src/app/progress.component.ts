import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DataFacade } from './data/data.facade';

@Component({
  selector: 'cp-progress',
  template: `
    <progressbar
      [value]="progress$ | async"
      width="100%"
      height="1"
      [style]="{ bar: { bg: 'red'}}">
    </progressbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProgressComponent {
  progress$: Observable<number> = this.dataFacade.progress$;

  constructor(private dataFacade: DataFacade) {
  }
}
