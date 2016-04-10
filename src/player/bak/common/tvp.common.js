/**
 * @fileOverview 云播放器 定义x下的通用函数接口
 */

/*
 * @include "./x.define.js"
 * @include "./x.$.js"
 */

x = x || {};

/**
 * 封装通用函数
 *
 * @namespace x.common
 * @type {Object}
 */
x.common = {
	/**
	 * 是否使用HTML5播放器播放
	 */
	isUseHtml5: function() {
		var ua = navigator.userAgent,
			m = null;

		if (/ipad|ipod|iphone|lepad_hls|IEMobile/ig.test(ua)) {
			return true;
		}

		//Android系统
		if ( !! x.$.os.android) {

			// 如果支持HTML5的<video>标签并且支持H.264解码，则也认为支持HTML5
			if (x.common.isSupportMP4()) {
				return true;
			}

			//Android下 手机QQ浏览器4.2原生支持HTML5和HLS 对方接口人susiehuang
			if (x.$.browser.MQQ && x.$.browser.getNumVersion() >= 4.2) {
				return true;
			}
			if (ua.indexOf("MI-ONE") != -1 || ua.indexOf("MI2") != -1) { // 小米手机4.0支持HTML5
				return true;
			}

			//微信4.2版本以上原生支持html5
			if (x.$.os.version >= "4" && (m = ua.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/))) {
				if (m[1] >= 4.2) {
					return true;
				}
			}

			//安卓4.1基本都支持HTML5了，遇到特例就case by case解决吧
			if (x.$.os.version >= "4.1") {
				return true;
			}
		}
		return false;
	},
	/**
	 * 是否使用HLS
	 * @return {Boolean} [description]
	 */
	isUseHLS: function() {
		if (x.$.os.ios) return true;
	},
	/**
	 * 直播是否用HTML5
	 *
	 * @return {}
	 */
	isLiveUseHTML5: function() {
		if (x.$.os.ios) return true;
		if ( !! x.$.os.android) {
			if (x.$.browser.MQQ && x.$.browser.getNumVersion() >= 4.2) {
				return true;
			}
		}
		return false;
	},
	/**
	 * 是否支持HTML5的MP4解码
	 *
	 * @return {Boolean}
	 */
	isSupportMP4: function() {
		var video = document.createElement("video");
		if (typeof video.canPlayType == "function") {
			//MP4
			if (video.canPlayType('video/mp4; codecs="mp4v.20.8"') == "probably") {
				return true;
			}
			//H.264
			if (video.canPlayType('video/mp4; codecs="avc1.42E01E"') == "probably" || video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') == "probably") {
				return true;
			}
		}
		return false;
	},
	/**
	 * 当前设备是支持SVG
	 * @return {Boolean} [description]
	 */
	isSupportSVG: function() {
		if (!document.implementation || !x.$.isFunction(document.implementation.hasFeature)) {
			return false;
		}
		return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
	},

	/**
	 * 是否强制使用MP4直接链接
	 *
	 * @return {Boolean}
	 */
	isEnforceMP4: function() {
		var ua = navigator.userAgent,
			m = null;
		if ( !! x.$.os.android) {
			if (x.$.browser.firefox) {
				return true;
			}
			if (x.$.os.version >= "4.0" && x.$.browser.MQQ && x.$.browser.version < "4.0") { // 手机QQ浏览器3.*版本在Android4无法使用H5和flash
				return true;
			}
		}
		return false;
	},
	/**
	 * 获取当前用户的QQ号码
	 */
	getUin: function() {
		var skey = x.$.cookie.get("skey"),
			lskey = x.$.cookie.get("lskey"),
			suin = "",
			uin = 0,
			useLeak = false;
		isLeak = typeof(isLeak) == "undefined" ? false : true;
		useLeak = !! isLeak && lskey != "";

		if (!useLeak && skey == "") {
			return 0;
		}

		suin = x.$.cookie.get("uin");
		if (suin == "") {
			if ( !! useLeak) {
				suin = x.$.cookie.get("luin");
			}
		}
		uin = parseInt(suin.replace(/^o0*/g, ""), 10);
		if (isNaN(uin) || uin <= 10000) {
			return 0;
		}
		return uin;
	},
	/**
	 * 获取登录的skey
	 *
	 * @return {}
	 */
	getSKey: function() {
		var skey = x.$.cookie.get("skey"),
			lskey = x.$.cookie.get("lskey"),
			key = "";
		if ( !! isLeak) {
			if (skey != "" && lskey != "") {
				key = [skey, lskey].join(";");
			} else {
				key = skey || lskey;
			}
		} else {
			key = skey;
		}
		return key;
	},
	/**
	 * 打开登录框
	 */
	openLogin: function() {

	},
	/**
	 * 获取指定视频vid的截图
	 *
	 * @param {string}
	 *          lpszVID 视频vid
	 * @param {number}
	 *          idx 视频看点 默认是0
	 * @return {string} 视频截图
	 */
	getVideoSnap: function(lpszVID, idx) {
		var szPic;
		var uin;
		var hash_bucket = 10000 * 10000;
		var object = lpszVID;

		if (lpszVID.indexOf("_") > 0) {
			var arr = lpszVID.split("_");
			lpszVID = arr[0];
			idx = parseInt(arr[1]);
		}

		var uint_max = 0x00ffffffff + 1;
		var hash_bucket = 10000 * 10000;
		var tot = 0;
		for (var inx = 0; inx < lpszVID.length; inx++) {
			var nchar = lpszVID.charCodeAt(inx);
			tot = (tot * 32) + tot + nchar;
			if (tot >= uint_max) tot = tot % uint_max;
		}
		uin = tot % hash_bucket;
		if (idx == undefined) idx = 0;
		if (idx == 0) {
			szPic = ["http://vpic.video.qq.com/", uin, "/", lpszVID, "_160_90_3.jpg"].join("");
		} else {
			szPic = ["http://vpic.video.qq.com/", uin, "/", lpszVID, "_", "160_90_", idx, "_1.jpg"].join("");
		}
		return szPic;
	}
};

