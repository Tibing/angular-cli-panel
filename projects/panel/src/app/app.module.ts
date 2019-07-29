import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalModule } from 'platform-terminal';

import { AppComponent } from './app.component';
import { Socket } from './data/socket';
import { DataFacade } from './data/data.facade';
import { ProgressComponent } from './progress.component';
import { ModulesMenuComponent } from './modules-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent,
    ModulesMenuComponent,
  ],
  imports: [
    TerminalModule,
    CommonModule,
  ],
  providers: [
    Socket,
    DataFacade,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {

  constructor(socket: Socket) {
  }
}
