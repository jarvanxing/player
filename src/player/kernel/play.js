/*
* @Author: xilie
* @Date:   2016-04-11 03:02:15
* @Last Modified by:   xilie
* @Last Modified time: 2016-04-11 03:44:02
*/

export default function (_class) {
	_class.prototype.play =  function(v, isAutoPlay = true, isUseHLS = this.config.isHtml5UseHLS) {
		if (_.isUndefined(v)) {
			this.videoTag.pause()
			this.videoTag.load()
			this.videoTag.play()
			return
		}

		if (v instanceof VideoInfo) {
			let newVid = v.getVid()
			let isVidChange = (newVid !== this.curVid && this.curVid)
			this.setCurVideo(v);
			if (isVidChange) {
				this.callCBEvent("onchange", newVid)
				//触发自定义事件，告知各种插件组件当前播放器要准备播放视频了
				this.emit("player:videochange")
				//iphone有个怪异的问题，换视频，要先暂停再播放，才能从0位置开始播
				if (Detector.os.iphone) {
					try {
						this.videoTag.pause()
						this.videoTag.play()
					} catch (err) {}
				}
			}
			v.setPid(Util.createGUID()) //每播放一次换一次
			this.curVid = newVid
		}

		if (this.config.isHtml5ShowPosterOnChange) {
			this.setPoster()
		}

		this.isGetingInfo = true //当前是否正在获取数据
		try {
			this.videoTag.pause()
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
			if (Util.isUseHLS()) {
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
	}

	return _class
}