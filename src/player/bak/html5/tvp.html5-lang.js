/**
 * @fileoverview 播放器H5内核 语言包
 */


;
(function(x, $) {
	/**
	 * 播放器H5内核语言包
	 * @type {Object}
	 */
	x.html5lang = {
		/**
		 * 错误码定义
		 * @type {Object}
		 */
		errMsg: {
			"default": "视频暂时不提供播放",
			"0": "当前视频文件无法播放", //触发video.onerror事件
			//以下都是ajax读取CGI从服务器返回的错误
			"64": "校验视频付费信息失败，请刷新页面重试",
			"80": "根据您当前的IP地址，该地区暂不提供播放",
			"83": {
				"main": "视频付费限制",
				"-2": "您可能未登录或登录超时",
				"-1": "视频状态非法"
			},
			"500": {
				"main": "获取服务器数据失败",
				"1": "getinfo failed",
				"2": "getkey failed"
			}
		},
		/**
		 * 根据指定的错误码，返回错误描述
		 * @param  {Number} errCode 指定的错误码
		 * @return {String}         错误描述
		 */
		getErrMsg: function(errCode, errContent) {
			if (isNaN(errCode)) return "";
			if (errCode in x.html5lang.errMsg) {
				var val = x.html5lang.errMsg[errCode];
				if ($.isString(val)) return val;
				if ($.isPlainObject(val)) {
					return [val["main"], errContent in val ? ("," + val[errContent]) : ""].join("");
				}
			}
			return x.html5lang.errMsg["default"];
		},
		/**
		 * 清晰度文案定义
		 * @type {Object}
		 */
		definition: {
			"mp4": "高清",
			"msd": "流畅"
		},

		/**
		 * 字幕描述
		 * @type {Object}
		 */
		srtLang: {
			"50001": {
				"srclang": "zh-cn",
				"desc": "简体中文"
			},
			"50002": {
				"srclang": "zh-cn",
				"desc": "简体中文"
			},
			"50003": {
				"srclang": "zh-tw",
				"desc": "繁体中文"
			},
			"50004": {
				"srclang": "en",
				"desc": "英文"
			},
			"50005": {
				"srclang": "zh-cn,en",
				"desc": "简体中文&英文"
			},
			"50006": {
				"srclang": "zh-tw,en",
				"desc": "繁体中文&英文"
			}
		},
		/**
		 * 获取清晰度的名称
		 * @param  {String} key format英文名，对应getinfo的fmt参数
		 * @return {type}    清晰度名称
		 */
		getDefiName: function(key) {
			return key in x.html5lang.definition ? x.html5lang.definition[key] : "";
		},
		/**
		 * 根据字幕id描述获取字幕描述
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		getSrtName: function(id) {
			return (id in x.html5lang.srtLang) ? x.html5lang.srtLang[id].desc : "";
		}
	}

})(x, x.$);