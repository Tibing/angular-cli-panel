module.exports = [
  {
    originalSchemaPath: '@angular-devkit/build-angular/src/browser/schema.json',
    schemaExtensionPaths: [`${__dirname}/browser/schema.ext.json`, `${__dirname}/schema.ext.json`],
    newSchemaPath: `./dist/builder/browser/schema.json`,
  },
  {
    originalSchemaPath: '@angular-devkit/build-angular/src/dev-server/schema.json',
    schemaExtensionPaths: [`${__dirname}/dev-server/schema.ext.json`, `${__dirname}/schema.ext.json`],
    newSchemaPath: `./dist/builder/dev-server/schema.json`,
  },
];
