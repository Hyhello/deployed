#! /usr/bin/env node
import { AsyncSeriesHook } from 'tapable';
import { IArgs, ISSHArgs, IDeployHook } from '@type/index';

export default class Compiler {
	// IArgs: object;
	readonly hook: Readonly<IDeployHook>;
	constructor() {
		this.hook = Object.freeze({
			start: new AsyncSeriesHook<IArgs>(['IArgs']),
			beforeExec: new AsyncSeriesHook<IArgs>(['IArgs']),
			afterExec: new AsyncSeriesHook<IArgs>(['IArgs']),
			beforeZip: new AsyncSeriesHook<IArgs>(['IArgs']),
			afterZip: new AsyncSeriesHook<IArgs>(['IArgs']),
			beforeConnect: new AsyncSeriesHook<IArgs>(['IArgs']),
			afterConnect: new AsyncSeriesHook<ISSHArgs>(['ISSHArgs']),
			beforeUpload: new AsyncSeriesHook<ISSHArgs>(['ISSHArgs']),
			afterUpload: new AsyncSeriesHook<ISSHArgs>(['ISSHArgs']),
			beforeBckup: new AsyncSeriesHook<ISSHArgs>(['ISSHArgs']),
			afterBckup: new AsyncSeriesHook<ISSHArgs>(['ISSHArgs']),
			beforeDeploy: new AsyncSeriesHook<ISSHArgs>(['ISSHArgs']),
			afterDeploy: new AsyncSeriesHook<IArgs>(['IArgs']),
			done: new AsyncSeriesHook<IArgs>(['IArgs'])
		});
	}
}
