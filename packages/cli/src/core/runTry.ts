#! /usr/bin/env node

import inquirer from 'inquirer';
import { logger, randomPromiseFn } from '../utils';

const runTry = (yes = false) => {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: '是否运行演示模式?',
                when: !yes
            }
        ])
        .then(async (answer) => {
            if (answer.continue === false) return;
            const spiner = logger.spinner();
            const lastTime = new Date().getTime();
            logger.log('(1) npm run build');
            spiner.start('编译新版本...');
            await randomPromiseFn(() => {
                spiner.succeed('编译成功!');
                logger.log('(2) 连接服务器');
                spiner.start('连接中...');
            });
            await randomPromiseFn(() => {
                spiner.succeed('连接成功!');
                logger.log('(3) 上传压缩包');
                spiner.start('上传中...');
            });
            await randomPromiseFn(() => {
                spiner.succeed('上传成功!');
                logger.log('(4) 备份旧版本');
                spiner.start('备份中...');
            });
            await randomPromiseFn(() => {
                spiner.succeed('备份成功!');
                logger.log('(5) 部署新版本');
                spiner.start('部署中...');
            });
            await randomPromiseFn(() => {
                spiner.succeed('部署成功!');
                logger.success(`恭喜您！项目已成功部署，本次部署共耗时：${(new Date().getTime() - lastTime) / 1000}s`, {
                    prefixText: '\n'
                });
            });
        });
};

export default runTry;
