#! /usr/bin/env node
import type { logger } from '../utils';
import type { NodeSSH } from 'node-ssh';
import { AsyncParallelHook } from 'tapable';

interface IArgs {
	opts: IDeployOpts;
	logger: typeof logger;
}

interface ISSHArgs extends IArgs {
	ssh: NodeSSH;
}

export interface IHook {
	start: AsyncParallelHook<IArgs>;
	beforeExec: AsyncParallelHook<IArgs>;
	afterExec: AsyncParallelHook<IArgs>;
	beforeZip: AsyncParallelHook<IArgs>;
	afterZip: AsyncParallelHook<IArgs>;
	beforeConnect: AsyncParallelHook<IArgs>;
	afterConnect: AsyncParallelHook<ISSHArgs>;
	beforeUpload: AsyncParallelHook<ISSHArgs>;
	afterUpload: AsyncParallelHook<ISSHArgs>;
	beforeBckup: AsyncParallelHook<ISSHArgs>;
	afterBckup: AsyncParallelHook<ISSHArgs>;
	beforeDeploy: AsyncParallelHook<ISSHArgs>;
	afterDeploy: AsyncParallelHook<IArgs>;
	done: AsyncParallelHook<IArgs>;
}

export default class Compiler {
	// IArgs: object;
	readonly hook: Readonly<IHook>;
	constructor() {
		this.hook = Object.freeze({
			start: new AsyncParallelHook<IArgs>(['IArgs']),
			beforeExec: new AsyncParallelHook<IArgs>(['IArgs']),
			afterExec: new AsyncParallelHook<IArgs>(['IArgs']),
			beforeZip: new AsyncParallelHook<IArgs>(['IArgs']),
			afterZip: new AsyncParallelHook<IArgs>(['IArgs']),
			beforeConnect: new AsyncParallelHook<IArgs>(['IArgs']),
			afterConnect: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			beforeUpload: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			afterUpload: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			beforeBckup: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			afterBckup: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			beforeDeploy: new AsyncParallelHook<ISSHArgs>(['ISSHArgs']),
			afterDeploy: new AsyncParallelHook<IArgs>(['IArgs']),
			done: new AsyncParallelHook<IArgs>(['IArgs'])
		});
	}
}
