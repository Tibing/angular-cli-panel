import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalModule } from 'platform-terminal';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TerminalModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
