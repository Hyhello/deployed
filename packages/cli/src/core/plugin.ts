#! /usr/bin/env node
import type { logger } from '../utils';
import type { NodeSSH } from 'node-ssh';
import { SyncHook, AsyncParallelHook } from 'tapable';

interface IArgs {
	opts: IDeployOpts;
	logger: typeof logger;
}

interface ISSHArgs extends IArgs {
	ssh: NodeSSH;
}

// 异步钩子名称
type AsyncName =
	| 'start'
	| 'beforeExec'
	| 'afterExec'
	| 'beforeZip'
	| 'afterZip'
	| 'beforeConnect'
	| 'afterConnect'
	| 'beforeUpload'
	| 'afterUpload'
	| 'beforeBckup'
	| 'afterBckup'
	| 'beforeDeploy'
	| 'afterDeploy'
	| 'done';

export interface IHook {
	start: AsyncParallelHook<IArgs>;
	startSync: SyncHook<IArgs>;
	beforeExec: AsyncParallelHook<IArgs>;
	beforeExecSync: SyncHook<IArgs>;
	afterExec: AsyncParallelHook<IArgs>;
	afterExecSync: SyncHook<IArgs>;
	beforeZip: AsyncParallelHook<IArgs>;
	beforeZipSync: SyncHook<IArgs>;
	afterZip: AsyncParallelHook<IArgs>;
	afterZipSync: SyncHook<IArgs>;
	beforeConnect: AsyncParallelHook<IArgs>;
	beforeConnectSync: SyncHook<IArgs>;
	afterConnect: AsyncParallelHook<ISSHArgs>;
	afterConnectSync: SyncHook<ISSHArgs>;
	beforeUpload: AsyncParallelHook<ISSHArgs>;
	beforeUploadSync: SyncHook<ISSHArgs>;
	afterUpload: AsyncParallelHook<ISSHArgs>;
	afterUploadSync: SyncHook<ISSHArgs>;
	beforeBckup: AsyncParallelHook<ISSHArgs>;
	beforeBckupSync: SyncHook<ISSHArgs>;
	afterBckup: AsyncParallelHook<ISSHArgs>;
	afterBckupSync: SyncHook<ISSHArgs>;
	beforeDeploy: AsyncParallelHook<ISSHArgs>;
	beforeDeploySync: SyncHook<ISSHArgs>;
	afterDeploy: AsyncParallelHook<IArgs>;
	afterDeploySync: SyncHook<IArgs>;
	done: AsyncParallelHook<IArgs>;
	doneSync: SyncHook<IArgs>;
}

// 同步钩子集合
export type SyncName = keyof Omit<IHook, AsyncName>;

export default class Compiler {
	// IArgs: object;
	readonly hook: Readonly<IHook>;
	constructor() {
		this.hook = Object.freeze({
			start: new AsyncParallelHook<IArgs>(['IArgs']),
			startSync: new SyncHook<IArgs>(['IArgs']),
			beforeExec: new AsyncParallelHook<IArgs>(['IArgs']),
			beforeExecSync: new SyncHook<IArgs>(['IArgs']),
			afterExec: new AsyncParallelHook<IArgs>(['IArgs']),
			afterExecSync: new SyncHook<IArgs>(['IArgs']),
			beforeZip: new AsyncParallelHook<IArgs>(['IArgs']),
			beforeZipSync: new SyncHook<IArgs>(['IArgs']),
			afterZip: new AsyncParallelHook<IArgs>(['IArgs']),
			afterZipSync: new SyncHook<IArgs>(['IArgs']),
			beforeConnect: new AsyncParallelHook<IArgs>(['IArgs']),
			beforeConnectSync: new SyncHook<IArgs>(['IArgs']),
			afterConnect: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			afterConnectSync: new SyncHook<ISSHArgs>(['ISSHArgs']),
			beforeUpload: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			beforeUploadSync: new SyncHook<ISSHArgs>(['ISSHArgs']),
			afterUpload: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			afterUploadSync: new SyncHook<ISSHArgs>(['ISSHArgs']),
			beforeBckup: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			beforeBckupSync: new SyncHook<ISSHArgs>(['ISSHArgs']),
			afterBckup: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			afterBckupSync: new SyncHook<ISSHArgs>(['ISSHArgs']),
			beforeDeploy: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			beforeDeploySync: new SyncHook<ISSHArgs>(['ISSHArgs']),
			afterDeploy: new AsyncParallelHook<IArgs>(['IArgs']),
			afterDeploySync: new SyncHook<IArgs>(['IArgs']),
			done: new AsyncParallelHook<IArgs>(['IArgs']),
			doneSync: new SyncHook<IArgs>(['IArgs'])
		});
	}
}
