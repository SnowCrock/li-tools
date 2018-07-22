function getBabelConfig() {
  const presets = [
    require.resolve('babel-preset-env'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-2'),
  ]
  return {presets}
}

module.exports = getBabelConfig