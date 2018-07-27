function getBabelConfig(noBabel) {
  const presets = [
    require.resolve('babel-preset-env'),
    require.resolve('babel-preset-stage-2'),
    require.resolve('babel-preset-react'),
  ]
  if(noBabel) presets.splice(0, 2)
  return { presets }
}

module.exports = getBabelConfig