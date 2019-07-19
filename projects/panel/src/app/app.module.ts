import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalModule } from 'platform-terminal';

import { AppComponent } from './app.component';
import { Socket } from './data/socket';
import { DataFacade } from './data/data.facade';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent,
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
})
export class AppModule {

  constructor(socket: Socket) {
  }
}
