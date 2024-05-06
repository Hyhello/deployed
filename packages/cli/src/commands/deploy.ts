#! /usr/bin/env node

import inquirer from 'inquirer';
import Plugin from '../core/plugin';
import { oneOf } from '@hyhello/utils';
import runTasks, { runTry } from '../core';
import { InquirerOpts } from '@type/index';
import { logger, loadConfig, loadPlugin, pathExistsSync } from '../utils';

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
    apply(opts: InquirerOpts) {
        const { mode, configFile, tryRun, yes } = opts;
        if (tryRun) return runTry(yes);

        // 初始化插件
        const compiler = new Plugin();

        // 检测并加载配置文件
        const config = loadConfig(configFile);

        // 加载plugin
        if (config.plugin && Array.isArray(config.plugin)) {
            // 插件列表
            const pluginList = loadPlugin(config.plugin);

            pluginList.forEach((plugin) => plugin.apply(compiler));
        }

        const configModeMap = new Map(config.modeList.map((item) => [item.mode, item]));
        const modeList: string[] = (mode ? mode.split(',') : config.cluster || []).filter((item) =>
            configModeMap.has(item)
        );
        const names = modeList.map((env) => configModeMap.get(env)?.name).join('、');
        // 输出提示
        inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'cluster',
                    message: '请选择部署环境?',
                    when: !modeList.length,
                    choices: config.modeList.map((item, index) => {
                        return {
                            name: item.name,
                            value: item.mode,
                            checked: index === 0
                        };
                    }),
                    validate(list) {
                        if (list.length < 1) {
                            return '至少选择一个部署环境.';
                        }
                        return true;
                    }
                },
                {
                    type: 'confirm',
                    name: 'continue',
                    message: `是否将 ${logger.underline(config.projectName)} 项目部署到 ${logger.underline(names)} ?`,
                    when: !!modeList.length && !yes
                }
            ])
            .then(async (answer) => {
                if (answer.continue === false) {
                    logger.info('已取消部署');
                    return;
                }
                const lastTime = new Date().getTime();
                const clusterList = modeList.length ? modeList : answer.cluster || [];
                for (let i = 0, ii = clusterList.length; i < ii; i++) {
                    const modeName = clusterList[i];
                    const localConfig = configModeMap.get(modeName);
                    // 说明clusterList.length 只有一条记录，
                    const type = ii === 1 ? 'both' : i === 0 ? 'start' : i === ii - 1 ? 'done' : 'other';
                    if (!localConfig) return Promise.reject(`部署 ${logger.underline(modeName)} 环境失败，请检查配置~`);
                    if (ii > 1) logger.log(`\n正在部署 ${logger.underline(localConfig.name)} 项目\n`);
                    // 此处解决配置 global script 相关配置
                    // 导致多次发包，多次打包问题。
                    // 现在改为，如果配置的是全局script，且局部没有配置script，则，只有第一次会构建，剩余的发包则不会构建
                    let script = localConfig.script || config.script;
                    if (
                        oneOf(type, ['other', 'done']) &&
                        !localConfig.script &&
                        pathExistsSync(localConfig.localPath)
                    ) {
                        script = '';
                    }
                    await runTasks(
                        {
                            projectName: config.projectName,
                            ...opts,
                            ...localConfig,
                            script,
                            privateKey: localConfig.privateKey || config.privateKey,
                            passphrase: localConfig.passphrase || config.passphrase,
                            removeLocalDir: localConfig.removeLocalDir || config.removeLocalDir,
                            remotePath: localConfig.remotePath.replace(/\/$/, ''),
                            index: 1 // 作为计数
                        },
                        compiler,
                        type
                    );
                }
                logger.success(`恭喜您，项目已成功部署，本次部署共耗时 ${(new Date().getTime() - lastTime) / 1000} s`, {
                    prefixText: '\n'
                });
            })
            .catch((e) => {
                logger.error(e);
            });
    }
};
