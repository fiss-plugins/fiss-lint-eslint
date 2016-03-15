# fiss-lint-eslint

[![npm version](https://badge.fury.io/js/fiss-lint-eslint.svg)](https://badge.fury.io/js/fiss-lint-eslint)  [![npm](https://img.shields.io/npm/dt/fiss-lint-eslint.svg)](http://npm-stat.com/charts.html?package=fiss-lint-eslint&author=zhangyihua&from=2016-01-01&to=2116-01-24)

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
	ignoreFiles: ['js/lib/**.js', 'js-conf.js'],
	envs: ['browser', 'node'],
	globals: ['$'],
	rules: {
		"semi": [1],
        "no-undef": [2]
        "no-use-before-define": [1],
        "no-unused-vars": [1],
        "no-eval": [1]
	}
};

fis.match('js/*.js', {
	lint: fis.plugin('eslint', eslintConf)
});

```

`eslintConf` 是对 eslint 的配置，参见 [Configuring ESLint](http://eslint.org/docs/user-guide/configuring) 。其属性类型参见 [CLIEngine](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)。

`eslintConf.ignoreFiles`： 一个数组，配置应该忽略掉的文件，数组成员为文件的匹配模式。


### 默认配置

```js
	{
	  "envs": ["browser", "node"],
	  "useEslintrc": false,
	  "ignoreFiles": ["fis-conf.js"],
	  "globals": [
	    "__inline",
	    "__uri",
	    "__RESOURCE_MAP__",
	    "fis"
	  ],
	  "rules": {
	      "no-undef": [2],
	      "no-use-before-define": [1],
	      "no-unused-vars": [1],
	      "no-eval": [1],
	      "use-isnan": [2],
	      "valid-typeof": [2],
	      "no-unreachable": [1],
	      "no-dupe-args": [1],
	      "no-dupe-keys": [1]
	  }
	}
```


当自定义配置的属性与默认配置属性相同时，除了 `rules` 和 `globals` 会叠加外，其他属性值均被覆盖。


默认配置规则（rules）说明：

- [no-undef] 变量不通过 var 进行声明或引用未定义变量。
- [no-eval] 不使用 eval()。
- [no-use-befor-define] 避免在变量定义之前使用变量。
- [no-unused-vars] 变量声明但未使用。
- [use-isnan] 判断一个数是否是NaN的时候不允许使用foo === NaN这样的操作，而是使用isNaN函数进行判断。
- [valid-typeof] typeof的结果必须和一个有效的字符串进行比较，如typeof foo === 'strnig'即是不合法的字符串。
- [no-unreachable] 不允许在return、throw、continue、break等中断语句之后出现代码。
- [no-dupe-args] 方法的参数中不允许有重复值。
- [no-dupe-keys] 定义对象时不允许有重复的键。


规则错误级别说明：

0 ：关闭当前规则

1 ：warning

2 ：error


更多规则请参见 [eslint rules](http://eslint.org/docs/rules/)。
