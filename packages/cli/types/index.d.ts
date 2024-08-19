/* eslint-disable */
import ora from 'ora';
import type { NodeSSH } from 'node-ssh';
import type { AsyncSeriesHook } from 'tapable';


// 打印部分
declare const logger: {
    log(...msgs: string[]): void;
    info(msg: string, options?: ora.Options): void;
    success(msg: string, options?: ora.Options): void;
    warn(msg: string, options?: ora.Options): void;
    error(msg: string, options?: ora.Options): never;
    underline(msg?: string): string;
    spinner(options?: ora.Options): ora.Ora;
};


// deploy apply callback
interface InquirerOpts {
    configFile?: string;                   // 自定义配置文件路径
    mode?: string;                         // 指定部署的环境别名
    autoSkipScript?: boolean;              // 检查构建文件是否存在，如果存在则跳过执行script命令
    tryRun?: boolean;                      // 是否试运行
    yes?: boolean;                         // 是否默认执行（取消提示）
}

interface IBaseOptions {
    privateKey?: string;                         // 登录服务器私钥
    passphrase?: string;                         // 对于加密的私钥(privateKey)，这是用来解密它的密码短语
    script?: string;                             // 运行脚本
    backupName?: string;                         // 备份名称
    removeLocalDir?: boolean;                    // 是否删除localPath
    clearRemoteDir?: boolean;                    // 部署新版本前是否先清空原旧版本文件
}

interface IMode {
    mode: string;                                // 环境别名
    name: string;                                // 环境名称
    host: string;                                // 主机
    port: number;                                // 端口
    username: string;                            // 登录主机的用户名
    password?: string;                           // 登录主机的密码
    localPath: string;                           // 待上传的本地文件夹路径
    remotePath: string;                          // 发布到服务器的路径地址（绝对路径）
    backupPath?: string;                         // 服务器备份地址（绝对路径）
}

// 配置文件
export interface IDeployApi extends IBaseOptions {
    projectName: string;                          // 项目名称
    cluster?: string[];                           // 发布集群
    modeList: Array<IMode & IBaseOptions>;        // 所有待部署的环境集合
    plugin?: Array<string | [string, object]>;    // 插件
    $schema?: string;                             // 配置json.schemastore，主要用于提示
}

// 插件配置文件
export interface IDeployOpts extends IMode, IBaseOptions {
    index: number;                                // 当前运行step, 主要用于打印
    projectName: string;                          // 项目名称
}

interface IArgs {
	opts: IDeployOpts;
    logger: typeof logger;
}

interface ISSHArgs extends IArgs {
	ssh: NodeSSH;
}

// 插件相关
export interface IDeployHook {
    start: AsyncSeriesHook<IArgs>;
    beforeExec: AsyncSeriesHook<IArgs>;
    afterExec: AsyncSeriesHook<IArgs>;
    beforeZip: AsyncSeriesHook<IArgs>;
    afterZip: AsyncSeriesHook<IArgs>;
    beforeConnect: AsyncSeriesHook<IArgs>;
    afterConnect: AsyncSeriesHook<ISSHArgs>;
    beforeUpload: AsyncSeriesHook<ISSHArgs>;
    afterUpload: AsyncSeriesHook<ISSHArgs>;
    beforeBckup: AsyncSeriesHook<ISSHArgs>;
    afterBckup: AsyncSeriesHook<ISSHArgs>;
    beforeDeploy: AsyncSeriesHook<ISSHArgs>;
    afterDeploy: AsyncSeriesHook<IArgs>;
    done: AsyncSeriesHook<IArgs>;
}

// 插件
export interface IDeployCompiler {
    readonly hook: Readonly<IDeployHook>;
}

// plugin class
export interface IDeployPlugin {
    apply(compiler: IDeployCompiler): void;
};
