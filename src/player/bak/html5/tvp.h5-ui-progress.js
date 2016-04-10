(function(x, $) {

	// extends control any feature ...
	$.extend(x.Html5UI.fn, {
		buildprogress: function(player, $video, $control, $UILayer) {

			var $progress = $(x.html5skin.controlTpl.progress).appendTo($control),
				videoTag = $video[0],
				$elements = {}, mouseIsDown = false;
			$.each(x.html5skin.elements.progress, function(k, v) {
				$elements[k] = $control.find(v);
			});

			/**
			 * @ignore 处理鼠标或者手势移动
			 */

			function handleMove(e) {
				if (!videoTag.duration) return;

				var x = e.pageX,
					offset = $elements.total.offset().left, // 记录点击左边的相对偏移量
					precent = 0, // 点击位置的百分比
					progressWidth = $elements.total.width();
				expectTime = 0, // 最后算出的期望拖拽到的时间点
				pos = 0;

				if (x < offset) {
					x = offset;
				} else if (x > progressWidth + offset) {
					x = progressWidth + offset;
				}
				pos = x - offset;

				precent = pos / progressWidth;
				expectTime = videoTag.duration * precent;
				if (expectTime == videoTag.currentTime) return; // 点着好玩吗？

				videoTag.currentTime = expectTime;
			}

			$elements.total.bind("mousedown", function(e) {
				if (e.which != 1) return;

				mouseIsDown = true;
				handleMove(e);

				$(document).on("mousemove.dur", function(e) {
					handleMove(e);
				}).on("mouseup.dur", function(e) {
					mouseIsDown = false;
				});

				return false;
			}).bind("mouseenter", function(e) {
				if (!mouseIsDown) return;
				handleMove(e);
				return false;

			}).bind("mouseup", function(e) {
				mouseIsDown = false;
				$(document).off(".dur");
				return false;
			});

			$video.on("timeupdate progress", function() {
				var progressWidth = $elements.total.width(), // 记录进度条总体宽度
					curLeft = videoTag.currentTime / videoTag.duration * progressWidth, // 进度条左边的left距离
					handlWidth = $elements.handle.width();
				handlLeft = curLeft - handlWidth / 2;
				handlLeft = Math.min(handlLeft, progressWidth - handlWidth);
				handlLeft = Math.max(handlLeft, 0);
				$elements.cur.css('width', curLeft + "px");
				$elements.handle.css('left', handlLeft + "px");
			});
		}
	});
})(x, x.$);