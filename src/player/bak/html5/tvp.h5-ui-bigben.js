(function(x, $) {

	// extends control any feature ...
	$.extend(x.Html5UI.fn, {
		buildbigben: function(player, $video, $control, $UILayer) {

			var $elements = {}, t = this,
				videoTag = $video[0],
				temp_time = 0; //临时变量，记录上次获取到的时间，用于判断左移右移

			$.each(x.html5skin.elements.bigben, function(k, v) {
				$elements[k] = $UILayer.find(v);
			});

			$control.on("x:progress:touchstart", function(e, data) {
				$elements.main.show();
				$elements.desc.text($.formatSeconds(data.time));
				$elements.bar.width(data.time / player.getDuration() * 100 + "%");
				if (data.time < temp_time) {
					$elements.ffrw.addClass("x_ico_rw");
				} else {
					$elements.ffrw.removeClass("x_ico_rw");
				}
				temp_time = data.time;
			}).on("x:progress:touchend", function() {
				$elements.main.hide();
				$elements.desc.text("");
			});

		}
	});
})(x, x.$);