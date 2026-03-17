#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generate_1 = require("./commands/generate");
const run_1 = require("./commands/run");
const revert_1 = require("./commands/revert");
const logger_1 = require("./utils/logger");
const program = new commander_1.Command();
program
    .name('typeorm-migration-helper (alias tmh)')
    .description('🧙 Helper CLI para gerenciar migrations no TypeORM')
    .version('1.0.2');
const defaultMigrationsDir = './src/migrations';
const defaultDataSource = './src/config/data-source.ts';
program
    .command('generate')
    .description('Criar uma nova migration')
    .argument('<name>', 'Nome da migration')
    .option('-m, --migrationsDir <dir>', 'Diretório das migrations', defaultMigrationsDir)
    .option('-d, --dataSource <file>', 'Arquivo de configuração do datasource', defaultDataSource)
    .action((name, options) => {
    logger_1.logger.info(`Gerando migration: ${name}`);
    (0, generate_1.generateMigration)(name, {
        migrationsDir: options.migrationsDir,
        dataSource: options.dataSource,
    });
});
program
    .command('run')
    .description('Executar todas as migrations pendentes')
    .option('-d, --dataSource <file>', 'Arquivo de configuração do datasource', defaultDataSource)
    .action((options) => {
    logger_1.logger.info('Executando migrations...');
    (0, run_1.runMigrations)({
        migrationsDir: defaultMigrationsDir,
        dataSource: options.dataSource,
    });
});
program
    .command('revert')
    .description('Reverter a última migration aplicada')
    .option('-d, --dataSource <file>', 'Arquivo de configuração do datasource', defaultDataSource)
    .action((options) => {
    logger_1.logger.info('Revertendo última migration...');
    (0, revert_1.revertMigration)({
        migrationsDir: defaultMigrationsDir,
        dataSource: options.dataSource,
    });
});
program.parse();
