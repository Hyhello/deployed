import type { IDeployCompiler, IDeployPlugin } from '@deployed/cli';
import gitRawCommits from 'git-raw-commits';
import fs from 'fs';
import CONFIG from './config';

type IOpts = typeof CONFIG;

export default class PluginChangelog implements IDeployPlugin {
	options: IOpts;
	constructor(options: IOpts) {
		this.options = options;
	}
	apply(compiler: IDeployCompiler) {
		compiler.hook.afterExec.tapPromise('plugin-changelog', ({ opts, logger }) => {
			logger.log(`(${opts.index++}) 正在生成部署日志`);

			const spinner = logger.spinner();
			spinner.start('生成中');

			let _resolve: (...args: any[]) => void;
			let _reject: (...args: any[]) => void;

			const _promise = new Promise<void>((resolve, reject) => {
				_resolve = resolve;
				_reject = reject;
			});

			const res = gitRawCommits({
				format: '%b',
				path: './packages/plugin-changelog/**'
			});

			const chunks: string[] = [];

			res.on('data', (chunk: string) => chunks.push(chunk));
			res.on('error', (e) => _reject(e));
			res.on('end', () => {
				const header = '测试';
				chunks.forEach((chunk) => {
					console.log('chunk', chunk.toString());
				});
				const newChangelog = chunks.join('');
				process.env._DEPLOYED_VERSION_LOG_ = chunks;
				const updatedChangelog = `${header}\n\n${newChangelog}`;
				fs.writeFileSync('./VERSION', updatedChangelog, 'utf-8');
				spinner.succeed('生成完成!');
				_resolve();
			});

			return _promise;
		});
	}
}
