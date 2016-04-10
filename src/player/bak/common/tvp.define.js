/**
 * @fileOverview 云播放器 x根节点定义
 */

/**
 * @namespace x
 * @type {object}
 */
var x = {};

/**
 * 最后一次更改时间，grunt自动维护，不需要手动修改
 * @type String
 */
x.lastModify = "2014-01-23 17:23:29";


/**
 * 最后build的版本号，不需要手动修改，每次使用grunt合并或者编译，都会自动+1
 * @type String
 */
x.ver = "$V2.0Build1011$";
/**
 * 框架名称
 * @type {String}
 */
x.name = "播放器";

//借助uglify可以实现条件编译，比如if(DEBUG){console.log("test")}
//如果uglify设置DEBUG为false，那么整个语句都不会出现在最终relase的代码文件中
typeof DEBUG == "undefined" && (DEBUG = 1);
if (typeof FILEPATH == "undefined") {
	if (DEBUG) {
		if (document.location.hostname == "popotang.qq.com" || document.location.hostname == "qqlive.oa.com") {
			FILEPATH = "../js/";
		} else {
			FILEPATH = "http://imgcache.gtimg.cn/tencentvideo_v1/x/js/";
		}
	}
}

x.log = function(msg) {
	if (DEBUG && document.getElementById('x_debug_console') != null) {
		var debugN = document.getElementById('x_debug_console');
		debugN.innerHTML += msg + " | ";
	} else if (window.console) {
		window.console.log("[" + (x.log.debugid++) + "] " + msg);
	}
}
/**
 * 打印调试日志
 *
 * @param {}
 *          msg
 */
x.debug = function(msg) {
	if (!DEBUG && x.log.isDebug === -1) {
		x.log.isDebug = x.$.getUrlParam("debug") == "true" ? 1 : 0;
	}
	if (DEBUG || !! x.log.isDebug) {
		x.log(msg);
	}
}
/**
 * @ignore
 * @type
 * @example
 * -1表示根据URL参数，1表示调试，0表示非调试，建议-1
 */
x.log.isDebug = -1;
/**
 * @ignore
 * @type Number
 */
x.log.debugid = 1;