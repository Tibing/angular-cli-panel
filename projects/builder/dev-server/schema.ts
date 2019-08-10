import { DevServerBuilderOptions } from '@angular-devkit/build-angular';

import { CliPanelBuilderSchema } from '../schema';

export type CliPanelDevServerSchema = CliPanelBuilderSchema & DevServerBuilderOptions;
