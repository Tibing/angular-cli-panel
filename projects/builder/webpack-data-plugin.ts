import { Subject } from 'rxjs';
import { ProgressPlugin } from 'webpack';

import { Event } from '@cli-panel/panel';

export class WebpackDataPlugin {

  constructor(private eventBus: Subject<Event>) {
  }

  apply(compiler) {

    new ProgressPlugin((percentage, msg, ...args) => {
      this.sendData([
        {
          type: 'status',
          payload: 'compiling',
        },
        {
          type: 'progress',
          payload: {
            percentage,
            msg,
            info: args,
          },
        },
      ]);
    })
      .apply(compiler);

    compiler.hooks.compile.tap('WebpackDataPlugin', () => {
      this.sendData([{
        type: 'status',
        payload: 'compiling',
      }]);
    });

    compiler.hooks.invalid.tap('WebpackDataPlugin', () => {
      this.sendData([
        {
          type: 'status',
          payload: 'invalidated',
        },
        {
          type: 'progress',
          payload: {
            percentage: 0,
          },
        },
        {
          type: 'clear',
        },
      ]);
    });

    compiler.hooks.failed.tap('WebpackDataPlugin', () => {
      this.sendData([
        {
          type: 'status',
          payload: 'failed',
        },
      ]);
    });

    compiler.hooks.done.tapAsync('WebpackDataPlugin', (stats) => {
      const log = stats.toString({ all: true, errors: true, warnings: true });

      this.sendData([
        {
          type: 'stats',
          payload: stats.toJson(),
        },
        {
          type: 'log',
          payload: log,
        },
        {
          type: 'status',
          payload: 'success',
        },
        {
          type: 'progress',
          payload: {
            percentage: 1,
          },
        },
      ]);
    });
  }


  sendData(eventList: Event[]) {
    for (const event of eventList) {
      this.eventBus.next(event);
    }
  }
}
