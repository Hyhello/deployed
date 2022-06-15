#! /usr/bin/env node

import inquirer from 'inquirer';
import runTasks, { runTry } from '../core';
import { logger, loadConfig } from '../utils';

export default {
	isDefault: true,
	description: '部署项目',
	options: [
		{
			argv: '-c, --config-file <path>',
			description: '自定义配置文件'
		},
		{
			argv: '-m, --mode <env>',
			description: '指定部署环境'
		},
		{
			argv: '-t, --try-run',
			description: '演示模式'
		},
		{
			argv: '-y, --yes',
			description: '是否默认执行（取消提示）'
		}
	],
	apply(opts: IDeployOpts) {
		const { mode, configFile, tryRun, yes } = opts;
		if (tryRun) return runTry();
		// 检测并加载配置文件
		const config = loadConfig(configFile);
		const configModeMap = new Map(config.modeList.map((item) => [item.mode, item]));
		const modeList: string[] = (mode ? mode.split(',') : config.cluster || []).filter((item) =>
			configModeMap.has(item)
		);
		const names = modeList.map((env) => configModeMap.get(env)?.name).join('、');
		// 输出提示
		inquirer
			.prompt([
				{
					type: 'rawlist',
					name: 'cluster',
					message: '请选择部署环境?',
					when: !modeList.length,
					choices: config.modeList.map((item) => {
						return {
							name: item.name,
							value: item.mode
						};
					})
				},
				{
					type: 'confirm',
					name: 'continue',
					message: `是否将${logger.underline(config.projectName)}项目部署到${logger.underline(names)}?`,
					when: !!modeList.length && !yes
				}
			])
			.then(async (answer) => {
				if (answer.continue === false) {
					logger.info('已取消部署');
					return;
				}
				const lastTime = new Date().getTime();
				const clusterList = 'cluster' in answer ? [answer.cluster] : modeList;
				for (let i = 0, ii = clusterList.length; i < ii; i++) {
					const localConfig = configModeMap.get(clusterList[i]);
					if (ii > 1) {
						logger.log(`\n正在部署 ${logger.underline(localConfig?.name)} 项目\n`);
					} else {
						console.log('\n');
					}
					await runTasks({
						projectName: config.projectName,
						global_privateKey: config.privateKey,
						global_passphrase: config.passphrase,
						global_script: config.script,
						global_removeLocalDir: config.removeLocalDir,
						...opts,
						...localConfig,
						remotePath: localConfig?.remotePath.replace(/\/$/, '')
					});
				}
				logger.success(`恭喜您，项目已成功部署，本次部署共耗时${(new Date().getTime() - lastTime) / 1000}s`, {
					prefixText: '\n'
				});
			})
			.catch((e) => {
				logger.error(e);
			});
	}
};
