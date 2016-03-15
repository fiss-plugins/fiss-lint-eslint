/**
 * a javascript linter plugin of fiss based on eslint
 * @author zhangyihua
 */


/**
 * eslint ignore
 * @param  {Object} fiel  An instence of File class, which defined in fis.
 * @param  {Object} conf  The lint conf.
 * @return {Boolean}      If current subpath matchs one of ignore pattern, return true.
 */
function eslintIgnore(file, conf) {
	var ignored = [];

	if (conf.ignoreFiles) {
		var ignoreFiles = conf.ignoreFiles;
		if (typeof ignoreFiles === 'string' || fis.util.is(ignoreFiles, 'RegExp')) {
		  ignored = [ignoreFiles];
		} else if (fis.util.is(ignoreFiles, 'Array')) {
		  ignored = ignoreFiles;
		}
		delete conf.ignoreFiles;
	}
	if (ignored) {
		for (var i = 0, len = ignored.length; i < len; i++) {
		  if (fis.util.filter(file.subpath, ignored[i])) {
		    return true;
		  }
		}
	}
	return false;
}

/**
 * make array value unique
 * @param  {Array} arr A array which would be checked
 * @return {Array}     A array which value is unique
 */
function arrUniq(arr) {
	var tmpArr = [],
		 tmpObj = {},
		 tmp;
	for(var i=0; i< arr.length; i++) {
		tmp = arr[i];
		if (!tmpObj[tmp]) {
			tmpArr.push(tmp);
			tmpObj[tmp] = true;
		}
	}
	return tmpArr;
}


module.exports = function(content, file, conf) {
  var assign = require('mixin-deep');
  var defConf = require('./package.json').defconf;
  var globals = defConf.globals;


  if (conf.globals) {
  	 globals = globals.concat(conf.globals);
  	 conf.globals = arrUniq(globals);
  	 delete defConf.globals;
  }

  if (conf.rules) {
  	assign(defConf.rules, conf.rules);
  	delete conf.rules;
  }
  var lastConf = assign(defConf, conf);

  if (eslintIgnore(file, lastConf)) {
  	return;
  }

  var CLIEngine = require("eslint").CLIEngine;
  var cli = new CLIEngine(lastConf);
  var report = cli.executeOnText(content);
  var formatter = cli.getFormatter();

  fis.log.info(file.id, formatter(report.results).replace(/\<text\>/, ''));
};