#! /usr/bin/env node

import fs from 'fs-extra';
import inquirer from 'inquirer';
import archiver from 'archiver';
import { exec } from 'child_process';
import { NAMESPACE } from '../config';
import { NodeSSH, Config } from 'node-ssh';
import Plugin, { type IHook } from './plugin';
import { formatDate, pipe, oneOf } from '@hyhello/utils';
import { logger, resolveCWD, pathExistsSync } from '../utils';

const ssh = new NodeSSH();

const spinner = logger.spinner();

// 输出文件名称
const OUTPUT_NAME = resolveCWD(`${NAMESPACE}.tar.gz`);

// 构建项目
const execScriptCommand = (opts: IDeployOpts): Promise<void> => {
	const script = opts.script || opts.global_script;
	if (!script) return Promise.resolve();
	return new Promise<void>((resolve, reject) => {
		logger.log(`(${opts.index++}) ${script}`);
		spinner.start('编译新版本...\n');
		exec(script, (e) => {
			if (e) {
				spinner.fail(`项目编译失败：${e}`);
				reject();
				process.exit(1);
			} else {
				spinner.succeed('项目编译成功!');
				resolve();
			}
		});
	});
};

// 压缩本地文件夹为tar
const floderConvertToZipStream = (opts: IDeployOpts): Promise<void> => {
	const { localPath } = opts;
	return new Promise<void>((resolve, reject) => {
		logger.log(`(${opts.index++}) 压缩目录: ${logger.underline(localPath)}`);
		spinner.start('压缩中...\n');
		if (!pathExistsSync(localPath)) {
			spinner.fail('压缩失败，目录不存在!');
			reject();
			process.exit(1);
		}
		const output = fs.createWriteStream(OUTPUT_NAME);
		const archive = archiver('tar', {
			gzip: true,
			gzipOptions: { level: 9 }
		});
		output.on('close', () => {
			spinner.succeed('压缩成功!');
			resolve();
		});
		output.on('error', (e) => {
			spinner.fail(`压缩失败：${e}`);
			reject();
			process.exit(1);
		});
		archive.pipe(output);
		archive.directory(localPath, false);
		archive.finalize();
	});
};

// 链接服务器
const connectServer = async (opts: IDeployOpts, reconnect = false) => {
	if (!reconnect) {
		logger.log(`(${opts.index++}) 连接服务器: ${logger.underline(opts.host)}`);
	}
	const privateKey = opts.privateKey || opts.global_privateKey;
	const passphrase = opts.passphrase || opts.global_passphrase;
	const config: Config = {
		host: opts.host,
		port: opts.port,
		username: opts.username
	};
	if (privateKey) {
		config.privateKey = privateKey;
		passphrase && (config.passphrase = passphrase);
	} else {
		let password = opts.password;
		if (!password) {
			const answer = await inquirer.prompt([
				{
					type: 'password',
					name: 'password',
					message: reconnect ? '密码错误，请重新输入服务器密码?' : '请输入服务器密码?'
				}
			]);
			password = answer.password;
		}
		config.password = password;
	}
	try {
		spinner.start('连接中...\n');
		await ssh.connect(config);
		spinner.succeed('连接成功!');
	} catch (e: any) {
		if (!reconnect && !privateKey && e.level === 'client-authentication') {
			spinner.stop();
			await connectServer(opts, true);
		} else {
			spinner.fail(`连接失败：${e}`);
			fs.unlinkSync(OUTPUT_NAME); // 删除文件包
			process.exit(1);
		}
	}
};

// 上传文件到服务器并备份
const uploadTarToServer = async (opts: IDeployOpts) => {
	try {
		const { remotePath } = opts;
		const remoteTarPath = remotePath + '.tar.gz';
		logger.log(`(${opts.index++}) 上传压缩包: ${logger.underline(remoteTarPath)}`);
		spinner.start('上传中...\n');
		await ssh.putFile(OUTPUT_NAME, remoteTarPath);
		spinner.succeed('上传成功!');
	} catch (e) {
		spinner.fail(`上传失败：${e}`);
		fs.unlinkSync(OUTPUT_NAME); // 删除文件包
		process.exit(1);
	}
};

