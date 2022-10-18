#! /usr/bin/env node

import { SyncHook } from 'tapable';

export default class Plugin {
	// opts: object;
	enabled = true;
	constructor() {
		this.hook = Object.freeze({
			beforeExec: new SyncHook(),
			afterExec: new SyncHook(),
			done: new SyncHook(['arg1'])
		});
	}
}
