/**
 * @fileoverview 播放器 H5内核 logo
 */

;
(function(x, $) {
	/**
	 * 建立HTML5播放器视频标题显示面板
	 * @param  {x.Player} player    x.Player实例
	 * @param  {$("video")} $video     video标签$查询结果
	 * @param  {$("control")} $control   控制栏标签$查询结果
	 * @param  {$("container")} $UILayer UI容器$查询结果
	 */
	$.extend(x.Html5UI.fn, {
		buildtitle: function(player, $video, $control, $UILayer) {
			var $elements = {}, t = this;

			$.each(x.html5skin.elements.title, function(k, v) {
				$elements[k] = $UILayer.find(v);
			});

			$video.on("x:video:ajaxsuc", function() {
				$elements.text.text(player.curVideo.getTitle());
			});
		}
	});
})(x, x.$);