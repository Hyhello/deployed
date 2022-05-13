#! /usr/bin/env node

import fs from 'fs-extra';
import inquirer from 'inquirer';
import archiver from 'archiver';
import { exec } from 'child_process';
import { NAMESPACE } from '../config';
import { NodeSSH, Config } from 'node-ssh';
import { formatDate } from '@hyhello/utils';
import { logger, pPipe, resolveCWD, pathExistsSync } from '../utils';

const ssh = new NodeSSH();

const spinner = logger.spinner();

// 输出文件名称
const OUTPUT_NAME = resolveCWD(`${NAMESPACE}.tar.gz`);

// 构建项目
const execScriptCommand = (opts: any, index: number): Promise<void> => {
	const script = opts.script || opts.global_script;
	return new Promise((resolve, reject) => {
		logger.log(`(${index}) ${script}`);
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
const floderConvertToZipStream = (opts: any, index: number): Promise<void> => {
	const { localPath } = opts;
	return new Promise((resolve, reject) => {
		logger.log(`(${index}) 压缩目录: ${logger.underline(localPath)}`);
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
const connectServer = async (opts: any, index: number) => {
	try {
		logger.log(`(${index}) 连接服务器: ${logger.underline(opts.host)}`);
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
						message: '请输入服务器密码?'
					}
				]);
				password = answer.password;
			}
			config.password = password;
		}
		spinner.start('连接中...\n');
		await ssh.connect(config);
		spinner.succeed('连接成功!');
	} catch (e) {
		spinner.fail(`连接失败：${e}`);
		process.exit(1);
	}
};

// 上传文件到服务器并备份
const uploadTarToServer = async (opts: any, index: number) => {
	try {
		const { remotePath } = opts;
		const remoteTarPath = remotePath + '.tar.gz';
		logger.log(`(${index}) 上传压缩包: ${logger.underline(remoteTarPath)}`);
		spinner.start('上传中...\n');
		await ssh.putFile(OUTPUT_NAME, remoteTarPath);
		spinner.succeed('上传成功!');
	} catch (e) {
		spinner.fail(`上传失败：${e}`);
		process.exit(1);
	}
};

// 备份旧版本
const bckupRemotePath = async (opts: any, index: number) => {
	try {
		const { remotePath, backupPath, backupName } = opts;
		const bakName = `${formatDate(new Date(), backupName || 'yyyy-MM-dd_hh_mm_ss')}.tar.gz`;
		logger.log(`(${index}) 备份旧版本: ${logger.underline(backupPath)}`);
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
		fs.unlinkSync(OUTPUT_NAME);
		process.exit(1);
	}
};

// 部署项目
const unTarFile = async (opts: any, index: number) => {
	const { remotePath, localPath, clearRemoteDir, removeLocalDir, global_removeLocalDir } = opts;
	try {
		logger.log(`(${index}) 部署新版本`);
		spinner.start('部署中...\n');
		const remoteTarPath = remotePath + '.tar.gz';
		const clearExecCommand = clearRemoteDir ? [`rm -rf ${remotePath}/*`] : [];
		const script = clearExecCommand
			.concat([`tar -xpf ${remoteTarPath} -C ${remotePath}`, `rm -f ${remoteTarPath}`])
			.join(' && ');
		const { stderr } = await ssh.execCommand(script);
		if (stderr) throw new Error(stderr);
		if (removeLocalDir || global_removeLocalDir) {
			fs.removeSync(localPath);
		}
		spinner.succeed('部署成功!');
	} catch (e) {
		spinner.fail(`部署失败：${e}`);
	} finally {
		fs.unlinkSync(OUTPUT_NAME);
		// 断开连接
		ssh.dispose();
	}
};

// 运行任务
const runTasks = async (opts: any) => {
	const { script, global_script, backupPath } = opts;
	const list = [];
	if (script || global_script) {
		list.push(execScriptCommand);
	}
	list.push(floderConvertToZipStream);
	list.push(connectServer);
	list.push(uploadTarToServer);
	if (backupPath) {
		list.push(bckupRemotePath);
	}
	list.push(unTarFile);
	const execute = pPipe(...list);
	await execute(opts);
};

export default runTasks;

export { default as runTry } from './runTry';
