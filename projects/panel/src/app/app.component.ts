import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataFacade } from './data/data.facade';
import { formatModules } from './util/format-modules';
import { StatusPayload } from './event-bus';

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

    <box width="100%" height="50%" label="Log" top="3" [style]="commonStyle$ | async">
      <log left="1" width="100%-5" [log]="log$ | async"></log>
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  progress$: Observable<number> = this.dataFacade.progress$;

  log$: Observable<string> = this.dataFacade.log$.pipe(
    startWith('Compiling...'),
  );

  status$: Observable<string> = this.dataFacade.status$;

  statusStyled$: Observable<string> = this.dataFacade.status$.pipe(
    map((status: StatusPayload) => {
      const color = this.statusToColor(status);
      return `{${color}-fg}{bold}${status}{/}`;
    })
  );

  assets$: Observable<any> = this.dataFacade.assets$.pipe(
    startWith([['Waiting for the end of the compilation...']])
  );

  commonStyle$: Observable<any> = this.status$.pipe(
    startWith('compiling'),
    map((status: StatusPayload) => {
      const color = this.statusToColor(status);
      return this.commonStyleWithColor(color);
    })
  );

  modulesStyle$: Observable<any> = this.status$.pipe(
    startWith('compiling'),
    map((status: StatusPayload) => {
      const color = this.statusToColor(status);
      return this.modulesStyleWithColor(color);
    })
  );

  progressBarStyle$: Observable<any> = this.status$.pipe(
    startWith('compiling'),
    map((status: StatusPayload) => {
      const color = this.statusToColor(status);
      return this.progressStyleWithColor(color);
    })
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
            }
          }),
        {}
      );
    }),
    startWith([])
  );

  constructor(private dataFacade: DataFacade) {}

  private commonStyleWithColor(color: string = 'white') {
    return { fg: -1, border: { fg: color } };
  }

  private progressStyleWithColor(color: string = 'white') {
    return { bar: { bg: color } };
  }

  private modulesStyleWithColor(color: string = 'white') {
    return {
      fg: -1,
      border: { fg: color },
      prefix: { fg: -1 },
      item: { fg: 'white' },
      selected: { fg: 'black', bg: color }
    };
  }

  private statusToColor(status: StatusPayload): string {
    const defaultColor = 'white';
    let color = defaultColor;

    if (status === 'compiling') {
      color = defaultColor;
    }

    if (status === 'invalidated') {
      color = defaultColor;
    }

    if (status === 'success') {
      color = 'green';
    }

    if (status === 'failed') {
      color = 'red';
    }

    return color;
  }
}
