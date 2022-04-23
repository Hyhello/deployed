/**
 * 作者：hyhello
 * 时间：2022-04-23
 * 描述：copy cli下面的changelog.md文件
 */
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const lernaInfo = require('../lerna.json');

// 标签匹配
const singleReg = /<(\w+)>.*<\/\1>/gm;

const outputDir = path.resolve('./docs');

// 更新版本号
const updateVersion = () => {
    const odir = path.join(outputDir, '_coverpage.md');
    let md = fs.readFileSync(odir, { encoding: 'utf8' });
    md = md.replace(singleReg, `<$1>v${lernaInfo.version}</$1>`);
    fs.writeFileSync(odir, md, { encoding: 'utf8' });
};

// 复制文件
const copyFile = () => {
    const docsList = ['./CHANGELOG.md', './README.md'];
    docsList.forEach(dir => {
        fs.copySync(dir, path.join(outputDir, dir), { overwrite: true });
    });
};

const run = () => {
    updateVersion();
    copyFile();
    // 此处为了配合lerna version 得 lifecycle钩子特意加上的。
    exec(`git add ${outputDir}/*.md`)
};

run();
