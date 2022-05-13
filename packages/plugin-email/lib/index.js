"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: 'qq',
            secure: false,
            auth: {
                user: '673089899@qq.com',
                pass: 'eapcuwtscgiwbddd'
            }
        });
        const info = yield transporter.sendMail({
            from: '"Fred Foo 👻" <673089899@qq.com>',
            to: '582016306@qq.com,673089899@qq.com',
            subject: 'Hello ✔',
            text: 'Hello world?',
            html: '<b>Hello world?</b>'
        });
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
    });
}
main().catch(console.error);
