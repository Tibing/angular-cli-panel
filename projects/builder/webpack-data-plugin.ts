import { Subject } from 'rxjs';
import { ProgressPlugin } from 'webpack';

// import { Event } from '@cli-panel/panel';

interface Event {
  type: string;
  payload: any;
}

export class WebpackDataPlugin {

  constructor(private eventBus: Subject<Event>) {
  }

  apply(compiler) {
    new ProgressPlugin((percent: number, info: string, ...args) => {

      this.sendData({
        type: 'progress',
        payload: { percent, info, additional: args },
      });
    })
      .apply(compiler);

    compiler.hooks.run.tapAsync('PanelPlugin', (done) => {
      // this.sendData('RUN');
      done();
    });

    compiler.hooks.compile.tap('PanelPlugin', () => {
      // this.sendData('COMPILING');
    });

    compiler.hooks.invalid.tap('PanelPlugin', () => {
      // this.sendData('INVALID');
    });

    compiler.hooks.failed.tap('PanelPlugin', () => {
      // this.sendData('FAILED');
    });

    compiler.hooks.done.tapAsync('PanelPlugin', (stats) => {
      // this.sendData(`DONE in ${stats.endTime - stats.startTime}ms`);
      // this.sendData(`ERRORS=[${stats.compilation.errors}]`);
      // this.sendData(`WARNINGS=[${stats.compilation.warnings}]`);
    });

  }

  sendData(event: Event) {
    this.eventBus.next(event);
  }
}
