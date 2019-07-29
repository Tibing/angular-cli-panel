const filesize = require('filesize');

export function _getAssetSize(asset) {
  return filesize(asset.size || 0);
}

export function _getTotalSize(assetsList) {
  return filesize(assetsList.reduce((total, asset) => total + (asset.size || 0), 0));
}

export function _printAssets(assetsList) {
  return [['Name', 'Size']]
    .concat(assetsList.map(asset => [asset.name, _getAssetSize(asset)]))
    .concat([['Total', _getTotalSize(assetsList)]]);
}

export function formatAssets(assets) {
  // Convert to list.
  const assetsList = Object.keys(assets).map(name => ({
    name,
    size: assets[name].meta.full,
  }));

  return _printAssets(assetsList);
}
