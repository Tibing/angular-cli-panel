import { ChildProcess, spawn as spawnNode } from 'child_process';
import { Observable, Observer } from 'rxjs';
import { log } from './builder';

export const spawn = (path: string, args: string[]) => {
  return new Observable((observer: Observer<string>) => {

    const proc: ChildProcess = spawnNode(path, args);

    proc.stdout.on('data', msg => observer.next(msg.toString()));
    proc.on('exit', (err) => {
      log('[FS-EXIT]', err);
      console.error(err);
      // process.exit(1);
    });
    proc.on('error', err => {
      log('[FS-ERROR]', err);
      observer.error(err);
      process.exit(1);
    });

    process.on('exit', () => proc.kill());
  });
};
