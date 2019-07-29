import { Component } from '@angular/core';

@Component({
  selector: 'cp-modules-menu',
  template: `
    <listbar
      label="Modules"
      [mouse]="true"
      [tags]="true"
      width="50%"
      height="50%"
      [border]="{ type: 'line' }"
      [padding]="1"
      [style]="style"
      [autoCommandKeys]="true"
    >
    </listbar>
  `,
})
export class ModulesMenuComponent {
  style = {
    fg: -1,
    border: {
      fg: 'green',
    },
    prefix: {
      fg: -1,
    },
    item: {
      fg: 'white',
    },
    selected: {
      fg: 'black',
      bg: 'green',
    },
  };
}
