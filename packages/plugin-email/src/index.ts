import type { IDeployCompiler } from '@deployed/cli';
import nodemailer, { type SendMailOptions } from 'nodemailer';

interface IOpts {
	mailOptions: any;
	sendOptions: SendMailOptions;
}

export default class PluginEmail {
	options: IOpts;
	constructor(options: IOpts) {
		this.options = options;
	}
	apply(compiler: IDeployCompiler) {
		compiler.hook.done.tapPromise('PluginEmail', ({ opts, logger }) => {
			return new Promise<void>((resolve, reject) => {
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
