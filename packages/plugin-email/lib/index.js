"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
class PluginEmail {
    constructor(opts) {
        this.opts = opts;
    }
    apply(compiler) {
        compiler.hook.done.tap('PluginEmail', () => this.sendEmail());
    }
    sendEmail() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { opts } = this;
            const transporter = nodemailer_1.default.createTransport(opts.mailOptions);
            yield transporter.sendMail(opts.sendOptions);
        });
    }
}
exports.default = PluginEmail;
