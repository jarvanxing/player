/**
 * @fileOverview 云播放器 引入jquery
 */

/*
 * @include "./x.define.js"
 * @include "../../extend/zepto.js"
 */

/**
 * 定义辅助函数
 *
 * @namespace x.$
 *
 */
;
var _isUseInnerZepto = false;
if (typeof Zepto != "undefined" && !! Zepto._x) {
	x.$ = Zepto;
	_isUseInnerZepto = true;
} else {
	x.$ = {};
	_isUseInnerZepto = false;
}

;
(function() {
	if (!_isUseInnerZepto) {
		if (typeof window["Zepto"] === "function") {
			x.$ = window["Zepto"];
			return;
		}
	}

	if (typeof window["jQuery"] === "function" && typeof window["jQuery"].Deferred === "function") {
		x.$ = window["jQuery"];
		return;
	}

	if (typeof window["jq"] === "function") {
		x.$ = window["jq"];
	}

})();

//fix some broswer has no document.DOCUMENT_NODE attribute
;
(function() {
	if (typeof document.DOCUMENT_NODE == "undefined") {
		document.DOCUMENT_NODE = 9;
	}
})()

/**
 * 扩展浏览器和操作系统判断
 */
;
(function($) {
	function detect(ua) {

		var MQQBrowser = ua.match(/MQQBrowser\/(\d+\.\d+)/i),
			MQQClient = ua.match(/QQ\/(\d+\.(\d+)\.(\d+)\.(\d+))/i),
			WeChat = ua.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/) || ua.match(/MicroMessenger\/((\d+)\.(\d+))/),
			MacOS = ua.match(/Mac\sOS\sX\s(\d+\.\d+)/),
			WinOS = ua.match(/Windows(\s+\w+)?\s+?(\d+\.\d+)/),
			MiuiBrowser = ua.match(/MiuiBrowser\/(\d+\.\d+)/i),
			UC = ua.match(/UCBrowser\/(\d+\.\d+(\.\d+\.\d+)?)/) || ua.match(/\sUC\s/),
			IEMobile = ua.match(/IEMobile(\/|\s+)(\d+\.\d+)/),
			ipod = ua.match(/(ipod\sOS)\s([\d_]+)/),
			HTC = ua.indexOf("HTC") > -1;

		$.browser = $.browser || {}, $.os = $.os || {};
		// 扩展ie判断
		if (window.ActiveXObject) {
			var vie = 6;
			(window.XMLHttpRequest || (ua.indexOf('MSIE 7.0') > -1)) && (vie = 7);
			(window.XDomainRequest || (ua.indexOf('Trident/4.0') > -1)) && (vie = 8);
			(ua.indexOf('Trident/5.0') > -1) && (vie = 9);
			(ua.indexOf('Trident/6.0') > -1) && (vie = 10);
			$.browser.ie = true, $.browser.version = vie;
		} else if (ua.indexOf('Trident/7.0') > -1) {
			$.browser.ie = true, $.browser.version = 11;
		}

		if (ipod) os.ios = os.ipod = true, os.version = ipod[2].replace(/_/g, '.');
		//windows 系统
		if (WinOS) this.os.windows = true, this.os.version = WinOS[2];
		//Mac系统
		if (MacOS) this.os.Mac = true, this.os.version = MacOS[1];
		//乐Pad
		if (ua.indexOf("lepad_hls") > 0) this.os.LePad = true;

		//补充一些国内主流的手机浏览器
		//手机QQ浏览器
		if (MQQBrowser) this.browser.MQQ = true, this.browser.version = MQQBrowser[1];
		//IOS手机QQ打开
		if (MQQClient) this.browser.MQQClient = true, this.browser.version = MQQClient[1];
		//微信
		if (WeChat) this.browser.WeChat = true, this.browser.version = WeChat[1];
		//MIUI自带浏览器
		if (MiuiBrowser) this.browser.MIUI = true, this.browser.version = MiuiBrowser[1];
		//UC浏览器
		if (UC) this.browser.UC = true, this.browser.version = UC[1] || NaN;
		//IEMobile
		if (IEMobile) this.browser.IEMobile = true, this.browser.version = IEMobile[2];

		if (this.os.windows) {
			if (typeof navigator.platform != "undefined" && navigator.platform.toLowerCase() == "win64") {
				this.os.win64 = true;
			} else {
				this.os.win64 = false;
			}
		}

		var osType = {
			iPad7: 'iPad; CPU OS 7',
			LePad: 'lepad_hls',
			XiaoMi: 'MI-ONE',
			SonyDTV: "SonyDTV",
			SamSung: 'SAMSUNG',
			HTC: 'HTC',
			VIVO: 'vivo'
		}

		for (var os in osType) {
			this.os[os] = (ua.indexOf(osType[os]) !== -1);
		}

		this.os.getNumVersion = function() {
			return parseFloat($.os.version, "10");
		}

		//当前系统是否支持触屏触摸,ios5以下的版本touch支持有问题，当作不支持来处理
		this.os.hasTouch = 'ontouchstart' in window;
		if (this.os.hasTouch && this.os.ios && this.os.getNumVersion() < 6) {
			this.os.hasTouch = false;
		}

		//微信4.5 tap事件有问题
		if ($.browser.WeChat && $.browser.version < 5.0) {
			this.os.hasTouch = false;
		}

		$.extend($.browser, {
			/**
			 * 获取数字格式的版本号
			 */
			getNumVersion: function() {
				return parseFloat($.browser.version, "10");
			},
			/**
			 * 是否是受支持的firefox版本
			 *
			 * @memberOf QQLive.browser
			 * @return {Boolean}
			 */
			isFFCanOcx: function() {
				if ( !! $.browser.firefox && $.browser.getNumVersion() >= 3.0) {
					return true;
				}
				return false;
			},
			/**
			 * 当前浏览器是否支持QQLive
			 */
			isCanOcx: function() {
				return ( !! $.os.windows && ( !! $.browser.ie || $.browser.isFFCanOcx() || !! $.browser.webkit));
			},
			/**
			 * 是否是支持的非IE浏览器
			 */
			isNotIESupport: function() {
				return ( !! $.os.windows && ( !! $.browser.webkit || $.browser.isFFCanOcx()));
			}
		});

		// 兼容老的userAgent接口
		$.userAgent = {};
		$.extend($.userAgent, $.os);
		$.extend($.userAgent, $.browser);
		$.userAgent.browserVersion = $.browser.version;
		$.userAgent.osVersion = $.os.version;
		delete $.userAgent.version;

	}
	detect.call($, navigator.userAgent);
})(x.$);

