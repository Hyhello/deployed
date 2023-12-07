import type { IDeployCompiler, IDeployPlugin } from '@deployed/cli';
import conventionalChangelog from 'conventional-changelog';
import concat from 'concat-stream';

export default class PluginChangelog implements IDeployPlugin {
	constructor(opts: conventionalChangelog.Options) {
		console.log(opts);
	}
	apply(compiler: IDeployCompiler) {
		compiler.hook.afterExec.tapPromise('plugin-changelog', () => {
			return new Promise((resolve, reject) => {
				const res = conventionalChangelog({
					preset: 'angular'
				});
				res.pipe(
					concat((result) => {
						const res = result.toString().trim();
						console.log('res:', res);
						resolve(res);
						return res;
					})
				);
				res.on('error', reject);
			});
		});
	}
}
