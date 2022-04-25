#! /usr/bin/env node

// inquirer配置文件
export { default as inquirerConfig } from './inquirerConfig';

// NAMESPACE
export const NAMESPACE = 'deployed';

// 初始化生成的配置位置
export const initConfigFile = `.${NAMESPACE}.json`;

// package JSON
export const pkg: any = require('../../package.json');

// helpAfterText
export const helpAfterText = `\nFor more details, please see ${pkg.homepage}`;
