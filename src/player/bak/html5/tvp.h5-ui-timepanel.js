/**
 * @fileOverview HTML5播放器时间显示面板
 */
;
(function(x, $) {
	$.extend(x.Html5UI.fn, {
		/**
		 * 建立HTML5播放器时间显示面板
		 * @param  {x.Player} player    x.Player实例
		 * @param  {$("video")} $video     video标签$查询结果
		 * @param  {$("control")} $control   控制栏标签$查询结果
		 * @param  {$("container")} $UILayer UI容器$查询结果
		 */
		buildtimepanel: function(player, $video, $control, $UILayer) {
			var $elements = {}, t = this;
			$.each(x.html5skin.elements.timePanel, function(k, v) {
				$elements[k] = $control.find(v);
			});

			if (!$.isUndefined($elements.total) && $elements.total.length != 0) {
				$video.on("durationchange x:video:src", function(e) {
					$elements.total.text($.formatSeconds(player.getDuration()));
				})
			}

			if (!$.isUndefined($elements.cur) && $elements.cur.length != 0) {
				$video.on("timeupdate", function() {
					$elements.cur.text($.formatSeconds(this.currentTime));
				}).on("x:player:videochange", function() {
					$elements.cur.text($.formatSeconds(0));
				});
			}

			$control.bind("x:progress:touchstart", function(e, data) {
				$elements.cur.text($.formatSeconds(data.time));
			})

		}
	});
})(x, x.$);