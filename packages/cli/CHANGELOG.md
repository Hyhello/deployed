# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.10.0](https://github.com/Hyhello/deployed/compare/v0.6.0...v0.10.0) (2022-12-05)


### Bug Fixes

* 去除Sync相关钩子，合并到异步钩子里。 ([4cc41f2](https://github.com/Hyhello/deployed/commit/4cc41f29b3973a930fdfbcae3569213d7b1ced2d))
* 修复部署时出错后流程不终止问题 ([328bf1a](https://github.com/Hyhello/deployed/commit/328bf1af28c8dfecc38c386b3c5b7ecd87e1abec))
* 修复客户端时间与服务器时间对不上报错问题 ([0b9859c](https://github.com/Hyhello/deployed/commit/0b9859cfab93816483d6b54d409ad3ec682b74ec))


### Features

* 编写核心插件 ([8607ac7](https://github.com/Hyhello/deployed/commit/8607ac7cd45d0f122ce1e0a633a4918771436042))
* 编写核心插件 ([b9cfad5](https://github.com/Hyhello/deployed/commit/b9cfad54709cdf06421ddee7285467ca86de2131))
* 完成Plugin核心功能开发 ([3424097](https://github.com/Hyhello/deployed/commit/3424097f55f4865191faac9c58b685ce4f462d9c))





# [0.9.0](https://github.com/Hyhello/deployed/compare/v0.6.0...v0.9.0) (2022-12-05)


### Bug Fixes

* 去除Sync相关钩子，合并到异步钩子里。 ([4cc41f2](https://github.com/Hyhello/deployed/commit/4cc41f29b3973a930fdfbcae3569213d7b1ced2d))
* 修复部署时出错后流程不终止问题 ([328bf1a](https://github.com/Hyhello/deployed/commit/328bf1af28c8dfecc38c386b3c5b7ecd87e1abec))
* 修复客户端时间与服务器时间对不上报错问题 ([0b9859c](https://github.com/Hyhello/deployed/commit/0b9859cfab93816483d6b54d409ad3ec682b74ec))


### Features

* 编写核心插件 ([8607ac7](https://github.com/Hyhello/deployed/commit/8607ac7cd45d0f122ce1e0a633a4918771436042))
* 编写核心插件 ([b9cfad5](https://github.com/Hyhello/deployed/commit/b9cfad54709cdf06421ddee7285467ca86de2131))
* 完成Plugin核心功能开发 ([3424097](https://github.com/Hyhello/deployed/commit/3424097f55f4865191faac9c58b685ce4f462d9c))





# [0.8.0](https://github.com/Hyhello/deployed/compare/v0.7.0...v0.8.0) (2022-12-05)


### Bug Fixes

* 去除Sync相关钩子，合并到异步钩子里。 ([4cc41f2](https://github.com/Hyhello/deployed/commit/4cc41f29b3973a930fdfbcae3569213d7b1ced2d))





# [0.7.0](https://github.com/Hyhello/deployed/compare/v0.6.0...v0.7.0) (2022-12-04)


### Bug Fixes

* 修复部署时出错后流程不终止问题 ([328bf1a](https://github.com/Hyhello/deployed/commit/328bf1af28c8dfecc38c386b3c5b7ecd87e1abec))
* 修复客户端时间与服务器时间对不上报错问题 ([0b9859c](https://github.com/Hyhello/deployed/commit/0b9859cfab93816483d6b54d409ad3ec682b74ec))


### Features

* 编写核心插件 ([8607ac7](https://github.com/Hyhello/deployed/commit/8607ac7cd45d0f122ce1e0a633a4918771436042))
* 编写核心插件 ([b9cfad5](https://github.com/Hyhello/deployed/commit/b9cfad54709cdf06421ddee7285467ca86de2131))
* 完成Plugin核心功能开发 ([3424097](https://github.com/Hyhello/deployed/commit/3424097f55f4865191faac9c58b685ce4f462d9c))






# [0.6.0](https://github.com/Hyhello/deployed/compare/v0.4.3...v0.6.0) (2022-08-08)


### Bug Fixes

* 完善index.d.ts类型，添加plugin及$schema字段 ([eecf19f](https://github.com/Hyhello/deployed/commit/eecf19fc16047ab2004a7aab848b7cf291634ede))
* 修复日志打印格式问题 ([5c4252b](https://github.com/Hyhello/deployed/commit/5c4252b6e2255f9591c2e01770caf6e30d82e5a7))
* 优化run try模式 ([b405e62](https://github.com/Hyhello/deployed/commit/b405e629923bce20763eadf5e8c144db3ec947b7))


### Features

* command deploy add --yes parameter ([3db5340](https://github.com/Hyhello/deployed/commit/3db53402ed57107be0486f00fec17b36052f365f))






## [0.4.3](https://github.com/Hyhello/deployed/compare/v0.4.2...v0.4.3) (2022-05-19)


### Bug Fixes

* 升级依赖导致全局安装报错问题 ([692f1b0](https://github.com/Hyhello/deployed/commit/692f1b00a168d3c57f7b4350f048e0a17db9ace9))






## [0.4.2](https://github.com/Hyhello/deployed/compare/v0.4.1...v0.4.2) (2022-05-18)


### Bug Fixes

* 命令init 用户名添加默认值root ([6d6c019](https://github.com/Hyhello/deployed/commit/6d6c01972a2a328f7993d129e032b29c72af4d6a))
* 修复strictTuples严格模式下报警告问题 ([53e1983](https://github.com/Hyhello/deployed/commit/53e198319d50daa6e79d9b82931317af93c7bde1))
* 修改构建逻辑及schema.json添加$schema属性 ([ecac1d2](https://github.com/Hyhello/deployed/commit/ecac1d29952b816c53f66b5940a5252601a5f71d))
* 修改schema.json，添加backupPath属性 ([9b1948d](https://github.com/Hyhello/deployed/commit/9b1948d6799a08faf9799550df4f951758fbe6c9))
* 修改tryrun模式，使其更真实的展示构建流程 ([c58ae15](https://github.com/Hyhello/deployed/commit/c58ae156c82d29c84582d039bd10e76759364b7a))





## [0.4.1](https://github.com/Hyhello/deployed/compare/v0.4.0...v0.4.1) (2022-04-25)


### Bug Fixes

* 修改schema.json，去除$id属性 ([8ffea76](https://github.com/Hyhello/deployed/commit/8ffea76e508fc0c304178dc8dbf5f871e797b579))
* 修改schema配置文件，添加描述description ([8730711](https://github.com/Hyhello/deployed/commit/87307111a530df99832cca414d109cf3529caced))






# 0.4.0 (2022-04-23)


### Features

* Initial release ([e8c49ae](https://github.com/Hyhello/deployed/commit/e8c49aed5bbf4342b407fcca66e8b7e2909fd319))
