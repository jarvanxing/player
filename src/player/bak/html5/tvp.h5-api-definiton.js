/**
 * @fileOverview 播放器 HTML5播放器的清晰度切换API
 * 
 */


;
(function(x, $) {
	$.extend(x.Html5Tiny.fn, {
		/**
		 * 切换清晰度
		 * @memberOf x.Html5Tiny
		 * @param  {[type]} format [description]
		 * @return {[type]}        [description]
		 */
		swtichDefinition: function(format) {
			if (this.curVideo.getFormat() == format) return;

			this.pause();
			var curTime = this.getCurTime(),
				t = this,
				timer = null;
			this.curVideo.setFormat(format);

			this.$video.one("canplay canplaythrough", function(e) {
				if (!t.isDefinitionSwitching) {
					return;
				}
				setTimeout(function() {
					t.seek(curTime)
				}, 500);
				timer = setInterval(function() {
					if (t.videoTag.currentTime >= curTime) {
						clearInterval(timer);
						timer = null;
						t.isDefinitionSwitching = false;
					}
				}, 50);
			});

			this.isDefinitionSwitching = true;
			this.play(this.curVideo);
		}
	});
})(x, x.$);