#! /usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import semver from 'semver';
import logger from './logger';
import { NAMESPACE } from '../config';
import { random } from '@hyhello/utils';

// 日志
export { default as logger } from './logger';

// 加载配置文件
export { default as loadConfig } from './loadConfig';

// 加载plugin文件
export { default as loadPlugin } from './loadPlugin';

// 检测文件路径是否存在
export const pathExistsSync = (pathDir: string): boolean => {
    return fs.pathExistsSync(pathDir);
};

// 检测当前node版本号
export const checkNodeVersion = (v: string) => {
    if (!semver.satisfies(process.version, v)) {
        logger.error(
            `You ar using Node ${process.version}, but this version of ${NAMESPACE}-cli requres Node ${v}. Please upgrage your Node version.`
        );
    }
};

// resolveCWD
export const resolveCWD = (dir: string): string => {
    return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
};

// 随机Promise
export const randomPromiseFn = (func: () => void): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            func();
            resolve();
        }, Math.floor(random(1000, 10000)));
    });
};
