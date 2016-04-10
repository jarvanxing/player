/**
 * @fileoverview 播放器H5播放暂停按钮
 *
 */

(function(x, $) {

	$.extend(x.Html5UI.fn, {
		/**
		 * 扩展播放暂停按钮
		 * @param  {x.Player} player    x.Player实例
		 * @param  {$("video")} $video     video标签$查询结果
		 * @param  {$("control")} $control   控制栏标签$查询结果
		 * @param  {$("container")} $UILayer UI容器$查询结果
		 */
		buildplaypause: function(player, $video, $control, $UILayer) {

			var $playBtn = $UILayer.find(x.html5skin.elements.play),
				videoTag = $video[0],
				t = this,
				isClick = false;

			$playBtn.on($.os.hasTouch ? "touchend" : "click", function(e) {
				x.debug(e.type);
				if (!isClick) {
					isClick = true;
					videoTag.load();
				}
				if (videoTag.paused) {
					videoTag.play();
				} else {
					videoTag.pause();
				}
			});
			$video.on("paused pause", function() {
				//如果当前是正在拖动控制栏，也会触发pause，但事实上这个时候不需要把播放按钮置为暂停状态
				if ( !! t.isTouching) {
					return;
				}
				$playBtn.addClass("x_play").removeClass("x_pause");
			}).on("play playing", function() {
				$playBtn.addClass("x_pause").removeClass("x_play");
			})

		}
	});
})(x, x.$);