// 备份旧版本
const bckupRemotePath = async (opts: IDeployOpts) => {
	try {
		const { remotePath, backupPath, backupName } = opts;
		const bakName = backupName || '' + `${formatDate(new Date(), 'yyyy-MM-dd_hh_mm_ss')}.tar.gz`;
		logger.log(`(${opts.index++}) 备份旧版本: ${logger.underline(backupPath)}`);
		spinner.start('备份中...\n');
		const { stderr } = await ssh.execCommand(
			[
				`cd ${remotePath}`, // 切换到待发布目录
				`mkdir -p ${backupPath}`, // 创建目录
				`tar -cpf ${backupPath}/${bakName} ./` // 备份目录
			].join(' && ')
		);
		if (stderr) throw new Error(stderr);
		spinner.succeed('备份成功!');
	} catch (e) {
		spinner.fail(`备份失败：${e}`);
		fs.unlinkSync(OUTPUT_NAME); // 删除文件包
		process.exit(1);
	}
};

// 部署项目
const unTarFile = async (opts: IDeployOpts) => {
	const { remotePath, localPath, clearRemoteDir, removeLocalDir, global_removeLocalDir } = opts;
	try {
		logger.log(`(${opts.index++}) 部署新版本`);
		spinner.start('部署中...\n');
		const remoteTarPath = remotePath + '.tar.gz';
		const clearExecCommand = clearRemoteDir ? [`rm -rf ${remotePath}/*`] : [];
		const script = clearExecCommand
			.concat([`tar -xpf ${remoteTarPath} -C ${remotePath} -m`, `rm -f ${remoteTarPath}`])
			.join(' && ');
		const { stderr } = await ssh.execCommand(script);
		if (stderr) throw new Error(stderr);
		if (removeLocalDir || global_removeLocalDir) {
			fs.removeSync(localPath);
		}
		spinner.succeed('部署成功!');
		fs.unlinkSync(OUTPUT_NAME); // 删除文件包
		ssh.dispose(); // 断开连接
	} catch (e) {
		spinner.fail(`部署失败：${e}`);
		fs.unlinkSync(OUTPUT_NAME); // 删除文件包
		ssh.dispose(); // 断开连接
		process.exit(1);
	}
};

// 注册钩子，内部实现
const registryHooks = function (name: keyof IHook, compiler: Plugin): (opts: IDeployOpts) => Promise<void> {
	return function (opts: IDeployOpts) {
		return new Promise((resolve, reject) => {
			const param: any = oneOf(name, [
				'afterConnect',
				'beforeUpload',
				'afterUpload',
				'beforeBckup',
				'afterBckup',
				'beforeDeploy'
			])
				? { opts, logger, ssh }
				: { opts, logger };
			// 优先走异步钩子
			if (compiler.hook[name].taps.length) {
				compiler.hook[name].promise(param).then(resolve).catch(reject);
			} else {
				resolve();
			}
		});
	};
};

// 运行任务
const runTasks = async (opts: IDeployOpts, compiler: Plugin, type: 'start' | 'both' | 'done' | 'other') => {
	const { script, global_script, backupPath } = opts;
	const list = [];
	if (script || global_script) {
		list.push(registryHooks('beforeExec', compiler));
		list.push(execScriptCommand);
		list.push(registryHooks('afterExec', compiler));
	}
	list.push(registryHooks('beforeZip', compiler));
	list.push(floderConvertToZipStream);
	list.push(registryHooks('afterZip', compiler));
	list.push(registryHooks('beforeConnect', compiler));
	list.push(connectServer);
	list.push(registryHooks('afterConnect', compiler));
	list.push(registryHooks('beforeUpload', compiler));
	list.push(uploadTarToServer);
	list.push(registryHooks('afterUpload', compiler));
	if (backupPath) {
		list.push(registryHooks('beforeBckup', compiler));
		list.push(bckupRemotePath);
		list.push(registryHooks('afterBckup', compiler));
	}
	list.push(registryHooks('beforeDeploy', compiler));
	list.push(unTarFile);
	list.push(registryHooks('afterDeploy', compiler));
	//
	if (type === 'start' || type === 'both') {
		list.unshift(registryHooks('start', compiler));
	}
	if (type === 'done' || type === 'both') {
		list.push(registryHooks('done', compiler));
	}

	const execute = pipe(...list);
	await execute(opts);
};

export default runTasks;

export { default as runTry } from './runTry';
