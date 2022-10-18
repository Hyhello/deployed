#! /usr/bin/env node

import logger from './logger';
import { resolveCWD } from './index';
import { isArray } from '@hyhello/utils';

const pluginKeywordReg = /^[@\w]+\/plugin-[\w-]+$/;

// 加载模块
function importModule(name: string) {
	const mod = require(resolveCWD(`node_modules/${name}`));
	return mod && mod.default ? mod.default : mod;
}

const loadPlugin = (plugins: any[] = []) => {
	return plugins.reduce((pluginList, plugin) => {
		let pluginName: string | undefined;
		let pluginOpt: object = {};
		if (typeof plugin === 'string') {
			pluginName = plugin;
		} else if (isArray(plugin)) {
			pluginName = plugin[0];
			pluginOpt = plugin[1] || {};
		}
		if (!pluginName) return pluginList;
		// 补全 plugin 关键字
		const moduleName = pluginKeywordReg.test(pluginName)
			? pluginName
			: pluginName?.replace(/\/([\w-]+)$/, '/plugin-$1');

		try {
			const PluginClass = importModule(moduleName);
			pluginList.push(new PluginClass(pluginOpt));
			return pluginList;
		} catch (e) {
			logger.error(`Plugin '${pluginName}' loading failed：${e}`);
		}
	}, []);
};

export default loadPlugin;
