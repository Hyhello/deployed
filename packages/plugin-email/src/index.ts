import type { IDeployCompiler, IDeployPlugin } from '@deployed/cli';
import nodemailer, { type SendMailOptions } from 'nodemailer';

interface IOpts {
	mailOptions: nodemailer.TransportOptions;
	sendOptions: SendMailOptions;
}

export default class PluginEmail implements IDeployPlugin {
	options: IOpts;
	constructor(options: IOpts) {
		this.options = options;
	}
	apply(compiler: IDeployCompiler) {
		compiler.hook.afterExec.tapPromise('PluginEmail', ({ opts, logger }) => {
			return new Promise<void>((resolve, reject) => {
				console.log('_DEPLOYED_VERSION_LOG_', process.env._DEPLOYED_VERSION_LOG_);
				logger.log(`(${opts.index++}) 正在发送邮件`);
				const spinner = logger.spinner();
				spinner.start('发送中');
				this.sendEmail()
					.then(() => {
						spinner.succeed('发送完成!');
						resolve();
					})
					.catch(reject);
			});
		});
	}
	async sendEmail() {
		const { options } = this;
		const transporter = nodemailer.createTransport(options.mailOptions);
		return await transporter.sendMail(options.sendOptions);
	}
}
