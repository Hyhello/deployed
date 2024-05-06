#! /usr/bin/env node

import ora from 'ora';
import chalk from 'chalk';
import { pkg } from '../config';

const PREFIX = `[${pkg.name}]`;

// 日志
const logger = {
    log(...msgs: string[]) {
        console.log(chalk.grey(...msgs));
    },
    info(msg: string, options?: ora.Options) {
        ora(options).info(chalk.blueBright(`${PREFIX} ${msg}`));
    },
    success(msg: string, options?: ora.Options) {
        ora(options).succeed(chalk.green(`${PREFIX} ${msg}`));
    },
    warn(msg: string, options?: ora.Options) {
        ora(options).warn(chalk.yellow(`${PREFIX} ${msg}`));
    },
    error(msg: string, options?: ora.Options) {
        ora(options).fail(chalk.red(`${PREFIX} ${msg}`));
        process.exit(1);
    },
    underline(msg?: string) {
        return chalk.blue.underline.bold(msg);
    },
    spinner(options?: ora.Options): ora.Ora {
        return ora(options);
    }
};

export default logger;
