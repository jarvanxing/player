/**
 * @fileOverview 云播放器 HTML5播放器
 *
 */

/*
 * @include "../x.define.js"
 * @include "../../extend/zepto.js"
 * @include "../x.common.js"
 * @include "../x.baseplayer.js"
 */

;
(function(x, $) {

	var _isInited = false,
		curVid = "",
		pauseCheckTimer = null,
		isAdrPlayTrack = false,
		_adfirsttu = false;

	/**
	 * 判断当前设备是否需要不断的去调用load和play去重试播放
	 * @return {Boolean} [description]
	 */
	function isNeedAdrTrick() {
		return $.os.android && !isAdrPlayTrack && !$.os.HTC && !$.os.VIVO;
	}

	/**
	 * 不断重试调用load和play，因为有些安卓设备会卡在某个网络状态
	 * @param  {[type]} video [description]
	 * @return {[type]}       [description]
	 */
	function adrInvalidPauseCheck(video) {
		var currt = video.currentTime;
		var cnt = 0;
		var flag = false;
		var cbTimer = null;

		isAdrPlayTrack = true;

		video.pause();
		video.play();

		video.addEventListener("playing", function() {
			clearTimeout(cbTimer);
			cbTimer = setTimeout(cb, 320); //currentTime响应时间在300毫秒
		}, false);

		var cb = function() {
			x.debug("cb");
			if (video.currentTime == currt && !flag) {
				cnt++;
				video.play();
				if (cnt % 10 == 0 && video.currentTime == currt) { //为什么需要再判断一次，因为可能上面play了以后已经可以正常播放了
					video.load();
					video.play();
				}
				cbTimer = setTimeout(cb, 1000);
			} else {
				flag = true;
			}
		}
		cbTimer = setTimeout(cb, 1000);
	};

	/**
	 * @class x.Html5TinyPlayer
	 * @param {number}
	 *          vWidth 宽度，单位像素
	 * @param {number}
	 *          vHeight 高度，单位像素
	 * @extends x.BasePlayer
	 */
	function Html5TinyPlayer(vWidth, vHeight) {
		var h5EvtAdapter = {};
		$me = this;
		this.videoTag = null, // <video>标签对象
		this.$video = null, // 播放器 $对象
		this.config.width = x.$.filterXSS(vWidth),
		this.config.height = x.$.filterXSS(vHeight),
		this.protectedFn = {},
		this.isUseControl = true,

		$.extend(this.h5EvtAdapter, {
			"onEnded": function() {
				this.$video.trigger("x:player:ended");
				this.callCBEvent("onended", curVid);
				var nextVid = "",
					vidArr = this.curVideo.getVidList().split("|"),
					vidIndexOf = $.inArray(curVid, vidArr);
				if (vidIndexOf < vidArr.length - 1) {
					nextVid = vidArr[vidIndexOf + 1];
				}
				if (nextVid != "") { //同时传入了多个视频id，那么就一个一个播放
					this.play(nextVid);
					return;
				}
				this.callCBEvent("onallended");
				this.$video.trigger("x:player:allended"); //触发自定义的全部播放完毕事件

				if (this.config.isHtml5ShowPosterOnEnd) {
					this.setPoster();
				}

				var nextVideoInfo = this.callCBEvent("ongetnext", curVid, this.curVideo);
				if ( !! nextVideoInfo && nextVideoInfo instanceof x.VideoInfo) {
					this.play(nextVideoInfo);
				}
			},
			"onError": function(ts, e) {
				if (e.target.currentSrc.indexOf(".m3u8") > 0 /* && this.config.isHtml5UseHLS === "auto"*/ ) {
					x.debug("play hls error,reload play mp4...");
					x.report({
						cmd: 3525,
						vid: this.curVideo.lastQueryVid,
						ver: x.ver.replace(/\$/g, ""),
						str4: navigator.userAgent,
						url: window != top ? document.referrer : document.location.href,
						str2: x.filename || "unknown"
					});
					this.play(this.curVideo.lastQueryVid, this.config.autoplay, false);
					return;
				}
				var errContent = -1;
				if ( !! e.target && e.target.error) {
					errContent = e.target.error.code;
				}
				if (errContent != 4) {
					return;
				}
				this.showError(0, errContent);
			},
			"onPlaying": function() {
				this.callCBEvent("onplaying", curVid, this.curVideo);
			}
		});


		// $.extend(this.protectedFn, {
		// 	onwrite: function() {
		// 		//修正安卓微信里点击视频不播放的问题
		// 		//微信里许多安卓手机点击没反应，必须要点击全屏才可以播放
		// 		//所以我这里做了个修改，点击以后强制全屏
		// 		var timer = null;
		// 		if ($.os.android && $.browser.WeChat) {
		// 			$me.$video.on("click", function() {
		// 				x.debug("click");
		// 				try {
		// 					if (!document.webkitIsFullScreen) {
		// 						this.webkitEnterFullscreen();
		// 					}
		// 					x.debug("this.paused=" + this.paused)
		// 					if (this.paused) {
		// 						timer = setTimeout(function() { //不用timeout的话没法全屏后立即播放，导致还需要再点击播放才行
		// 							x.debug("settimeout play");
		// 							$me.videoTag.play();
		// 						}, 100);

		// 					} else {
		// 						this.pause();
		// 					}
		// 				} catch (err) {};
		// 			});
		// 			document.addEventListener("webkitfullscreenchange", function() {
		// 				x.debug("webkitfullscreenchange:" + document.webkitIsFullScreen);
		// 				if (!document.webkitIsFullScreen) {
		// 					clearTimeout(timer);
		// 					x.debug("set pause");
		// 					setTimeout(function() {
		// 						$me.videoTag.pause()
		// 					}, 32);
		// 				}
		// 			});

		// 		}
		// 	}
		// });

	};

	Html5TinyPlayer.fn = Html5TinyPlayer.prototype = new x.BaseHtml5();

	$.extend(Html5TinyPlayer.prototype, {
		/**
		 * 注册各种插件
		 */
		registerPlugins: function() {
			var t = this,
				//官方插件，不容亵渎，必须使用！
				authorityPluginsList = [];
			$.each(authorityPluginsList, function(i, v) {
				try {
					var evtName = "build" + v;
					if ($.isFunction(t[evtName])) {
						t[evtName](t);
					}
				} catch (err) {
					x.debug("[registerPlugins]:" + err.message);
				}
			});
		},

		/**
		 * 输出播放器
		 * @override
		 * @public
		 */
		write: function(modId) {

			x.BaseHtml5.prototype.write.call(this, modId);

			this.registerPlugins();
			this.callProtectFn("onwrite");

			this.play(this.curVideo, this.config.autoplay);

			var t = this;

			this.$video.one("timeupdate", function() {
				if (isNeedAdrTrick()) {
					adrInvalidPauseCheck(t.videoTag);
				}
			});

			if ($.os.android && $.browser.WeChat) {
				this.$video.one("click", function() {
					this.load();
				});
			}
		}
	});


	$.extend(Html5TinyPlayer.prototype, {
		pause: function() {
			this.videoTag.pause();
		},
		/**
		 * 获取当前播放的视频vid，如果有多个视频，则返回第一个视频vid（主vid）
		 * @override
		 * @public
		 */
		getCurVid: function() {
			if (curVid == "") return (this.curVideo instanceof x.VideoInfo) ? this.curVideo.getVid() : "";
			return curVid;
		},

		/**
		 * 播放指定的视频
		 */
		play: function(v, isAutoPlay, isUseHLS) {
			var t = this,
				isVidChange = false;
			if ($.isUndefined(isAutoPlay)) isAutoPlay = true;
			if ($.isUndefined(isUseHLS)) isUseHLS = this.config.isHtml5UseHLS;
			if ($.isUndefined(v)) {
				t.videoTag.pause();
				t.videoTag.load();
				t.videoTag.play();
				return;
			}

			if (v instanceof x.VideoInfo) {
				isVidChange = (v.getVid() != curVid && curVid != "");
				t.setCurVideo(v);
				if (isVidChange) {
					t.callCBEvent("onchange", t.curVideo.getFullVid());
					//触发自定义事件，告知各种插件组件当前播放器要准备播放视频了
					this.$video.trigger("x:player:videochange");
					//iphone有个怪异的问题，换视频，要先暂停再播放，才能从0位置开始播
					if ($.os.iphone) {
						try {
							t.videoTag.pause();
							t.videoTag.play();
						} catch (err) {};
					}
				}
				v.setPid($.createGUID()); //每播放一次换一次
				curVid = t.curVideo.getFullVid();
			}

			if (t.config.isHtml5ShowPosterOnChange) {
				t.setPoster();
			}

			t.isGetingInfo = true; //当前是否正在获取数据
			try {
				t.videoTag.pause();
			} catch (err) {}

			//从一个独立的CGI判断是否要走HLS
			//逻辑步骤:
			//1. 如果外部没设置为auto，走2，否则走3
			//2.1 走内部逻辑，先判断当前设备是否支持HLS
			//2.2 如果支持HLS，则访问CGI判断当前vid是否用HLS
			//2.3 如果不支持HLS，则走MP4
			//3. 如果设置了参数，则遵循外部参数 
			var _isUseHLS = false;
			if (isUseHLS === "auto") {
				if (x.common.isUseHLS()) {
					x.h5Helper.loadIsUseHLS({
						vid: curVid
					}).done(function(dltype) {
						_isUseHLS = (dltype == 3);
					}).fail(function() {
						_isUseHLS = false;
					}).always(function() {
						_play.call(t, _isUseHLS);
					})
				} else {
					_isUseHLS = false;
					_play.call(t, _isUseHLS);
				}
			} else {
				_isUseHLS = isUseHLS;
				_play.call(t, _isUseHLS);
			}

			function _play(isUseHls) {
				isUseHls = !! isUseHls; //强制转换为boolean
				t.$video.trigger("x:video:ajaxstart", v instanceof x.VideoInfo ? v.getVid() : v, isUseHls);
				var fn = isUseHls ? t.curVideo.getHLS : t.curVideo.getMP4Url;
				fn.call(t.curVideo, v).done(function(videourl) {
					t.isGetingInfo = false;
					t.$video.trigger("x:video:ajaxsuc", videourl);
					t.videoTag.preload = navigator.platform.indexOf("Win") > -1 ? "none" : "auto";
					if (!($.browser.WeChat) && "setAttribute" in t.videoTag) {
						t.videoTag.setAttribute("src", videourl);
					} else {
						t.videoTag.src = videourl;
					}
					t.$video.trigger("x:video:src"); //触发自定义事件，video的src设置

					if (!_isInited) {
						_isInited = true;
						t.callCBEvent("oninited");
					}

					//触发onplay事件
					t.callCBEvent("onplay", t.curVideo.lastQueryVid, t.curVideo);
					if (isAutoPlay) {
						t.videoTag.load();
						t.videoTag.play();
					}

					//播放看点视频
					var offset = t.curVideo.getTagStart() || t.curVideo.getHistoryStart() || 0;
					if (offset > 0) {
						t.seek(offset);
					}

				}).fail(function(errcode, errcontent) {
					//如果使用了hls，且hls失败，则再次拉取MP4文件
					if (isUseHls) {
						x.debug("get hls url fail,reload mp4...");
						_play(false);
						return;
					}
					if (!_isInited) {
						_isInited = true;
						t.callCBEvent("oninited");
					}
					t.$video.trigger("x:video:ajaxerror");
					t.$video.trigger("x:video:error", errcode, errcontent);
					t.showError(errcode, errcontent);
					t.isGetingInfo = false;
				}).always(function() {
					curVid = t.curVideo.lastQueryVid;
				});
			}

		},
		seek: function(time) {
			// 时间，必须确保这是数值类型，公共方法啊，不验证伤不起啊
			if (isNaN(time)) return;

			time = Math.min(time, this.getDuration() - 5), time = Math.max(time, 0);
			var t = this,
				seekTimer = null;
			if (seekTimer) {
				clearTimeout(seekTimer);
				seekTimer = null;
			}

			var seeks = this.videoTag.seekable;
			if (seeks.length == 1 && time < seeks.end(0)) {
				this.seekTo(time);
			} else {
				seekTimer = setTimeout(function() {
					t.seek(time);
				}, 100);
			}
		},
		seekTo: function(time) {
			var t = this;
			try {
				this.videoTag.currentTime = time;
				this.videoTag.paused && (this.videoTag.play());
			} catch (e) {
				this.$video.one("canplay", function() {
					t.videoTag.currentTime = time;
					t.videoTag.paused && (t.videoTag.play());
				});
			}
		},
		/**
		 * 获取当前播放的时间
		 * @return {[type]} [description]
		 */
		getCurTime: function() {
			return this.videoTag.currentTime;
		},
		/**
		 * @see getCurTime
		 * @return {[type]} [description]
		 */
		getPlaytime: function() {
			return this.getCurTime();
		},
		/**
		 * 设置播放时间
		 * @param {[type]} time [description]
		 */
		setPlaytime: function(time) {
			this.seek(time);
		},
		/**
		 * 循环检查是否开始播放了
		 * @param  {[type]} times [description]
		 * @return {[type]}       [description]
		 */
		checkIsPlayingLoop: function(times) {
			times = times || 0;
			var t = this;
			if ( !! this.playinglooptimer) clearTimeout(this.playinglooptimer);
			if (this.videoTag.currentTime === 0 && times <= 30) {
				this.videoTag.load();
				this.videoTag.play();
				this.playinglooptimer = setTimeout(function() {
					t.checkIsPlayingLoop(++times);
				}, 1000);
			}
		},
		/**
		 * 将video的poster属性设置到播放器的poster属性
		 */
		setPoster: function() {
			var poster = this.curVideo.getPoster();
			if ($.isString(poster) && poster.length > 0) {
				this.videoTag.poster = poster
			} else {
				this.hidePoster();
			}
		},
		hidePoster: function() {
			this.videoTag.removeAttribute("poster");
		},
		/**
		 * 获取总时长
		 * @return {Number} 返回总时长
		 */
		getDuration: function() {
			var dur = this.curVideo.getDuration();
			if (!isNaN(dur) && dur > 0) {
				return dur
			}
			return this.videoTag.duration;
		},
		// 确保不会中途卡死，导致无法操作
		checkPause: function() {
			var _timelist = [],
				t = this;
			pauseCheckTimer = setInterval(function(e) {
				if (t.videoTag.paused) {
					return;
				}
				_timelist.push(t.videoTag.currentTime);

				if (_timelist.length >= 2) {
					//x.log(Math.abs(_timelist[0] - _timelist[2]));
					if (Math.abs(_timelist[0] - _timelist[1]) == 0) {
						if ( !! pauseCheckTimer)
							clearInterval(pauseCheckTimer);
						_timelist = [];
						t.videoTag.load();
						t.videoTag.play();
					} else {
						if ( !! pauseCheckTimer)
							clearInterval(pauseCheckTimer);
					}
					_timelist = [];
				}
			}, 500);
		}
	});


	// extend Html5TinyPlayer to x namespace
	x.Html5Tiny = Html5TinyPlayer;



})(x, x.$);