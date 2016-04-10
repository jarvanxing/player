/**
 * @fileoverview 统一播放器H5内核遮罩插件
 *
 */

(function(x, $) {

	/**
	 * 扩展内核遮罩插件
	 * @param  {x.Player} player    x.Player实例
	 * @param  {$("video")} $video     video标签$查询结果
	 * @param  {$("control")} $control   控制栏标签$查询结果
	 * @param  {$("container")} $UILayer UI容器$查询结果
	 */
	$.extend(x.Html5UI.fn, {
		buildoverlay: function(player, $video, $control, $UILayer) {

			var videoTag = $video[0], // 
				$elements = {},
				$overlay = {},
				t = this,
				n = "x_none",
				playtimer = null,
				isHidePlayOnInit = (($.os.iphone || $.os.ipod) && $.os.version >= "6"),
				isClicked = false;

			$.each(x.html5skin.elements.overlay, function(k, v) {
				$elements[k] = $UILayer.find(v);
			});


			$elements.loading.hide();

			function showloading() {
				clearTimeout(playtimer);
				//x.log("[buildoverlay][showloading]:" + e.type);
				$elements.loading.show();
				$elements.play.hide();
			}

			function showplay() {
				playtimer = setTimeout(function() {
					//x.log("[buildoverlay][showplay]:" + e.type);
					$elements.loading.hide();
					$elements.play.show();
				}, 500); //为什么是500毫秒？因为有个定时器每500毫秒判断一次当前视频是否正常开始播放
			}

			function hideoverlay() {
				clearTimeout(playtimer);
				$elements.loading.hide();
				$elements.play.hide();
			}

			$video
				.on("playing seeked", hideoverlay)
				.on("pause paused", function() {
					if (!player.config.isHtml5ShowPlayBtnOnPause || !! t.isTouching || !! player.isGetingInfo || !! player.isDefinitionSwitching) {
						return;
					}
					showplay();
				})
				.on("seeking waiting", showloading);

			var _pfn = function(e) {
				if (DEBUG) x.log("_pfn:" + e.type);
				$elements.play.off(e.type == "click" ? "touchend" : "click", _pfn);
				if (!isClicked) {
					isClicked = true;
					videoTag.load();
				}
				videoTag.play();
			};
			//有些浏览器不支持tap，有些又click无效
			$elements.play.on("click", _pfn);
			$elements.play.on("touchend", _pfn);


		}
	});
})(x, x.$);