/**
 * @fileOverview 云播放器 播放器接口
 *
 */

/**
 *      一句话概括统一播放器2.0：
 *
 *   高端大气上档次，低调奢华有内涵
 *   奔放洋气有深度，简约时尚国际范
 *
 */

;
(function(x, $) {

	/**
	 * 上报播放器加载时的几个关键步骤，用于成功率统计
	 * @param  {number} step      步骤id
	 * @param  {string} sessionId 回话id
	 * @param  {object} extdata   扩展数据
	 */
	function reportInitStep(step, sessionId, extdata) {
		var d = {
			cmd: 3515,
			val: step,
			ver: x.ver.replace(/\$/g, ""),
			str4: navigator.userAgent,
			url: window != top ? document.referrer : document.location.href,
			str1: sessionId,
			str2: x.filename || "unknown"
		};
		if ($.type(extdata) == "object") {
			$.extend(d, extdata);
		}
		x.report(d);
	}

	/**
	 * 创建播放器
	 * @param  {[type]} config [description]
	 * @return {[type]}        [description]
	 */
	var create = function(config) {
		var defer = $.Deferred(),
			$self = this,
			cfg = {},
			liveDefer = {}, // 注意 ，这里是个对象，因为每个频道都要重新判断当前平台的播放情况
			playerClass = "FlashPlayer",
			errMsg = ["未指明播放器内核", "您当前使用的统一播放器JS文件不包含指定的播放器内核", "video未初始化"],
			playerArray = ["FlashPlayer", "FlashLivePlayer", "MP4Link", "OcxPlayer"],
			playerArrayUI = ["Html5Player", "Html5Live"],
			playerArrayTiny = ["Html5Tiny", "Html5LiveTiny"];

		playerArray = playerArray.concat(playerArrayUI);
		playerArray = playerArray.concat(playerArrayTiny);
	
		$.extend(cfg, config);

		//兼容之前一个bug
		if (!$.isUndefined(config.isHTML5UseUI)) {
			cfg.isHtml5UseUI = config.isHTML5UseUI;
		}

		if (!config.video instanceof x.VideoInfo) {
			throw new Error(errMsg[2]);
			return;
		}

		function checkVodPlayer() {
			var vodDefer = $.Deferred();
			switch (cfg.playerType) {
				case "flash":
					{
						playerClass = "FlashPlayer";
						break;
					}
				case "html5":
					{
						useWhichVodHtml5();
						break;
					}
				case "ocx":
					{
						playerClass = "OcxPlayer";
						break;
					}
				case "mp4":
					{
						playerClass = "MP4Link";
						break;
					}
				default:
					{
						useDefaultVodPlayer();
						break;
					}
			}
			vodDefer.resolve();
			return vodDefer;
		}

		function useDefaultVodPlayer() {
			if (x.common.isEnforceMP4()) { // 有些浏览器强制走MP4
				playerClass = "MP4Link";
				return;
			}

			if (x.common.isUseHtml5()) { // 能用HTML5的就用HTML5
				useWhichVodHtml5();
			} else if ($.os.android && $.os.getNumVersion() >= 4) { // Android4.0+的系统还不支持HTML5，搞毛啊，直接走MP4Link方式吧
				playerClass = "MP4Link";
			} else {
				playerClass = "FlashPlayer";
			}
		}

		function checkLivePlayer(video) {
			if ( !! video.getChannelId()) {
				var cnlid = video.getChannelId();

				if ($.type(liveDefer[cnlid]) == "object" && $.isFunction(liveDefer[cnlid].done)) {
					return liveDefer[cnlid];
				}

				liveDefer[cnlid] = $.Deferred();

				var checker = new x.livehub.FlashChecker(),
					isSuc = !! 1;
				checker.cnlId = video.getChannelId();
				checker.extParam = video.getChannelExtParam();

				// 拿到了真实的频道id
				checker.onGetCnlId = function(cnlid, isLookBack) {
					video.setChannelId(cnlid);
					video.setIsLookBack( !! isLookBack);
				}
				// 可以使用flash播放
				checker.onCanFlash = function(cnlid) {
					playerClass = "FlashLivePlayer";
				}
				// 用HTML5播放
				checker.onCanHTML5 = function() {
					useWhichLiveHtml5();
				}
				// 只能用控件
				checker.onCanOCX = function() {
					playerClass = "OcxPlayer";
				}
				// 获取ajax错误
				checker.onError = function(errcode) {
					useDefaultLivePlayer();
					isSuc = false;
				}

				checker.onComplete = function() {
					useConfigLivePlayer();
					if (isSuc) liveDefer[cnlid].resolve();
					else liveDefer[cnlid].reject();
				}
				// 发送请求
				checker.send();
				return liveDefer[cnlid]
			}
		}

		create.checkLivePlayer = checkLivePlayer;

		function useDefaultLivePlayer() {
			if (x.common.isLiveUseHTML5()) {
				useWhichLiveHtml5();
			} else if ( !! $.os.android) {
				playerClass = "FlashLivePlayer";
			} else {
				playerClass = "OcxPlayer";
			}
		}

		function useConfigLivePlayer() {
			switch (cfg.playerType) {
				case "flash":
					{
						playerClass = "FlashLive";
						break;
					}
				case "html5":
					{
						useWhichLiveHtml5();
						break;
					}
				case "flashLive":
					{
						playerClass = "FlashLivePlayer";
						break;
					}
				case "ocx":
					{
						playerClass = "OcxPlayer";
						break;
					}
			}
		}

		function useWhichVodHtml5() {
			if (cfg.isHtml5UseUI) {
				playerClass = "Html5Player";
			} else {
				playerClass = "Html5Tiny";
			}
		}

		function useWhichLiveHtml5() {
			if (cfg.isHtml5UseUI) {
				playerClass = "Html5Live";
			} else {
				playerClass = "Html5LiveTiny";
			}
		}

		function _invoke() {
			var timer = null,
				isinvoke = false;

			function __invoke() {
				if ( !! isinvoke) return;
				isinvoke = true;

				var t = new x[playerClass]();
				t.init(config);
				defer.resolve(t, playerClass);
			}
			var classIdx = $.inArray(playerClass, playerArrayUI);
			if (classIdx > -1 && $.isString(config.HTML5CSSName) && config.HTML5CSSName.length > 0) {
				timer = setTimeout(function() {
					playerClass = playerArrayTiny[classIdx];
					__invoke();
				}, 5e3);
				$.loadCss(cfg.cssPath + config.HTML5CSSName).done(function() {
					clearTimeout(timer);
					timer = null;
					__invoke();
				});
			} else {
				__invoke();
			}
		}

		$.when(config.type == x.PLAYER_DEFINE.VOD ? checkVodPlayer() : checkLivePlayer(config.video)).then(function() {
			if (!playerClass) {
				throw new Error(errMsg[0]);
				return;
			}

			if ($.inArray(playerClass, playerArray) < 0) {
				throw new Error(errMsg[1]);
				return;
			}
			if (typeof x[playerClass] !== "function") {
				var jsurl = FILEPATH;
				var jsfile = playerClass.toLowerCase();
				if (playerClass == "OcxPlayer" && typeof QQLive != "undefined" && typeof QQLive.DEFINE != "undefined") {
					jsfile = "ocxplayerlite";
				}
				var url = jsurl + "module/" + jsfile + ".js?max_age=86400&v=20140123"
				var retcode = new x.RetCode(100123);
				retcode.begin();
				$.getScript(url, function() {
					if (typeof x[playerClass] !== "function") { //加载失败
						retcode.reportErr(11);
						throw new Error(errMsg[1]);
						return;
					}
					retcode.reportSuc();
					_invoke.call($self);
				});
			} else {
				_invoke.call($self);
			}
		});

		return defer;
	};

	/**
	 * 老addparam接口的参数映射
	 * @type {Object}
	 */
	var oldParamMap = {
		"player": "playerType",
		"showcfg": ["isVodFlashShowCfg", "isLiveFlashShowCfg"],
		"searchbar": ["isVodFlashShowSearchBar"],
		"showend": ["isVodFlashShowEnd"],
		"tpid": ["typeId"],
		"cid": ["coverId"],
		"flashshownext": ["isVodFlashShowNextBtn"],
		"loadingswf": "loadingswf",
		"wmode": "flashWmode",
		"flashskin": ["vodFlashSkin"],
		"extvars": ["vodFlashExtVars"],
		"swftype": ["vodFlashType"],
		"swfurl": ["vodFlashUrl", "liveFlashUrl"]
	};

	/**
	 * 统一播放器对象
	 *
	 * @class x.Player
	 * @param {number} vWidth 播放器宽度 单位像k素
	 * @param {number} vHeight 播放器高度 单位像素
	 *
	 */
	x.Player = function(vWidth, vHeight) {
		this.sessionId = $.createGUID();
		reportInitStep(1, this.sessionId);
		this.instance = null, this.config = {}, this._oldcfg = {};
		$.extend(this.config, x.defaultConfig);
		this.setting("width", vWidth);
		this.setting("height", vHeight);
	};
	x.Player.fn = x.Player.prototype = new x.BasePlayer();

	$.extend(x.Player.fn, {
		/**
		 * 独立设置配置信息
		 * @param  {[type]} k [description]
		 * @param  {[type]} v [description]
		 * @return {[type]}   [description]
		 */
		setting: function(k, v) {
			this.config[k] = v;
		},

		/**
		 * 输出播放器
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		output: function(id) {
			this.setting("modId", id);
			this.create(this.config);
		},

		/**
		 * 创建播放器
		 * @param  {Object} config 配置文件
		 */
		create: function(config) {
			var t = this;
			$.extend(t.config, config);

			reportInitStep(2, this.sessionId);

			create(t.config).done(function(f, playerClass) { //这个done用来放一些播放器创建的逻辑
				try {
					reportInitStep(3, t.sessionId, {
						vid: f.curVideo.getFullVid(),
						str3: f.getPlayerType()
					});
				} catch (err) {};
				//instance指向真实的new出来的播放器内核对象
				t.instance = f;
				//instance的instance又是外部的new出来的x.Player对象，也就是说你可以不断的.instance反复得到内核和外壳
				t.instance.instance = t;
				for (var p in t.instance) {
					if (p == "instance") continue; //instance是很重要的对象，不能透传
					if (p.substr(0, 2) == "on" && $.isFunction(t[p]) && t[p] != x.$.noop) continue;
					t[p] = t.instance[p];
				}
				//init完毕会自动调用write，所以这里针对各种播放器统一执行onwrite事件
				//如果提到各个播放器的write函数里分别执行onwrite，可能会导致因为没有执行到上面几行代码
				//引起最外层new出来的player对象没有内部播放器的接口
				f.callCBEvent("onwrite");

				//直播的话每次切换视频的都需要从服务端获取id映射以及设备支持情况
				if (t.config.type == x.PLAYER_DEFINE.LIVE) {
					t.play = function(v) {
						if ($.isString(v)) {
							t.config.video.setChannelId(v);
							v = t.config.video;
						} else if (v instanceof x.VideoInfo) {
							$.when(create.checkLivePlayer(v)).then(function() {
								if (t.instance instanceof x[playerClass]) {
									t.instance.play(v);
								} else {
									config.video = v;
									create(config);
								}
							});
						}
					}
				}
				x.Player.instance[t.playerid] = t;
			}).always(function() { //这里专门放置一些执行插件运行的,使用always，不管是否正常显示播放器都执行插件
				function invoke(k, cfg) {
					try {
						var evtName = "build" + k;
						if ($.isFunction(t[evtName])) {
							t[evtName].call(t, cfg);
							return true;
						} else {
							return false;
						}
					} catch (err) {}
				}

				// $.each(["LoadAnalyse"], function(i, v) {
				// 	invoke(v);
				// });

				$.each(t.config.plugins, function(k, v) {
					if ( !! v && k in t.config.pluginUrl) {
						var _cfg = $.isPlainObject(v) ? v : {};
						if (!invoke(k, _cfg)) {
							var url = t.config.libpath + t.config.pluginUrl[k];
							if ($.isString(url) && $.trim(url) != "") {
								$.getScript(url, function() {
									invoke(k, _cfg);
								})
							}
						}
					}
				});

				//当前页面使用了jQuery，并引用了包含zepto库的播放器，就发个警告提示可以用更轻量的版本
				if (window.console && typeof $.isFunction(console.warn) && _isUseInnerZepto) {
					var libArr = {
						"jQuery": "jq",
						"Zepto": "zepto",
						"jq": "jqmobi"
					};
					for (var p in libArr) {
						if (typeof window[p] === "function") {
							if (p === 'jQuery' && typeof jQuery.Deferred != "function") break;
							console.warn("\n" + x.name + "提示：\n您当前页面使用了" + p + "\n建议您引用" + x.name + " for " + p + "专用版，更轻更快更精简\nJS地址:" + FILEPATH + "x.player_v2_" + libArr[p] + ".js\n\n");
						}
					}
				}

			});
		},

		//==============================兼容老接口 start============================
		/**
		 * 设置参数
		 * @deprecated
		 * @param {string} k key
		 * @param {string} v value
		 */
		addParam: function(k, v) {
			if (k == "config" && $.type(v) == "object") {
				$.extend(this.config, v);
			} else {
				this._oldcfg[k] = v;
			}
		},
		/**
		 * 设置当前视频播放对象
		 * @deprecated
		 * @param  {x.VideoInfo} v x.VideoInfo的对象实例
		 */
		setCurVideo: function(v) {
			this.config["video"] = v;
		},

		/**
		 * 输出播放器
		 * @deprecated
		 * @param  {String} id Dom元素ID
		 */
		write: function(id) {
			this.config.modId = id;

			var type = this._oldcfg["type"] == 1 ? 1 : 2,
				t = this;

			$.each(this._oldcfg, function(k, v) {
				if (k in oldParamMap) {
					if ($.isArray(oldParamMap[k])) {
						if (type == 2) { //点播
							t.config[oldParamMap[k][0]] = v;
						} else if (type == 1 && oldParamMap[k].length >= 2) {
							t.config[oldParamMap[k][1]] = v;
						}
					} else if ($.isString(oldParamMap[k])) {
						t.config[oldParamMap[k]] = v;
					}
				} else if (k in x.defaultConfig) {
					t.config[k] = v;
				}
			});
			delete this._oldcfg;
			this.create(this.config);
		}

		//==============================兼容老接口 end============================

	});

	//extend create to x namespace
	x.create = create;

})(x, x.$);

x.Player.instance = {};