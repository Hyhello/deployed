#! /usr/bin/env node

import fs from 'fs-extra';
import inquirer from 'inquirer';
import { logger, resolveCWD } from '../utils';
import { initConfigFile, inquirerConfig } from '../config';

// 创建配置文件
const createConfigFile = (answers: inquirer.Answers): void => {
	delete answers.isExist;
	fs.writeFileSync(resolveCWD(initConfigFile), JSON.stringify(answers, null, 2));
};

export default {
	description: '初始化配置文件',
	apply() {
		inquirer
			.prompt(inquirerConfig, { isExist: true })
			.then((answer) => {
				if (!answer.isExist) return;
				createConfigFile(answer);
				logger.success(
					`已成功生成配置文件。请检查项目根目录中的 ${logger.underline(
						initConfigFile
					)} 文件，确认配置是否正确！`,
					{ prefixText: '\n' }
				);
			})
			.catch((e) => {
				logger.error(e);
			});
	}
};
