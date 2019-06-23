import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalModule } from 'platform-terminal';

import { AppComponent } from './app.component';
import { EventBus } from './data/event-bus';
import { SocketManager } from './data/socket-manager';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TerminalModule,
    CommonModule,
  ],
  providers: [EventBus, SocketManager],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
}
