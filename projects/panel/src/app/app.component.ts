import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataFacade } from './data/data.facade';
import { formatModules } from './util/format-modules';

@Component({
  selector: 'cp-root',
  template: `
    <box
      width="75%"
      height="36%"
      left="0%"
      top="0%"
      label="Log"
      [style]="{ fg: -1, border: { fg: 'green' } }">

      <log [log]="log$ | async" width="100%-5"></log>

    </box>

    <layout
      width="25%"
      height="36%"
      top="0%"
      left="75%"
      layout="grid">

      <box
        [label]="'Status'"
        [content]="status$ | async"
        width="100%"
        height="34%"
        valign="middle"
        [style]="{ fg: -1, border: { fg: 'green' } }">
      </box>

      <box
        label="Operation"
        [content]="'Idle'"
        width="100%"
        height="34%"
        valign="middle"
        [style]="{ fg: -1, border: { fg: 'green' } }">
      </box>

      <box
        label="Progress"
        width="100%"
        height="34%"
        valign="middle"
        [style]="{ fg: -1, border: { fg: 'green' } }">

        <progressbar
          [value]="progress$ | async"
          width="90%"
          height="1"
          top="center"
          left="center"
          orientation="horizontal"
          [style]="{ bar: { bg: 'green'}}">
        </progressbar>

      </box>

    </layout>

    <listbar
      label="Modules"
      [mouse]="true"
      width="50%"
      height="66%"
      left="0%"
      top="36%"
      [style]="modulesStyle"
      [autoCommandKeys]="true"
      [commands]="commands$ | async"
    >

      <table
        height="100%-5"
        width="100%-5"
        align="left"
        [data]="modules$ | async"
        top="1"
        left="1"
      >
      </table>

    </listbar>

    <box
      label="Assets"
      width="50%"
      height="66%"
      left="50%"
      top="36%"
      [style]="{ fg: -1, border: { fg: 'green' } }"
    >

      <table
        height="100%-5"
        width="100%-5"
        top="1"
        align="left"
        [data]="assets$ | async"
      >
      </table>

    </box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  progress$: Observable<number> = this.dataFacade.progress$;

  log$: Observable<string> = this.dataFacade.log$;

  status$: Observable<string> = this.dataFacade.status$.pipe(
    map((status: string) => `{green-fg}{bold}${status}{/}`),
  );

  assets$: Observable<any> = this.dataFacade.assets$.pipe(
    startWith([['Waiting for the end of the compilation...']]),
  );
  modulesStyle = {
    fg: -1,
    border: { fg: 'green' },
    prefix: { fg: -1 },
    item: { fg: 'white' },
    selected: { fg: 'black', bg: 'green' },
  };
  private modules: Subject<any> = new Subject();
  modules$: Observable<any> = this.modules.asObservable().pipe(
    startWith([['Waiting for the end of the compilation...']]),
  );
  commands$: Observable<any> = this.dataFacade.sizes$.pipe(
    map(sizes => sizes.value.assets),
    map(assets => {
      return Object.keys(assets).reduce(
        (memo, name) =>
          Object.assign({}, memo, {
            [name]: () => {
              this.modules.next(formatModules(assets[name].files));
            },
          }),
        {},
      );
    }),
    startWith([]),
  );

  constructor(private dataFacade: DataFacade) {
  }
}
