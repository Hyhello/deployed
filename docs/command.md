# 命令行

### 用法

##### #获取帮助

通过 <code>--help</code> | <code>-h</code> 参数来获取帮助。

```Shell
npx deployed-cli --help | npx deployed-cli -h
```

##### #获取版本

通过 <code>--version</code> | <code>-V</code> 参数来获取版本号。

```Shell
npx deployed-cli --version | npx deployed-cli -V
```

##### #初始化配置文件

通过 <code>init</code> | <code>i</code> 参数来初始化配置文件。

```Shell
npx deployed-cli init | npx deployed-cli i
```

##### #部署项目

通过 <code>deploy</code> | <code>d</code> 参数来部署项目。

```Shell
npx deployed-cli deploy | npx deployed-cli d | npx deployed-cli
```

> [!TIP]
> 直接使用 <code>deployed-cli</code> 作为 <code>deployed-cli deploy</code> 的缩写。<br>

##### #获取部署项目相关帮助

通过 <code>--help</code> | <code>-h</code> 参数来初始化配置文件。

```Shell
npx deployed-cli deploy --help | npx deployed-cli deploy -h
```

##### #自定义配置文件路径

通过 <code>--config-file &lt;path&gt;</code> | <code>-c &lt;path&gt;</code> 参数来指定自定义配置文件。

```Shell
npx deployed-cli [deploy] --config-file <path> | npx deployed-cli [deploy] -c <path>
```

##### #指定部署环境

通过 <code>--mode &lt;env&gt;</code> | <code>-m &lt;env&gt;</code> 参数来指定部署环境。

```Shell
npx deployed-cli [deploy] --mode <env> | npx deployed-cli [deploy] -m <env>
```

##### #演示模式

通过 <code>--try-run</code> | <code>-t</code> 参数来运行演示模式。

```Shell
npx deployed-cli [deploy] --try-run | npx deployed-cli [deploy] -t
```

> [!Warning]
> **【重要】，以上命令中"[deploy]"，表示运行当前命令加不加deploy都可以。**
