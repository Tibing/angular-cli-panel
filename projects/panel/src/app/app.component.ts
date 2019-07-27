import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataFacade } from './data/data.facade';
import { map } from 'rxjs/operators';

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
    >

      <table
        height="100%-5"
        width="100%-5"
        align="left"
        [data]="[['Name', 'Size', 'Percent']]"
      >
      </table>

    </listbar>

    <box
      label="Assets"
      width="50%"
      height="28%"
      left="50%"
      top="36%"
      [style]="{ fg: -1, border: { fg: 'green' } }"
    >

      <table
        height="100%-5"
        width="100%-5"
        align="left"
        [data]="[['Name', 'Size']]"
      >
      </table>

    </box>

    <listbar
      label="Problems"
      [mouse]="true"
      width="50%"
      height="38%"
      left="50%"
      top="63%"
      [style]="problemsStyle"
      [autoCommandKeys]="true"
    >

      <box
        [border]="{fg:-1}"
        [style]=" { fg: -1, border: { fg: 'green' } }"
      >
      </box>

    </listbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  progress$: Observable<number> = this.dataFacade.progress$;

  log$: Observable<string> = this.dataFacade.log$;

  status$: Observable<string> = this.dataFacade.status$.pipe(
    map((status: string) => `{green-fg}{bold}${status}{/}`),
  );

  modulesStyle = {
    fg: -1,
    border: { fg: 'green' },
    prefix: { fg: -1 },
    item: { fg: 'white' },
    selected: { fg: 'black', bg: 'green' },
  };

  problemsStyle = { border: { fg: 'green' }, prefix: { fg: -1 }, item: { fg: 'white' }, selected: { fg: 'black', bg: 'green' } };

  @ViewChild('status', { static: true }) status: ElementRef;

  constructor(private dataFacade: DataFacade) {
  }
}
