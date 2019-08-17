import { ProgressPlugin } from 'webpack';
import { Subject } from 'rxjs';

import { Event } from '@cli-panel/panel';

export class WebpackDataPlugin {

  private timer = Date.now();

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
        {
          type: 'operation',
          payload: msg + this.getTimeMessage(this.timer),
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
        {
          type: 'operation',
          payload: 'idle',
        },
      ]);
    });

    compiler.hooks.failed.tap('WebpackDataPlugin', () => {
      this.sendData([
        {
          type: 'status',
          payload: 'failed',
        },
        {
          type: 'operation',
          payload: `idle${this.getTimeMessage(this.timer)}`,
        },
      ]);
    });

    compiler.hooks.done.tap('WebpackDataPlugin', (stats) => {
      const log = stats.toString({ all: false, errors: true, warnings: true });

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
        {
          type: 'operation',
          payload: `idle${this.getTimeMessage(this.timer)}`,
        },
      ]);
    });
  }


  private sendData(eventList: Event[]) {
    for (const event of eventList) {
      this.eventBus.next(event);
    }
  }

  private getTimeMessage(timer) {
    const ONE_SECOND = 1000;
    let time = Date.now() - timer;

    if (time >= ONE_SECOND) {
      time /= ONE_SECOND;
      time = Math.round(time);
      // @ts-ignore
      time += 's';
    } else {
      // @ts-ignore
      time += 'ms';
    }

    return ` (${time})`;
  }
}
