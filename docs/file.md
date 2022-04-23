# 配置文件

### 文件相关配置

<code>@deployed/cli</code> 被设计为完全可配置的，这意味着您可以通过任何一种类型配置文件来配置您的部署要求，目前配置文件支持以下几种方式：

- 默认配置文件
    - <code>.deployed.*</code>文件，具有不同的扩展名（<code>.deployedrc</code>, <code>.js</code>, <code>.json</code>, <code>.cjs</code>, <code>.yaml</code>, <code>.yml</code>）。

    - <code>package.json</code>带有"deployed"属性配置的文件。

- 自定义配置文件
    - 你可以在命令行运行时指定一个任意的配置文件（--config-file）。

    > [!WARNING]
    > 如果你在你的主目录（通常 ~/）有一个配置文件，<code>@deployed/cli</code>只有在无法找到其他配置文件时才使用它。
