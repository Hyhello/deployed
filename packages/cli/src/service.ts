#! /usr/bin/env node

import * as fs from 'fs-extra';
import { Command } from 'commander';
import { checkNodeVersion } from './utils';
import { pkg, NAMESPACE, helpAfterText } from './config';

const program = new Command();

const nodeVersion = pkg.engines.node;

// 设置默认命令
const setupDefaultCommands = () => {
	program.name(NAMESPACE + '-cli');
	program.description(pkg.description);
	program.version(pkg.version, '-v, --version', '当前版本号');
	program.helpOption('-h, --help', '获取帮助');
	program.addHelpText('after', helpAfterText);
	program.addHelpCommand(false);
	program.showHelpAfterError();
};

// 注册命令
const registerCommands = () => {
	const commandsPath = `${__dirname}/commands`;

	const pathToPlugin = (path: string): void => {
		const commands = require(`${commandsPath}/${path}`).default;
		const commandName = path.split('.')[0];
		const alias = path.charAt(0);

		const programs = program
			.command(commandName, { isDefault: !!commands.isDefault })
			.description(commands.description)
			.alias(alias);

		if (commands.options && Array.isArray(commands.options)) {
			commands.options.forEach((option: typeof commands.options) => {
				programs.option(option.argv, option.description, option.default);
			});
		}
		programs.action(commands.apply);
	};
	fs.readdirSync(`${commandsPath}`).forEach(pathToPlugin);
};

export default class Service {
	constructor() {
		checkNodeVersion(nodeVersion);
		setupDefaultCommands();
		registerCommands();
	}
	run(rawArgv = []) {
		program.parse(rawArgv, { from: 'user' });
	}
}
