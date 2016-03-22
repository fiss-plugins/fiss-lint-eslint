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

/**
 * formatter
 * @param  {Array} results The result of linter
 * @example
 * resultes = [ {
 *  filePath: '<text>',
    messages: [ {
    	ruleId: 'no-undef',
    	severity: 2,
    	message: '\'b\' is not defined.',
    	line: 7,
    	column: 8,
    	nodeType: 'Identifier',
    	source: '\ta = a+b;'
    } ],
    errorCount: 1,
    warningCount: 0
    } ]
 * @return {String}         The result message
 * @example
 *    7:8  error  'b' is not defined.  no-undef

	  8:2  error  'wlskd' is not defined.  no-undef

	  2 problem  (2 errors, 0 warnings)
 */
function formatter(results) {
    if (!results) {
        throw new Error('Type Error: is an invalid results!');
    }
    var msg = '';
    results = results[0];

    var err = results.errorCount,
    	warn = results.warningCount;

    var total = err + warn;
    var messages = results.messages;

    messages.forEach(function(msgItem) {
        var ruleId = msgItem.ruleId,
            line = msgItem.line,
            col = msgItem.column,
            desc = msgItem.message,
            severity = msgItem.severity;
        var type = severity == 1 ? 'warning'.yellow : 'error'.red; // error type

        // 7:8  error  'b' is not defined  no-undef
        msg += '\n  ' + line + ':' + col + '  ' + type + '  ' + desc + '  ' + ruleId + '\n';
    });

    // 1 problem (1 error, 0 warnings)
    var count = '\n  ' + total + ' problem  (' + err + ' errors, ' + warn +' warnings)';
    msg += count.bold.yellow;
    return msg;
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

  if (report.errorCount || report.warningCount) {
  	var msg = formatter(report.results);
  	fis.log.info('%s  %s \n%s', file.id, 'fail!'.red, msg);
  	return;
  }

  fis.log.info(file.id, ' pass!'.green);
};