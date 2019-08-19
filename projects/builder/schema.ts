export enum ExecutionMode {
  PANEL = 'panel',
  BUILDER = 'builder'
}

export interface CliPanelBuilderSchema {
  raw: boolean;
  ebport: number;
  mode: ExecutionMode;
}
