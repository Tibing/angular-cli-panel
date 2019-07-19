import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DataFacade } from '../data/data.facade';

@Component({
  selector: 'cp-progress',
  template: `Progress: {{ progress$ | async }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProgressComponent {
  progress$: Observable<number> = this.dataFacade.progress$;

  constructor(private dataFacade: DataFacade) {
  }
}
