# fiss-lint-eslint

基于 [eslint](http://eslint.org/) 的 fiss javascript linter。由于 fiss 基于 fis3 拓展，fis-conf.js 以及插件使用等都需遵循 fis3 规则。

----


## 使用

### 安装


全局安装：

```cli
	npm install -g fiss-lint-eslint
```

安装到当前目录：

```cli
	npm install fiss-lint-eslint
```


### 配置

**example:**

```javascript
// fis-conf.js

var eslintConf = {
	ignore: ['index.js'],
	rules: {
		"semi": 2
	},
	env: {
		browser: true,
		node: true
	}
};

fis.match('js/*.js', {
	lint: fis.plugin('eslint', eslintConf)
});

```

`eslintConf` 是对 eslint 的配置，参见 [Configuring ESLint](http://eslint.org/docs/user-guide/configuring)。

`eslintConf.ignore`： 一个数组，配置应该忽略掉的文件，数组成员为文件的匹配模式，为 String 或 RegExp 类型。