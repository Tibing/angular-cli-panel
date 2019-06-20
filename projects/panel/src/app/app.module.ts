import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalModule } from 'platform-terminal';

import { AppComponent } from './app.component';
import { Server } from './data/server';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TerminalModule,
    CommonModule,
  ],
  providers: [Server],
  bootstrap: [AppComponent],
})
export class AppModule {
}
