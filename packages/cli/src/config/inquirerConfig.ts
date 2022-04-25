#! /usr/bin/env node

import inquirer from 'inquirer';
import { initConfigFile } from './index';
import { resolveCWD, pathExistsSync } from '../utils';

// inquirer配置文件
const inquirerConfig: inquirer.QuestionCollection<inquirer.Answers> = [
	{
		type: 'confirm',
		name: 'isExist',
		message: '当前配置文件已存在，是否覆盖？',
		askAnswered: true,
		when() {
			return pathExistsSync(resolveCWD(initConfigFile));
		}
	},
	{
		type: 'input',
		name: 'projectName',
		message: '项目名称:',
		default() {
			const pkgcwdPath = resolveCWD('package.json');
			return pathExistsSync(pkgcwdPath) ? require(pkgcwdPath).name : '';
		},
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'input',
		name: 'script',
		message: '构建命令:',
		default: 'npm run build',
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'input',
		name: 'modeList[0].mode',
		message: '需要部署的环境：',
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'input',
		name: 'modeList[0].name',
		message: '环境名称:',
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'input',
		name: 'modeList[0].host',
		message: '服务器地址:',
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'number',
		name: 'modeList[0].port',
		message: '服务器端口:',
		default: 22,
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'input',
		name: 'modeList[0].username',
		message: '用户名:',
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'input',
		name: 'modeList[0].localPath',
		message: '本地目录:',
		when(answers) {
			return answers.isExist;
		}
	},
	{
		type: 'input',
		name: 'modeList[0].remotePath',
		message: '服务器目录:',
		when(answers) {
			return answers.isExist;
		}
	}
];

export default inquirerConfig;
