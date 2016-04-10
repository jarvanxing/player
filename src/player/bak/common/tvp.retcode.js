/**
 * @fileOverview 封装返回码统计
 */

/* @include "x.define.js" */
/**
 * 返回码统计上报
 *
 * @type {Object}
 * @namespace x.retCode
 */
x.retCode = {
	snid: 0,
	/**
	 * 返回码上报类型枚举
	 *
	 * @type {Object}
	 */
	TYPE: {
		/**
		 * 成功
		 *
		 * @type Number
		 * @default 1
		 */
		SUC: 1,
		/**
		 * 失败
		 *
		 * @type Number
		 * @default 2
		 */
		ERR: 2
	},
	/**
	 * 配置项
	 *
	 * @type
	 */
	config: {
		/**
		 * 请求CGI的url
		 *
		 * @type String
		 * @default http://isdspeed.qq.com/cgi-bin/v.cgi
		 */
		cgi: "http://isdspeed.qq.com/cgi-bin/v.cgi",
		/**
		 * 采样率，100表示1%,1000表示0.1%...
		 *
		 * @type Number
		 * @default 1000
		 */
		sampling: 1
	},
	/**
	 * 共用的返回码
	 *
	 * @type
	 */
	commCode: {
		error: 11,
		MQzone_Err: 12
	},
	/**
	 * 上报数据
	 *
	 * @param {Number}
	 *          appid 分配的AppId
	 * @param {Number}
	 *          rettype 返回结果类型1表示成功，2表示失败
	 * @param {Number}
	 *          delay 延迟时间
	 * @param {Number}
	 *          errcode 错误码
	 */
	report: function(appid, rettype, delay, errcode) {
		if (!appid)
			return;
		if (isNaN(rettype) || rettype < 1)
			return;
		if (typeof delay == "undefined")
			return;
		var url = this.config.cgi;
		url += "?flag1=" + appid.toString() + "&flag2=" + rettype.toString() + "&1=" + x.retCode.config.sampling + "&2=" + delay;
		if (errcode) {
			url += "&flag3=" + errcode.toString();
		}
		x.report(url);
	}
};


/**
 * @class x.RetCode
 * @description 返回码监控对象
 * @param {Number} appid 返回码监控的appid
 */
x.RetCode = function(appid) {
	/**
	 * appid
	 */
	this.appid = appid;
	/**
	 * 计时器
	 * @ignore
	 */
	this.timer = {
		begin: 0,
		end: 0
	}
	/**
	 * 当前对象ID
	 */
	this.SNID = x.retCode.snid;
	/**
	 * 是否已经上报
	 */
	this.isReported = false;
	x.retCode.snid++;
}

x.RetCode.prototype = {
	/**
	 * 开始上报统计
	 */
	begin: function() {
		this.timer.begin = new Date().valueOf();
	},
	/**
	 * 上报结束
	 */
	end: function() {
		this.timer.end = this.timer.end || new Date().valueOf();
	},
	/**
	 * 上报
	 * @param {Number} rettype 上报类别，成功是1，失败是2
	 * @param {Number} retcode 返回码
	 */
	report: function(rettype, retcode) {
		if (this.isReported)
			return;
		this.end();
		var delay = this.timer.end - this.timer.begin;
		x.retCode.report(this.appid, rettype, delay, retcode);
		this.isReported = true;
	},
	/**
	 * 上报成功
	 */
	reportSuc: function() {
		this.report(x.retCode.TYPE.SUC);
	},
	/**
	 * 上报错误
	 * @param {Number} errcode 错误码
	 */
	reportErr: function(errcode) {
		errcode = errcode || x.retCode.commCode.error;
		this.report(x.retCode.TYPE.ERR, errcode);
	}
};