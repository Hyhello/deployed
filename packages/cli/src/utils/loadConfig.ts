#! /usr/bin/env node

import Ajv from 'ajv';
import path from 'path';
import logger from './logger';
import schema from '../schema.json';
import { NAMESPACE } from '../config';
import { cosmiconfigSync } from 'cosmiconfig';
import { isPlainObject, isNumber, toNumber, isBoolean } from '@hyhello/utils';

const ajv = new Ajv({ allowUnionTypes: true, strictTuples: false });

// 搜索配置文件列表
const searchPlaces: string[] = [
	'package.json',
	`.${NAMESPACE}rc`,
	`.${NAMESPACE}.json`,
	`.${NAMESPACE}.yaml`,
	`.${NAMESPACE}.yml`,
	`.${NAMESPACE}.js`,
	`.${NAMESPACE}.cjs`
];

// 获取当前property
const pathGetProperty = (instancePath: string): string => {
	const { name: key, dir } = path.parse(instancePath);
	let property = key;
	if (isNumber(toNumber(key))) {
		property = `${path.parse(dir).name}[${key}]`;
	}
	return property;
};

// 加载配置
const loadConfig = (configPath?: string): IApi => {
	const explorerSync = cosmiconfigSync(NAMESPACE, { searchPlaces });
	const result = configPath && !isBoolean(configPath) ? explorerSync.load(configPath) : explorerSync.search();
	if (!result) {
		logger.error(
			`Configuration file does not exist, please run the command ${logger.underline(
				`${NAMESPACE}-cli init`
			)} to create file first.`
		);
	}
	if (!isPlainObject(result?.config)) {
		logger.error(`Invalid configuration file at ${result?.filepath}`);
	}
	const validateSchema = ajv.compile(schema);
	if (!validateSchema(result?.config) && Array.isArray(validateSchema.errors)) {
		const { message, instancePath } = validateSchema.errors[0];
		const keyword = pathGetProperty(instancePath);
		logger.error(`The configuration you provided is wrong: property '${keyword}' ${message}`);
	}
	return result?.config;
};

export default loadConfig;
