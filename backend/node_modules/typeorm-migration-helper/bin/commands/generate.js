"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMigration = generateMigration;
const ora_1 = __importDefault(require("ora"));
const logger_1 = require("../utils/logger");
const execute_1 = require("../utils/execute");
function generateMigration(name, options) {
    const spinner = (0, ora_1.default)('Gerando migration...').start();
    const command = `npx typeorm-ts-node-commonjs migration:generate ${options.migrationsDir}/${name} -d ${options.dataSource}`;
    try {
        (0, execute_1.executeCommand)(command);
        spinner.succeed('Migration criada com sucesso!');
        logger_1.logger.success(`Migration ${name} gerada em ${options.migrationsDir}`);
    }
    catch (error) {
        spinner.fail('Erro ao gerar migration.');
        logger_1.logger.error(error.message);
    }
}