/**
 * 扩展静态基本函数
 */
;
(function($) {
	var extFun = {
		/**
		 * 单独根据id获取dom元素
		 */
		getByID: function(id) {
			return document.getElementById(id);
		},
		/**
		 * 空函数
		 *
		 * @lends x.$
		 */
		noop: function() {},
		/**
		 * 是否是字符串
		 *
		 * @lends x.$
		 */
		isString: function(val) {
			return $.type(val) === "string";
		},
		/**
		 * 是否未定义
		 *
		 * @lends x.$
		 */
		isUndefined: function(val) {
			return $.type(val) === "undefined";
		},
		/**
		 * 获取当前毫秒
		 *
		 * @lends x.$
		 * @return {Number}
		 */
		now: function() {
			return new Date().getTime();
		},

		/**
		 * 获取标准日期格式的时间
		 */
		getISOTimeFormat: function() {
			var date = new Date(),
				y = date.getFullYear(),
				m = date.getMonth() + 1,
				d = date.getDate(), // 
				h = date.getHours(),
				M = date.getMinutes(),
				s = date.getSeconds();
			return [[y, m < 10 ? "0" + m : m, d < 10 ? "0" + d : d].join("-"), [h < 10 ? "0" + h : h, M < 10 ? "0" + M : M, s < 10 ? "0" + s : s].join(":")].join(" ");
		},
		/**
		 * 格式化秒
		 */
		formatSeconds: function(seconds) {
			seconds = parseInt(seconds);
			var M = parseInt(seconds / 60),
				h = M >= 60 ? parseInt(M / 60) : 0,
				s = seconds % 60,
				str = "";
			M >= 60 && (M = M % 60);
			if (h > 0) {
				str += h < 10 ? "0" + h : h;
				str += ":";
			}
			str += M < 10 ? "0" + M : M;
			str += ":"
			str += s < 10 ? "0" + s : s;
			return str;
		},
		/**
		 * 获取当前域名真实的host
		 */
		getHost: function() {
			var _host = window.location.hostname || window.location.host,
				_sarray = location.host.split(".");
			if (_sarray.length > 1) {
				_host = _sarray.slice(_sarray.length - 2).join(".");
			}
			return _host;
		},
		/**
		 * 从URL中获取指定的参数值
		 *
		 * @memberOf Live
		 * @param {String}
		 *          p url参数
		 * @param {String}
		 *          u url 默认为当前url，可为空，如果传入该变量，将从该变量中查找参数p
		 * @return {String} 返回的参数值
		 */
		getUrlParam: function(p, u) {
			u = u || document.location.toString();
			var reg = new RegExp("(^|&|\\\\?)" + p + "=([^&]*)(&|$|#)"),
				r = null;
			if (r = u.match(reg)) return r[2];
			return "";
		},
		/**
		 * 过滤XSS
		 *
		 * @param {string}
		 *          str
		 * @return {}
		 */
		filterXSS: function(str) {
			if (!$.isString(str)) return str;
			return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;");
		},
		/**
		 * 创建GUID字符串
		 *
		 * @return {}
		 */
		createGUID: function(len) {
			len = len || 32;
			var guid = "";
			for (var i = 1; i <= len; i++) {
				var n = Math.floor(Math.random() * 16.0).toString(16);
				guid += n;
			}
			return guid;
		},
		/**
		 * 格式化尺寸
		 * @param  {type} size [description]
		 * @return {type}      [description]
		 */
		formatSize: function(size) {
			var s = "" + size;
			if (s.indexOf("%") > 0) return s;
			if (s.indexOf("px") > 0) return s;

			if (/^\d+$/.test(s)) return s + "px";
			return s;
		},
		/**
		 * 判断参数是否是true，诸如//1 ,true ,'true'
		 * @param  {[type]}  v [description]
		 * @return {Boolean}   [description]
		 */
		isTrue: function(v) {
			return eval(x.$.filterXSS(v)); // 0 ,1 ,true ,false,'true','false'..
		},
		/**
		 * 根据插件name载入插件对应CSS文件
		 * @return {[type]} [description]
		 */
		loadPluginCss: function(name) {
			var url = "",
				urlArray = x.defaultConfig.pluginCssUrl;
			if (name in urlArray) {
				url = x.defaultConfig.cssPath + urlArray[name];
			}
			return $.loadCss(url);

		},
		/**
		 * 载入CSS文件
		 * @return {[type]} [description]
		 */
		loadCss: function(url) {
			var defer = $.Deferred();
			var isDone = false;
			if ( !! url) {
				//禁止回溯路径
				//例如:http://imgcache.gtimg.cn/tencentvideo_v1/mobile/v2/style/../../../../qzone/css/play.css
				//将指向到http://imgcache.gtimg.cn/qzone/css/play.css
				while (url.indexOf("../") >= 0) {
					url = url.replace("../", "");
				}
				url = $.filterXSS(url);
				var doc = document;
				var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
				var baseElement = head.getElementsByTagName("base")[0];
				var node = doc.createElement("link");
				node.rel = "stylesheet";
				node.href = url;

				node.onload = node.onerror = function() {
					node.onload = node.onerror = null;
					isDone = true;
					defer.resolve();
				}
				if ($.browser.WeChat || $.browser.MQQClient) {
					//onload和onerror不一定触发
					setTimeout(function() {
						if (!isDone) {
							defer.resolve();
						}
					}, 2000);
				}

				baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
			} else {
				defer.reject();
			}
			return defer;
		}
	}
	$.extend($, extFun);
})(x.$);

