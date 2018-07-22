const program = require('commander')
const { spawn } = require('child_process')

program
  .command('create <project>')
  .description('create a project')
  .option('-t, --type <type>', `project's type`)
  .action((project, options) => {
    options.type
  })

program.parse(process.argv)
