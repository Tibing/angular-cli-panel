const webpack = require("webpack");

function PanelPlugin(options) {
  // Setup the plugin instance with options...
}

PanelPlugin.prototype.apply = function (compiler) {

  new webpack.ProgressPlugin((percent, msg) => {
    // sendData(`PROGRESS ${percent}, ${msg}`);
  })
    .apply(compiler);

  compiler.hooks.run.tapAsync('PanelPlugin', (done) => {
    sendData('RUN');
    done();
  });

  compiler.hooks.compile.tap('PanelPlugin', () => {
    sendData('COMPILING');
  });

  compiler.hooks.invalid.tap('PanelPlugin', () => {
    sendData('INVALID');
  });

  compiler.hooks.failed.tap('PanelPlugin', () => {
    sendData('FAILED');
  });

  compiler.hooks.done.tapAsync('PanelPlugin', (stats) => {
    console.log(Object.keys(stats.compilation));
    sendData(`DONE in ${stats.endTime - stats.startTime}ms`);
    sendData(`ERRORS=[${stats.compilation.errors}]`);
    sendData(`WARNINGS=[${stats.compilation.warnings}]`);
  });

  function sendData(events) {
    console.log('===');
    console.log(events);
    console.log('===');
  }


};

module.exports = PanelPlugin;
