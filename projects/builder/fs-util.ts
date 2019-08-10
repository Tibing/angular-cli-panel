import { ChildProcess, spawn as spawnNode } from 'child_process';
import { Observable, Observer } from 'rxjs';

export const spawn = (path: string, args: string[]) => {
  return new Observable((observer: Observer<string>) => {

    const proc: ChildProcess = spawnNode(path, args);

    proc.stdout.on('data', msg => observer.next(msg.toString()));
    proc.on('close', () => observer.complete());
    proc.on('exit', () => observer.complete());
    proc.on('error', err => observer.error(err));

    process.on('exit', () => proc.kill());
  });
};
