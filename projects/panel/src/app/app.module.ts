import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalModule } from 'platform-terminal';

import { AppComponent } from './app.component';
import { Socket } from './data/socket';
import { DataFacade } from './data/data.facade';

@NgModule({
  declarations: [
    AppComponent,
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
