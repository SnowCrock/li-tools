#!/usr/bin/env node

const program = require('commander')
const { spawn }  = require('child_process')
const path = require('path')
const packageJson = require('../package.json')
const version = packageJson.version

const createTemplate = require('../lib/createTemplate')

  // .option('start', 'start a project')
  // .parse(process.argv)

program
  .version(version, '-v, --version')
  .command('generate [component]')
  .option('-r, --override [override]', 'override the current file', true)
  .action((component, override) => {
    createTemplate(component, override)
  })
  .command('saveTemplate <Component>')

program.parse(process.argv)