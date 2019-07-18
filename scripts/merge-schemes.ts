const fs = require('fs');
const lodash = require('lodash');
const path = require('path');

const { writeFileSync } = fs;
const { merge } = lodash;
const { join } = path;

interface CustomSchema {
  originalSchemaPath: string;
  schemaExtensionPaths: string[];
  newSchemaPath: string;
}

const wd = process.cwd();
const schemesToMerge: CustomSchema[] = require(`${wd}/projects/builder/schemes`);

for (const customSchema of schemesToMerge) {
  const originalSchema = require(customSchema.originalSchemaPath);
  const schemaExtensions = customSchema.schemaExtensionPaths.map((path: string) => require(path));
  const newSchema = schemaExtensions.reduce((extendedSchema: any, currentExtension: any) =>
    merge(extendedSchema, currentExtension), originalSchema);
  writeFileSync(join(wd, customSchema.newSchemaPath), JSON.stringify(newSchema, null, 2), 'utf-8');
}

fs.copyFileSync(`${wd}/projects/builder/package.json`, `${wd}/dist/builder/package.json`);
fs.copyFileSync(`${wd}/projects/builder/builders.json`, `${wd}/dist/builder/builders.json`);
