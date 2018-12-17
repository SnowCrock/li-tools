const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')
const mkdirp = require('mkdirp')

function createTemplate(fileName, override) {
  const template = fs.readFileSync(path.join(__dirname, '../templates/reactClass.js')).toString()
  const component = fileName.split('/').reverse()[0]
  const componentName = component.split('.')[0]
  const componentClass = nunjucks.renderString(template, { Component: componentName })
  const dirname = path.dirname(fileName)
  if (!fs.existsSync(dirname)) {
    mkdirp.mkdirSync(dirname)
  }
  fs.writeFileSync(path.join(dirname, component), componentClass)
}


module.exports = function (fileName, override) {
  createTemplate(fileName, override)
}