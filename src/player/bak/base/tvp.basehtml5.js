;
(function(x, $) {

	/**
	 * 播放器HTML5内核基类
	 * @class x.BaseHtml5
	 * @extends x.BasePlayer
	 */
	x.BaseHtml5 = function() {
		this.protectedFn = {},
		this.h5EvtAdapter = {},
		this.eventList = this.eventList.concat(["html5error"]),
		this.html5AttrList = {
			/**
			 * 自动播放
			 */
			"autoplay": "autoplay",
			/**
			 * 支持AirPlay
			 */
			"x-webkit-airplay": "isHtml5UseAirPlay"
		};
		this.$videomod = null;
	};

	x.BaseHtml5.fn = x.BaseHtml5.prototype = new x.BasePlayer();

	$.extend(x.BaseHtml5.fn, {
		/**
		 * 获取当前的video标签对象
		 * @override
		 * @public
		 */
		getPlayer: function() {
			return this.videoTag;
		},
		/**
		 * 获得当前播放器内核类别
		 * @return {type} 当前播放器内核类别
		 */
		getPlayerType: function() {
			return "html5";
		},
		/**
		 * 生成Video标签的HTML代码
		 * @public
		 */
		createVideoHtml: function() {
			this.playerid = this.config.playerid;
			if (!this.playerid) {
				this.playerid = "tenvideo_video_player_" + (x.BaseHtml5.maxId++);
			}
			var str = ['<video id="', this.playerid, '" width="100%" height="100%" '].join("");

			if (this.config.isHTML5UseUI) {
				//本身ios不允许div浮层罩在video标签上方，否则只能看到浮层但无法点击
				//在iPad上可以禁止control属性，这样就可以点击了。
				//但这招对iPhone无效，应该是iPhone播放特性使然
				//解决的方案是先把播放器移到屏幕外比如-200%的地方，播放的时候iphone会自动将视频全屏播放，默认特性
				if (($.os.iphone || $.os.ipod) && !! this.config.isIOSVideoOffset) {
					str += 'style="position:absolute;top:-200%"';
				}
			}

			for (var p in this.html5AttrList) {
				str += " ";
				var cfgKey = this.html5AttrList[p],
					cfgVal = "";
				if (cfgKey == "") {
					cfgVal = "";
				} else {
					if (!(cfgKey in this.config)) continue; //给的配置在全局配置项里根本就没有对应的属性值，鬼知道该输出啥，跳过
					cfgVal = this.config[cfgKey];
				}
				if (cfgVal === false || cfgVal == "disabled" || cfgVal === 0) continue;
				str += p;
				if (p == "autoplay" && cfgVal == true) {
					str += '="autoplay"'
					continue;
				};
				if (cfgVal != "") {
					str += ['=', cfgVal].join("");
				}

			}
			if (this.isUseControl) {
				str += " controls ";
			}
			var poster = this.curVideo.getPoster();
			if ($.isString(poster) && poster.length > 0 && $.inArray("posterlayer", this.config.html5VodUIFeature) == -1) {
				str += " poster='" + poster + "'";
			}
			str += "></video>";
			return str;
		},

		write: function(modId) {
			var el = null;
			if ($.type(modId) == "object" && modId.nodeType == 1) {
				el = modId;
				this.$mod = $(modId);
				this.modId = this.$mod.attr("id") || "";
			} else {
				el = x.$.getByID(modId);
				this.modId = modId, this.$mod = $("#" + modId);
			}
			if (!el) return;
			var htmlBuf = this.createVideoHtml(),
				videoModId = "mod_" + this.playerid;
			el.innerHTML = '<div id="' + videoModId + '">' + htmlBuf + '</div>';
			this.videomod = $.getByID(videoModId);
			this.$videomod = $(this.videomod);
			this.$videomod.width($.formatSize(this.config.width)).height($.formatSize(this.config.height));

			this.videoTag = $.getByID(this.playerid);
			this.$video = $(this.videoTag);

			this.registerMonitor();
			this.bindEventAdapt();
		},
		/**
		 * 重新设置播放器尺寸
		 * @param  {[type]} width  [description]
		 * @param  {[type]} height [description]
		 * @return {[type]}        [description]
		 */
		resize: function(width, height) {
			this.$videomod.width($.formatSize(width)).height($.formatSize(height));
		},
		/**
		 * 显示播放器播放出错
		 * @param  {Number} errcode 错误码
		 * @param  {Number} errcontent 错误码详细错误内容
		 * @param  {string} errMsg  错误描述
		 */
		showError: function(errcode, errcontent, errMsg) {

			var t = this;

			/*
				延迟不可去掉，因为页面刷新的时候由于网络传输会被各种abort导致错误
				如果不延迟会导致刷新的时候立即显示错误，体验不好，容易引起误解
			*/
			setTimeout(function() {
				
				var fn = t.getCBEvent("showError");
				if ($.isFunction(fn) && fn != t.showError) {
					fn.call(t, errcode, errcontent, errMsg);
				} else if ($.isFunction(t.config["showError"])) {
					t.config["showError"].call(t, errcode, errcontent, errMsg);
				} else {
					var str = x.html5skin.defaultError,
						tipsId = t.playerid + "_errtips_inner";
					errcontent = errcontent || "";
					str = str.replace("$ERROR-TIPS-INNER$", tipsId)
						.replace("$ERROR-MSG$", (errMsg || x.html5lang.getErrMsg(errcode, errcontent) || "播放视频出错"))
						.replace("$ERROR-DETAIL$", !! errcontent ? ("错误码:" + errcode + "(" + errcontent + ")") : "");
					var $videomod = $(t.videomod),
						$tips = $(str).appendTo($videomod).show();
					//$tips.css("width", t.config.modWidth).css("height", t.config.modHeight).show();
					$videomod.html("");
					$tips.appendTo($videomod);
				}
			}, 250);

			//相应onerror事件
			this.callCBEvent("onerror", errcode, errcontent);

		},
		/**
		 * 是否使用了自定义的HTML5播放器的某个特性
		 * @param  {type}    fName [description]
		 * @return {Boolean}       [description]
		 */
		isUseH5UIFeature: function(fName) {
			return $.inArray(fName, this.config.html5VodUIFeature) >= 0;
		},
		/**
		 * 是否禁止了自定义的HTML5播放器的某个特性
		 * @param  {[type]}  fName [description]
		 * @return {Boolean}       [description]
		 */
		isForbiddenH5UIFeature: function(fName) {
			return $.inArray(fName, this.config.html5ForbiddenUIFeature) >= 0;
		},
		/**
		 * 调用本地的保护方法
		 * @ignor
		 * @param  {type} fnName 调用本地的保护方法
		 * @return {type}        调用本地的保护方法
		 */
		callProtectFn: function(fnName) {
			if ($.isFunction(this.protectedFn[fnName])) {
				this.protectedFn[fnName].call(this);
			}
		},
		/**
		 * 注册数据上报监听
		 */
		registerMonitor: function() {
			if ($.isFunction(this["buildmonitor"])) {
				this["buildmonitor"].call(this);
			}
		},
		/**
		 * 绑定事件处理
		 */
		bindEventAdapt: function() {
			var evts = [
				"-empty",
				"-abort",
				"-loadstart",
				"-can-play",
				"-can-play-through",
				"-loaded-data",
				"-loaded-metadata",
				"-abort",
				"-error",
				"-pause",
				"-paused",
				"-waiting",
				"-stalled",
				"-suspend",
				"-play",
				"-volume-change",
				"-playing",
				"-seeked",
				"-seeking",
				"-duration-change",
				"-progress",
				"-rate-change",
				"-timeupdate",
				"-ended"
			];
			var t = this;
			$.each(evts, function(i, k) {
				var evtName = "on" + $.camelCase(k),
					fn = t.h5EvtAdapter[evtName];
				if (DEBUG || $.isFunction(fn)) {
					t.$video.on(k.replace(/-/g, ""), function(e) {
						// if (DEBUG) {
						// 	x.log(e.type);
						// 	if (e.type == "durationchange") {
						// 		x.log("duration = " + e.target.duration);
						// 	}
						// }
						var fn = t.h5EvtAdapter[evtName];
						$.isFunction(fn) && (fn.call(t, this, e));
						// $.isFunction(t[evtName]) && (t[evtName](e));
					});
				}
			});
		}
	});

	x.BaseHtml5.maxId = 0;

})(x, x.$);