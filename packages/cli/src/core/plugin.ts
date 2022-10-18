#! /usr/bin/env node

import { SyncHook } from 'tapable';

interface IHook {
	readonly beforeExec: any; // 代码规范检查，自定义发布工程名称；
	readonly afterExec: any; //
	readonly beforeZip: any;
	readonly afterZip: any;
	readonly beforeConnect: any;
	readonly afterConnect: any;
	readonly beforeUpload: any;
	readonly afterUpload: any;
	readonly beforeBckup: any;
	readonly afterBckup: any;
	readonly beforeDeploy: any;
	readonly afterDeploy: any;
	readonly done: any;
}

export default class Plugin {
	// opts: object;
	readonly hook: IHook;
	constructor() {
		this.hook = Object.freeze({
			beforeExec: new SyncHook(),
			afterExec: new SyncHook(),
			beforeZip: new SyncHook(),
			afterZip: new SyncHook(),
			beforeConnect: new SyncHook(),
			afterConnect: new SyncHook(),
			beforeUpload: new SyncHook(),
			afterUpload: new SyncHook(),
			beforeBckup: new SyncHook(),
			afterBckup: new SyncHook(),
			beforeDeploy: new SyncHook(),
			afterDeploy: new SyncHook(),
			done: new SyncHook(['arg1'])
		});
	}
}
