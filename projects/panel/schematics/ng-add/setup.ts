import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import { Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getProjectFromWorkspace } from '@angular/cdk/schematics';

import { Schema } from './schema';
import { writeJSON } from '../util';


export default function(options: Schema) {
  return (tree: Tree) => {

    const workspace: WorkspaceSchema = getWorkspace(tree);
    const project: WorkspaceProject = getProjectFromWorkspace(workspace, options.project);

    if (project.architect) {
      if (project.architect.build) {
        project.architect.build.builder = '@cli-panel/builder:browser';
      }
      if (project.architect.serve) {
        project.architect.serve.builder = '@cli-panel/builder:dev-server';
      }
    }

    writeJSON(tree, 'angular.json', workspace);

    return tree;
  };
}
