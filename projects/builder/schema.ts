export enum ExecutionMode {
  PANEL = 'panel',
  BUILDER = 'builder'
}

export interface CliPanelBuilderSchema {
  raw: boolean;
  port: number;
  mode: ExecutionMode;
}
