import * as program from "commander";
import * as logger  from "node-yolog";

import "reflect-metadata";

import {ModuleManager} from "./moduleManager";

/**
 * Enable/disable logger with commander options
 */
program
  .version("0.0.1")
  .option("-d, --debug",    "Enable debug log")
  .option("-e, --error",    "Enable error log")
  .option("-o, --todo",     "Enable todo log")
  .option("-i, --info",     "Enable info log")
  .option("-w, --warning",  "Enable warning log")
  .option("-t, --trace",    "Enable trace log")
  .option("-a, --all",      "Enable all log")
  .option("-p, --port <n>", "Use specific port. Default to 3000", parseInt)
  .option("-h, --hostname <n>", "Use specific hostname. Default to 0.0.0.0")
  .parse(process.argv);

if (program.all === undefined) {
  logger.set(program.debug !== undefined,    "debug");
  logger.set(program.error !== undefined,    "error");
  logger.set(program.todo !== undefined,     "todo");
  logger.set(program.info !== undefined,     "info");
  logger.set(program.trace !== undefined,    "trace");
  logger.set(program.warning !== undefined,  "warning");
}
else {
  logger.set(true, "warning", "debug", "error", "todo", "info", "trace");
}

let mManager = new ModuleManager();
mManager.loadAll();
mManager.initAll();
