"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const ora_1 = __importDefault(require("ora"));
const logger_1 = require("../utils/logger");
const execute_1 = require("../utils/execute");
function runMigrations(options) {
    const spinner = (0, ora_1.default)('Executando migrations...').start();
    const command = `npx typeorm-ts-node-commonjs migration:run -d ${options.dataSource}`;
    try {
        (0, execute_1.executeCommand)(command);
        spinner.succeed('Migrations executadas com sucesso!');
        logger_1.logger.success('Todas as migrations foram aplicadas.');
    }
    catch (error) {
        spinner.fail('Erro ao executar migrations.');
        logger_1.logger.error(error.message);
    }
}
