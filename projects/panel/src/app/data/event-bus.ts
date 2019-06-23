import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { Action, SocketManager } from './socket-manager';
import { formatAssets } from '../util/assets-formatter';
import { formatModules } from '../util/module-formatter';

enum ActionType {
  PROGRESS = 'progress',
  STATUS = 'status',
  OPERATIONS = 'operations',
  SIZES = 'sizes',
}

interface File {
  baseName: string;
  fileName: string;
  size: { full: number };
}

interface Asset {
  files: File[];
  meta: { full: number };
}

interface Sizes {
  assets: { [key: string]: Asset };
  meta: { full: number };
}

@Injectable()
export class EventBus {

  private progress = new Subject<number>();
  readonly progress$: Observable<number> = this.progress.asObservable()
    .pipe(
      map(val => Math.round(val * 100)),
      distinctUntilChanged(),
    );

  private status = new Subject<string>();
  readonly status$: Observable<string> = this.status.asObservable().pipe(distinctUntilChanged());

  private operations = new Subject<string>();
  readonly operations$: Observable<string> = this.operations.asObservable().pipe(distinctUntilChanged());

  private sizes = new Subject<Sizes>();
  readonly sizes$: Observable<Sizes> = this.sizes.asObservable();

  readonly assets$: Observable<any> = this.sizes$.pipe(
    map((sizes: Sizes) => formatAssets(sizes.assets)),
  );

  readonly modules$: Observable<any> = this.sizes$.pipe(
    map((sizes: Sizes) => {
      const data =
        Object.keys(sizes.assets)
          .map((name: string) => {
            return [
              [name, sizes.assets[name].meta.full, ''],
              ...formatModules(sizes.assets[name].files),
            ];
          })
          .flat()
          .map((row) => {
            const nameSplitted = row[0].split('/');
            return [nameSplitted[nameSplitted.length - 1], row[1], row[2]];
          });
      return data;
    }),
  );

  private bundleSize = new Subject<number>();
  readonly bundleSize$: Observable<number> = this.bundleSize.asObservable()
    .pipe(
      map((value: any) => value && value.meta && value.meta.full),
      distinctUntilChanged(),
    );

  private notImplemented = new Subject<string>();
  readonly notImplemented$: Observable<string> = this.notImplemented.asObservable().pipe(distinctUntilChanged());

  constructor(private socketManager: SocketManager) {
    socketManager.actions$.subscribe((action: Action) => this.dispatchAction(action));
  }

  private dispatchAction(action: Action) {
    const dispatcher: Subject<any> = this.getDispatcher(action);

    if (dispatcher === this.notImplemented) {
      dispatcher.next(action);
    } else {
      dispatcher.next(action.value);
    }
  }

  private getDispatcher({ type }: Action): Subject<any> {
    switch (type) {
      case ActionType.OPERATIONS:
        return this.operations;
      case ActionType.PROGRESS:
        return this.progress;
      case ActionType.STATUS:
        return this.status;
      case ActionType.SIZES:
        return this.sizes;
      default:
        return this.notImplemented;
    }
  }
}
