# 插件

插件可为 @deployed/cli 提供可扩展

### 使用插件

如果插件在npm上，您可以输入插件的名称，@deployed/cli 将检查它是否安装在node_modules中。这将添加到插件配置选项中，该选项采用一个数组。

```node
{
  "plugins": ["@deployed/plugin-*"]
}
```

### 插件参数
插件参数由插件名和参数对象组成一个数组，可以在配置文件中设置。
如果不指定参数，下面这几种形式都是一样的：

```node
{
  "plugins": ["pluginA", ["pluginA"], ["pluginA", {}]]
}
```

### 插件开发

目前插件通过钩子方式来实现，插件可使用钩子有以下：

```node
interface IArgs {
    opts: IDeployOpts;
    logger: typeof logger;
}

interface ISSHArgs extends IArgs {
    ssh: NodeSSH;
}

<!-- 钩子 -->
interface IDeployHook {
    start: AsyncSeriesHook<IArgs>;            // 发布之前触发
    beforeExec: AsyncSeriesHook<IArgs>;       // 编译之前触发
    afterExec: AsyncSeriesHook<IArgs>;        // 编译之后触发
    beforeZip: AsyncSeriesHook<IArgs>;        // 压缩之前触发
    afterZip: AsyncSeriesHook<IArgs>;         // 压缩之后触发
    beforeConnect: AsyncSeriesHook<IArgs>;    // 连接服务器之前触发
    afterConnect: AsyncSeriesHook<ISSHArgs>;  // 连接服务器之后触发
    beforeUpload: AsyncSeriesHook<ISSHArgs>;  // 上传之前触发
    afterUpload: AsyncSeriesHook<ISSHArgs>;   // 上传之后触发
    beforeBckup: AsyncSeriesHook<ISSHArgs>;   // 备份之前触发
    afterBckup: AsyncSeriesHook<ISSHArgs>;    // 备份之后触发
    beforeDeploy: AsyncSeriesHook<ISSHArgs>;  // 部署之前触发
    afterDeploy: AsyncSeriesHook<IArgs>;      // 部署之后触发
    done: AsyncSeriesHook<IArgs>;             // 发布完成之后触发
}
```

目前插件编写模板如下：

```node
import type { IDeployCompiler } from '@deployed/cli';

export default class Plugin {
    constructor(options: any) {
        this.options = options;
    }
    apply(compiler: IDeployCompiler) {
        // 异步
        compiler.hook.done.tapPromise('Plugin', ({ opts, logger }) => {
            return new Promise<void>((resolve, reject) => {
                logger.log(`(${opts.index++}) 正在发送邮件`);
                const spinner = logger.spinner();
                spinner.start('发送中');
                setTimeout(() => {
                    spinner.succeed('发送完成!');
                    resolve();
                }, 1000);
            });
        });

        或者

        // 异步
        compiler.hook.done.tapAsync('Plugin', ({ opts, logger }, callback) => {
            logger.log(`(${opts.index++}) 正在发送邮件`);
            const spinner = logger.spinner();
            spinner.start('发送中');
            setTimeout(() => {
                spinner.succeed('发送完成!');
                callback();
            }, 1000);
        });

        或者

        // 同步
        compiler.hook.done.tap('Plugin', ({ opts, logger }) => {
            logger.log(`(${opts.index++}) 正在发送邮件`);
            const spinner = logger.spinner();
            spinner.start('发送中');
            spinner.succeed('发送完成!');
        });
    }
}
```
