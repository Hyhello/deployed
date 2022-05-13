import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
async function main() {
	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		service: 'qq',
		secure: false, // true for 465, false for other ports
		auth: {
			user: '673089899@qq.com', // generated ethereal user
			pass: 'eapcuwtscgiwbddd' // generated ethereal password
		}
	});

	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: '"Fred Foo 👻" <673089899@qq.com>', // sender address
		to: '582016306@qq.com,673089899@qq.com', // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world?', // plain text body
		html: '<b>Hello world?</b>' // html body
	});

	console.log('Message sent: %s', info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
