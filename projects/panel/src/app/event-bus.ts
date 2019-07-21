import { Observable } from 'rxjs';

export class EventBus extends Observable<Event> {
}

export interface Event<T = any> {
  type: 'status' | 'progress' | 'operations' | 'stats' | 'log' | 'clear';
  payload: T;
}

export type StatusEvent = 'Errors';
export type OperationEvent = 'idle';
export type ModulesEvent = Module[];
export type AssetsEvent = Asset[];

export interface Module {
  name: string;
  size: string;
  percentage: number;
}

export interface Asset {
  name: string;
  size: string;
}
