#! /usr/bin/env node

import { logger } from '../utils';
import * as inquirer from 'inquirer';

const runTry = () => {
	inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'continue',
				message: '是否运行演示模式?'
			}
		])
		.then((answer) => {
			if (!answer.continue) return;
			const spiner = logger.spinner();
			const lastTime = new Date().getTime();
			logger.log('(1) npm run build');
			spiner.start('编译新版本...');

			setTimeout(() => {
				spiner.succeed('编译成功!');
				logger.log('(2) 连接服务器');
				spiner.start('连接中...');
				setTimeout(() => {
					spiner.succeed('连接成功!');
					logger.log('(3) 上传压缩包');
					spiner.succeed('上传成功!');
					logger.log('(4) 备份旧版本');
					spiner.succeed('备份成功!');
					logger.log('(5) 部署新版本');
					spiner.succeed('部署成功!\n');
					spiner.succeed(
						`恭喜您！项目已成功部署，本次部署共耗时：${(new Date().getTime() - lastTime) / 1000}s`
					);
				}, 3000);
			}, 5000);
		});
};

export default runTry;