x.version = (function() {
	/** private */
	var vOcx = "0.0.0.0",
		vflash = "0.0.0",
		actObj;
	/**
	 * 将数字格式的控件的版本号转换成标准的带有.符号分隔的版本号
	 */

	function changeVerToString(nVer) {
		if (checkVerFormatValid(nVer)) {
			return nVer;
		}
		if (/\d+/i.test(nVer)) {
			var nMain = parseInt(nVer / 10000 / 100, 10);
			var nSub = parseInt(nVer / 10000, 10) - nMain * 100;
			var nReleaseNO = parseInt(nVer, 10) - (nMain * 100 * 10000 + nSub * 10000);
			strVer = nMain + "." + nSub + "." + nReleaseNO;
			return strVer;
		}
		return nVer;
	}

	/**
	 * 检查控件版本号是否合法
	 *
	 * @ignore
	 */

	function checkVerFormatValid(version) {
		return (/^(\d+\.){2}\d+(\.\d+)?$/.test(version));
	};


	return {
		/**
		 * 获取用户当前安装的播放器版本
		 * @return {String}
		 */
		getOcx: function(enableCache) {
			// 相当于有个变量做cache，不再重复判断了
			if (x.$.isUndefined(enableCache)) {
				enableCache = true;
			}
			if ( !! enableCache && vOcx != "0.0.0.0") {
				return vOcx;
			}

			// IE
			if ( !! x.$.browser.ie) {
				try {
					// 据说这个做成全局的可能减少错误概率
					actObj = new ActiveXObject(QQLive.config.PROGID_QQLIVE_INSTALLER);
					if (typeof actObj.getVersion != "undefined") {
						vOcx = actObj.GetVersionByClsid(QQLiveSetup.config.OCX_CLSID);
					}
				} catch (err) {}
			} else if (x.$.browser.isNotIESupport()) {
				var plugs = navigator.plugins,
					plug;
				if (!x.$.isUndefined(plugs.namedItem)) {
					plug = plugs.namedItem("");
				}
				if (!plug) {
					// 循环找出的plugins信息
					for (var i = 0, len = plugs.length; i < len; i++) {
						// 找到的plugin信息
						if (plugs[i] && plugs[i].name == "" || plugs[i].filename == "npQQLive.dll") {
							plug = plugs[i];
							break;
						}
					}
				}
				if ( !! plug) {
					// FF有version的属性（强烈顶下FF的这个接口）
					// 但是Chrome没有，只能从description中截取，这个描述信息是“version:”开头（跟lexlin约定好的）
					if (!x.$.isUndefined(plug.version)) {
						vOcx = plug.version;
					} else {
						var r;
						var desc = plug.description;
						if (r = desc.match(/version:((\d+\.){3}(\d+)?)/)) {
							vOcx = r[1];
						}
					}
				}
			}
			vOcx = changeVerToString(vOcx);
			return vOcx;
		},
		/**
		 * 获取当前用户安装的flash插件版本号
		 *
		 *
		 */
		getFlash: function() {
			if (vflash != "0.0.0") {
				return vflash;
			}
			var swf = null,
				ab = null,
				ag = [],
				S = "Shockwave Flash",
				t = navigator,
				q = "application/x-shockwave-flash",
				R = "SWFObjectExprInst"
			if ( !! x.$.browser.ie) {
				try {
					swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					if (swf) {
						ab = swf.GetVariable("$version");
						if (ab) {
							ab = ab.split(" ")[1].split(",");
							ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
						}
					}
				} catch (exp) {}
			} else if (!x.$.isUndefined(t.plugins) && typeof t.plugins[S] == "object") {
				ab = t.plugins[S].description;
				if (ab && !(!x.$.isUndefined(t.mimeTypes) && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
					ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
					ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
					ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
					ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
				}
			}
			vflash = ag.join(".");
			return vflash;
		},
		/**
		 * 获取flash主版本号
		 *
		 * @return {Number}
		 */
		getFlashMain: function() {
			return parseInt(x.version.getFlash().split(".")[0], 10);
		}
	}
})();