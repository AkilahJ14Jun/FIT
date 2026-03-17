"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = executeCommand;
const child_process_1 = require("child_process");
const logger_1 = require("./logger");
function executeCommand(command) {
    try {
        logger_1.logger.cmd(command);
        (0, child_process_1.execSync)(command, { stdio: 'inherit' });
    }
    catch (error) {
        throw new Error('Erro ao executar comando');
    }
}
