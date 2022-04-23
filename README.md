# @deployed/cli

一款轻量级的前端自动化部署工具。

### npm 安装

虽然你可以在你的机器上全局安装<code>@deployed/cli</code>，但是最好在本地逐个项目安装它。
这主要有两个原因。

1. 同一台机器上的不同项目可能依赖于不同版本的<code>@deployed/cli</code>，允许您分别更新它们。

2. 没有对工作环境的隐式依赖可以使项目更易于移植和设置。

我们可以通过运行以下命令在本地安装:

```nodejs
npm install --save-dev @deployed/cli
```

> **Note:** 如果你没有一个package.son，在安装之前创建一个。这将确保与npx命令的正确交互。

完成安装后, package.json 文件应包括:

```Diff
{
    "devDependencies": {
       "@deployed/cli": "^0.1.1"
    }
}
```
