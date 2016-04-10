;
(function(x, $) {
	$.extend(x.Html5UI.fn, {
		/**
		 * 切换清晰度控制按钮
		 * @param  {x.Player} player 播放器示例
		 * @param  {x.$} $video    video标签$查询后的zepto对象
		 * @param  {x.$} $control  控制栏$查询后的zepto对象
		 * @param  {x.$} $UILayer 播放器UI $查询后的zepto对象
		 */
		builddefinition: function(player, $video, $control, $UILayer) {
			var $elements = {}, curVideo = player.curVideo;
			$.each(x.html5skin.elements.definition, function(k, v) {
				$elements[k] = $control.find(v);
			});

			$video.bind("x:video:src", function() {
				$.when(curVideo.getFormatList()).then(function(d) {
					if (d.list.length == 1) { //如果就唯一一种清晰度，就不要显示清晰度可选了
						$elements.main.hide();
						$elements.list.hide();
						$elements.button.hide();
						return;
					}

					//将支持的清晰度列表填充到清晰度列表选择栏里
					var defValue = $.isFunction(curVideo.getPlayFormat) ? curVideo.getPlayFormat() : curVideo.getFormat(),
						defName = x.html5lang.getDefiName(defValue),
						listKV = {},
						html = "";

					$.each(d.list, function(i, v) {
						listKV[v] = x.html5lang.getDefiName(v);
					});
					var data = {
						"curv": defValue,
						"curn": defName,
						"list": listKV
					};

					var render = x.$.tmpl(x.html5skin.definitionList);
					html = render({
						"data": data
					});
					$elements.list.html(html);

					//设置控制栏当前显示的清晰度名称
					if (defName) {
						$elements.button.text(defName);
						if ($elements.button.css("display") == "none") $elements.button.show();
					}
					$elements.main.show();
				});

			});

			$elements.button.click(function() {
				$elements.list.toggle();
			});

			$control.on("x:progress:touchstart", function() {
				if ($elements.list.css("display") != "none") {
					$elements.list.hide();
				}
			})

			var t = this;
			$elements.list.undelegate("li", "touchend");
			$elements.list.delegate("li", "touchend", function() {
				var $el = $(this),
					fmt = $el.data("fmt"); //从data-fmt自定义属性里获取
				if (!fmt) return;
				t.player.swtichDefinition(fmt);
				$elements.list.hide();
			});
		}
	})
})(x, x.$);