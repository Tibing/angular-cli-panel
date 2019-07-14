const webpack = require("webpack");
const io = require("socket.io-client");

class PanelPlugin {

  constructor() {
    this.ioClient = io.connect("http://localhost:3322");
  }

  apply(compiler) {
    new webpack.ProgressPlugin((percent, msg) => {
      // sendData(`PROGRESS ${percent}, ${msg}`);
    })
      .apply(compiler);

    compiler.hooks.run.tapAsync('PanelPlugin', (done) => {
      this.sendData('RUN');
      done();
    });

    compiler.hooks.compile.tap('PanelPlugin', () => {
      this.sendData('COMPILING');
    });

    compiler.hooks.invalid.tap('PanelPlugin', () => {
      this.sendData('INVALID');
    });

    compiler.hooks.failed.tap('PanelPlugin', () => {
      this.sendData('FAILED');
    });

    compiler.hooks.done.tapAsync('PanelPlugin', (stats) => {
      this.sendData(`DONE in ${stats.endTime - stats.startTime}ms`);
      this.sendData(`ERRORS=[${stats.compilation.errors}]`);
      this.sendData(`WARNINGS=[${stats.compilation.warnings}]`);
    });

  }

  sendData(events) {
    this.ioClient.emit('data', events);
  }

}

module.exports = PanelPlugin;
