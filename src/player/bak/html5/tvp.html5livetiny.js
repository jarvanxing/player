/**
 * @fileOverview 云播放器 HTML5直播播放器
 */

/*
 * @include "./x.define.js"
 * @include "./x.jquery.js"
 * @include "./x.common.js"
 * @include "./x.baseplayer.js"
 * @include "./x.livehub.js"
 */

;
(function(x, $) {
	var _isInited = false;

	function Html5LiveTiny(vWidth, vHeight) {
		this.config.width = x.$.filterXSS(vWidth),
		this.config.height = x.$.filterXSS(vHeight),

		this.videoTag = null, // <video>标签对象
		this.$video = null, // 播放器 $对象
		this.protectedFn = {},
		this.isUseControl = true;

		$.extend(this.h5EvtAdapter, {
			"onError": function(ts, e) {
				var errContent = -1;
				if ( !! e.target && e.target.error) {
					errContent = e.target.error.code;
				}
				//this.showError(0, errContent);
				this.callCBEvent("onerror", 0, errContent);
			}
		});
	}

	Html5LiveTiny.fn = Html5LiveTiny.prototype = new x.BaseHtml5();

	$.extend(Html5LiveTiny.fn, {
		/**
		 * 输出播放器
		 */
		write: function(id) {

			x.BaseHtml5.prototype.write.call(this, id);

			this.callProtectFn("onwrite");
			this.callCBEvent("onwrite");

			this.play(this.curVideo, this.config.autoplay);
		},

		play: function(video, isAutoPlay) {
			if (!this.videoTag) {
				throw new Error("未找到视频播放器对象，请确认<video>标签是否存在");
			}
			if (!video instanceof x.VideoInfo) {
				throw new Error("传入的对象不是x.VideoInfo的实例");
			}
			if ($.isUndefined(isAutoPlay)) isAutoPlay = true;

			this.setCurVideo(video);

			var cnlId = video.getChannelId();
			var guid = x.$.createGUID();
			var new_url = "http://zb.v.qq.com:1863/?progid=" + cnlId + "&ostype=ios" + "&rid=" + encodeURIComponent(guid);

			this.videoTag.src = new_url;
			this.$video.trigger("x:video:src"); //触发自定义事件，video的src设置
			if (!_isInited) {
				_isInited = true;
				this.callCBEvent("oninited");
			}

			this.videoTag.pause();
			if (isAutoPlay) {
				this.videoTag.load(); // 重新加载数据源
				this.videoTag.play(); // 播放
			}
			this.callCBEvent("onchange", this.curVideo.getChannelId());
		}
	});

	x.Html5LiveTiny = Html5LiveTiny;
	x.Html5LiveTiny.maxId = 0;
})(x, x.$);