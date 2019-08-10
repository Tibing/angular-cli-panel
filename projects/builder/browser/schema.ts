import { BrowserBuilderOptions } from '@angular-devkit/build-angular';

import { CliPanelBuilderSchema } from '../schema';

export type CliPanelBrowserSchema = CliPanelBuilderSchema & BrowserBuilderOptions;
