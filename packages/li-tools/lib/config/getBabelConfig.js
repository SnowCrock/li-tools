function getBabelConfig(useBabel) {
  const presets = [
    require.resolve('babel-preset-env'),
    require.resolve('babel-preset-stage-2'),
    require.resolve('babel-preset-react'),
  ]
  if(!useBabel) presets.splice(3)
  return { presets }
}

module.exports = getBabelConfig