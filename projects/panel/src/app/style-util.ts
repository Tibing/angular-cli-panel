import { StatusPayload } from './event-bus';

export function commonStyleWithColor(color: string = 'white') {
  return { fg: -1, border: { fg: color } };
}

export function progressStyleWithColor(color: string = 'white') {
  return { bar: { bg: color } };
}

export function modulesStyleWithColor(color: string = 'white') {
  return {
    fg: -1,
    border: { fg: color },
    prefix: { fg: -1 },
    item: { fg: 'white' },
    selected: { fg: 'black', bg: color },
  };
}

export function statusToColor(status: StatusPayload): string {
  const defaultColor = 'white';
  let color = defaultColor;

  if (status === 'compiling') {
    color = defaultColor;
  }

  if (status === 'invalidated') {
    color = defaultColor;
  }

  if (status === 'success') {
    color = 'green';
  }

  if (status === 'failed') {
    color = 'red';
  }

  return color;
}
