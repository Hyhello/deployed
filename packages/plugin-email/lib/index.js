"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PluginEmail {
    constructor(opts = {}) {
        this.opts = opts;
    }
    apply(compiler) {
        compiler.hook.beforeExec.tap('PluginEmail', () => {
            console.log('beforeExec');
        });

        compiler.hook.afterExec.tap('PluginEmail', () => {
            console.log('afterExec');
        });

        compiler.hook.done.tap('PluginEmail', (arg) => {
            console.log('plugin:opts', this.opts);
            console.log('测试arg', arg);
        });
    }
}
exports.default = PluginEmail;
