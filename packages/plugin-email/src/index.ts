import nodemailer, { type SendMailOptions } from 'nodemailer';

interface IOpts {
	mailOptions: any;
	sendOptions: SendMailOptions;
}

export default class PluginEmail {
	opts: IOpts;
	constructor(opts: IOpts) {
		this.opts = opts;
	}
	apply(compiler: any) {
		compiler.hook.done.tap('PluginEmail', () => this.sendEmail());
	}
	async sendEmail() {
		const { opts } = this;
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport(opts.mailOptions);
		// send mail with defined transport object
		await transporter.sendMail(opts.sendOptions);
	}
}
