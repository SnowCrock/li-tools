#!/usr/bin/env node

const program = require('commander')
const { spawn }  = require('child_process')
const path = require('path')
const packageJson = require('../package.json')

function range(val) {
  return val.split('..').map(Number);
}

function list(val) {
  return val.split(',');
}

function collect(val, memo) {
  memo.push(val);
  return memo;
}

function increaseVerbosity(v, total) {
  return total + 1;
}

// program
//   .version('0.0.1')
//   .usage('[options] <file ...>')
//   .command('start', 'start a dev server', )
//   .option('-i, --integer <n>', 'An integer argument', parseInt)
//   .option('-f, --float <n>', 'A float argument', parseFloat)
//   .option('-r, --range <a>..<b>', 'A range', range)
//   .option('-l, --list <items>', 'A list', list)
//   .option('-o, --optional [value]', 'An optional value')
//   .option('-c, create [value]', 'A repeatable value', collect, [])
//   .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
//   .parse(process.argv)

// program.range = program.range || []

spawn('node', [path.resolve(__dirname, '../lib/server.js')], { stdio: 'inherit' })