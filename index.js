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

	if (conf.ignore) {
		if (typeof conf.ignore === 'string' || fis.util.is(conf.ignore, 'RegExp')) {
		  ignored = [conf.ignore];
		} else if (fis.util.is(conf.ignore, 'Array')) {
		  ignored = conf.ignore;
		}
		delete conf.ignore;
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

module.exports = function(content, file, conf) {
  if (eslintIgnore(file, conf)) {
  	return;
  }

  var CLIEngine = require("eslint").CLIEngine;

  var cli = new CLIEngine(conf);

  var report = cli.executeOnText(content);
  var formatter = cli.getFormatter();

  
  fis.log.info(file.id, formatter(report.results).replace(/\<text\>/, ''));
};