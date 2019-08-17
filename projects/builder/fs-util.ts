import { ChildProcess, spawn as spawnNode } from 'child_process';
import { Observable, Observer } from 'rxjs';

export const spawn = (path: string, args: string[]) => {
  return new Observable((observer: Observer<string>) => {

    const proc: ChildProcess = spawnNode(path, args);

    proc.stdout.on('data', msg => observer.next(msg.toString()));
    proc.on('close', (err) => {
      console.error(err);
      process.exit(1);
    });
    proc.on('exit', (err) => {
      console.error(err);
      process.exit(1);
    });
    proc.on('error', err => {
      observer.error(err);
      process.exit(1);
    });

    process.on('exit', () => proc.kill());
  });
};
