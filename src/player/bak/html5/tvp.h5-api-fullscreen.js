;
(function(x, $) {
	$.extend(x.BaseHtml5.fn, {
		enterFullScreen: function() {
			var t = this,
				playerMod = this.$mod[0],
				times = 0;
			if (playerMod.webkitRequestFullScreen) {
				playerMod.webkitRequestFullScreen();
				return;
			}
			if (this.videoTag.webkitSupportsFullscreen) {
				if (this.videoTag.readyState >= 1) {
					this.videoTag.webkitEnterFullscreen();
				} else {
					if (++times >= 30) return;
					setTimeout(function() {
						t.enterFullScreen()
					}, 200);
				}
			}
		}
	});
})(x, x.$)