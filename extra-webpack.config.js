const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = config => {
  config.plugins.push(new DashboardPlugin());
  return config;
};
