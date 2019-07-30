import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataFacade } from './data/data.facade';
import { formatModules } from './util/format-modules';
import { StatusPayload } from './event-bus';
import { commonStyleWithColor, modulesStyleWithColor, progressStyleWithColor, statusToColor } from './style-util';

@Component({
  selector: 'cp-root',
  template: `
    <box
      [label]="'Status'"
      [content]="statusStyled$ | async"
      width="20%"
      height="3"
      [style]="commonStyle$ | async"
    >
    </box>

    <box
      label="Operation"
      [content]="'Idle'"
      width="20%"
      height="3"
      left="20%"
      [style]="commonStyle$ | async"
    >
    </box>

    <box label="Progress" width="60%" height="3" left="40%" [style]="commonStyle$ | async">
      <progressbar
        [value]="progress$ | async"
        width="100%-4"
        height="1"
        top="center"
        left="center"
        orientation="horizontal"
        [style]="progressBarStyle$ | async"
      >
      </progressbar>
    </box>

    <box
      width="100%"
      height="50%"
      label="Errors"
      top="3"
      [style]="commonStyle$ | async"
      [content]="errors$ | async">
    </box>

    <listbar
      label="Modules"
      [mouse]="true"
      width="50%"
      height="50%-3"
      top="50%+3"
      [style]="modulesStyle$ | async"
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
      ></table>
    </listbar>

    <box
      label="Assets"
      width="50%"
      height="50%-3"
      top="50%+3"
      left="50%"
      [style]="commonStyle$ | async"
    >
      <table height="100%-5" width="100%-5" top="1" align="left" [data]="assets$ | async"></table>
    </box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  progress$: Observable<number> = this.dataFacade.progress$;

  errors$: Observable<string> = this.dataFacade.errors$.pipe(
    startWith('Compiling...'),
  );

  status$: Observable<string> = this.dataFacade.status$;

  statusStyled$: Observable<string> = this.dataFacade.status$.pipe(
    map((status: StatusPayload) => {
      const color = statusToColor(status);
      return `{${color}-fg}{bold}${status}{/}`;
    }),
  );

  assets$: Observable<any> = this.dataFacade.assets$.pipe(
    startWith([['Waiting for the end of the compilation...']]),
  );

  commonStyle$: Observable<any> = this.status$.pipe(
    startWith('compiling'),
    map((status: StatusPayload) => {
      const color = statusToColor(status);
      return commonStyleWithColor(color);
    }),
  );

  modulesStyle$: Observable<any> = this.status$.pipe(
    startWith('compiling'),
    map((status: StatusPayload) => {
      const color = statusToColor(status);
      return modulesStyleWithColor(color);
    }),
  );

  progressBarStyle$: Observable<any> = this.status$.pipe(
    startWith('compiling'),
    map((status: StatusPayload) => {
      const color = statusToColor(status);
      return progressStyleWithColor(color);
    }),
  );

  modules: Subject<any> = new Subject();
  modules$: Observable<any> = this.modules
    .asObservable()
    .pipe(startWith([['Waiting for the end of the compilation...']]));
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
