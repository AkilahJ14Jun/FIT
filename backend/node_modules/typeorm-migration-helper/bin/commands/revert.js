"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertMigration = revertMigration;
const ora_1 = __importDefault(require("ora"));
const logger_1 = require("../utils/logger");
const execute_1 = require("../utils/execute");
function revertMigration(options) {
    const spinner = (0, ora_1.default)('Revertendo última migration...').start();
    const command = `npx typeorm-ts-node-commonjs migration:revert -d ${options.dataSource}`;
    try {
        (0, execute_1.executeCommand)(command);
        spinner.succeed('Última migration revertida!');
        logger_1.logger.success('Reversão concluída.');
    }
    catch (error) {
        spinner.fail('Erro ao reverter migration.');
        logger_1.logger.error(error.message);
    }
}
