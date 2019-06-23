import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EventBus } from './data/event-bus';
import { map, startWith } from 'rxjs/operators';

interface TableData {
  headers: string[];
  data: string[][];
}

@Component({
  selector: 'app-root',
  template: `
    <grid rows="12" cols="12">

      <table
        [row]="6"
        [col]="0"
        [rowSpan]="6"
        [colSpan]="6"
        [label]="'Modules'"
        [columnWidth]="[20, 5, 10]"
        [keys]="true"
        [data]="modules$ |async">
      </table>

      <table
        [row]="6"
        [col]="6"
        [rowSpan]="6"
        [colSpan]="6"
        [label]="'Assets'"
        [columnWidth]="[30, 10]"
        [keys]="true"
        [data]="assets$ |async">
      </table>

      <progressbar></progressbar>

    </grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  modules$: Observable<TableData> = this.eventBus.modules$.pipe(
    startWith([]),
    map((data: string[][]) => ({ headers: ['Name', 'Size', 'Percent'], data })),
  );
  assets$: Observable<TableData> = this.eventBus.assets$.pipe(
    startWith([]),
    map((data: string[][]) => ({ headers: ['Name', 'Size'], data })),
  );

  constructor(private eventBus: EventBus) {
  }
}
