import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cp-root',
  template: `<cp-progress></cp-progress>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