/**
 * 扩展cookies
 */
;
(function($) {
	/**
	 * @leads x.$
	 * @name x.$.cookie
	 * @type {Object}
	 */
	$.cookie = {
		/**
		 * 设置一个cookie
		 * @param {String}
		 *          name cookie名称
		 * @param {String}
		 *          value cookie值
		 * @param {String}
		 *          domain 所在域名 默认为window.location.host的值
		 * @param {String}
		 *          path 所在路径 默认为是"\"
		 * @param {Number}
		 *          hour 存活时间，单位:小时
		 * @return {Boolean} 是否成功
		 */
		set: function(name, value, domain, path, hour) {
			if (hour) {
				var today = new Date();
				var expire = new Date();
				expire.setTime(today.getTime() + 3600000 * hour);
			}
			document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + window.location.host + ";"));
			return true;
		},

		/**
		 * 获取指定名称的cookie值
		 *
		 * @param {String}
		 *          name cookie名称
		 * @return {String} 获取到的cookie值
		 */
		get: function(name) {
			var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
			var m = document.cookie.match(r);
			return (!m ? "" : m[1]);
		},

		/**
		 * 删除指定cookie,复写为过期
		 *
		 * @param {String}
		 *          name cookie名称
		 * @param {String}
		 *          domain 所在域 默认为 window.location.host的值
		 * @param {String}
		 *          path 所在路径 默认为是"\"
		 */
		del: function(name, domain, path) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			document.cookie = name + "=; expires=" + exp.toGMTString() + ";" + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + window.location.host + ";"));
		}
	}
})(x.$)