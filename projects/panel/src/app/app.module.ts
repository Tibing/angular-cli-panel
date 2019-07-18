import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalModule } from 'platform-terminal';

import { AppComponent } from './app.component';
import { Socket } from './data/socket';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TerminalModule,
    CommonModule,
  ],
  providers: [Socket],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor(socket: Socket) {
  }
}
