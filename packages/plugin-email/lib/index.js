"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const testAccount = yield nodemailer_1.default.createTestAccount();
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        const info = yield transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: '673089899@qq.com',
            subject: 'Hello ✔',
            text: 'Hello world?',
            html: '<b>Hello world?</b>'
        });
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
    });
}
main().catch(console.error);
