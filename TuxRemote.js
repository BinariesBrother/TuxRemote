var program = require('commander');
var logger  = require('node-yolog');

var ModuleManager = require('./moduleManager.js');
var hook = require('./hook.js');

/**
 * Enable/disable logger with commander options
 */
program
  .version('0.0.1')
  .option('-d, --debug',   'active debug log')
  .option('-e, --error',   'active error log')
  .option('-o, --todo',    'active todo log')
  .option('-i, --info',    'active info log')
  .option('-w, --warning', 'active warning log')
  .option('-t, --trace',   'active trace log')
  .option('-a, --all',     'active all log')
  .parse(process.argv);

if (program.all === undefined) {
  logger.set(program.debug !== undefined,    'debug');
  logger.set(program.error !== undefined,    'error');
  logger.set(program.todo !== undefined,     'todo');
  logger.set(program.info !== undefined,     'info');
  logger.set(program.trace !== undefined,    'trace');
  logger.set(program.warning !== undefined,  'warning');
}
else {
  logger.set(true, 'warning', 'debug', 'error', 'todo', 'info', 'trace');
}

let mManager = new ModuleManager();
mManager.loadAll();
