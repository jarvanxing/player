;
(function(x, $) {
	var $fullscreen = null;

	$.extend(x.Html5Player, {
		isFullScreen: false
	});

	$.extend(x.Html5UI.fn, {
		buildfullscreen: function(player, $video, $control, $UILayer) {
			var videoTag = $video[0],
				t = this;

			$fullscreen = $control.find(x.html5skin.elements.fullscreen);

			//绑定全屏按钮
			$fullscreen.on("click", function() {
				if (t.checkIsFullScreen()) {
					t.cancelFullScreen();
				} else {
					t.enterFullScreen();
				}
			});

			// webkit内核的特性
			if ("onwebkitfullscreenchange" in $UILayer[0]) {
				$UILayer.bind("webkitfullscreenchange", function() {
					if (!document.webkitIsFullScreen) {
						t.cancelFullScreen();
					}
				});
			} else {
				//ios独有的特性,但不会触发上述onwebkitfullscreenchange
				//详见 apple官方参考文档 :
				//http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW1
				$video.bind("webkitendfullscreen ", function() {
					t.cancelFullScreen();
				});
			}

			//绑定键盘Esc按钮
			$(document).on("keydown", function(e) {
				if (document.webkitIsFullScreen && e.keyCode == 27) {
					t.cancelFullScreen();
				}
			});

			//重写播放器全屏API
			$.extend(x.Html5Player.fn, {
				"enterFullScreen": function() {
					t.enterFullScreen();

				},
				"cancelFullScreen": function() {
					t.cancelFullScreen();

				}
			})
		},
		/**
		 * 判断当前是否是全屏
		 * @return {[type]} [description]
		 */
		checkIsFullScreen: function() {
			return $fullscreen.hasClass("x_unfullscreen")
		},
		/**
		 * 进入全屏
		 * @return {[type]} [description]
		 */
		enterFullScreen: function() {
			if (this.player.config.isHtml5UseFakeFullScreen) {
				this.enterFakeFullScreen();
			} else {
				this.enterRealFullScreen();
			}
			this.player.isFullScreen = true;
			this.player.callCBEvent("onfullscreen", true);
		},
		/**
		 * 取消全屏
		 * @return {[type]} [description]
		 */
		cancelFullScreen: function() {
			if (this.player.config.isHtml5UseFakeFullScreen) {
				this.cancelFakeFullScreen();
			} else {
				this.cancelRealFullScreen();
			}
			this.player.isFullScreen = false;
			this.player.callCBEvent("onfullscreen", false);
		},
		/**
		 * 调用全屏API进入真正的全屏
		 * @return {[type]} [description]
		 */
		enterRealFullScreen: function() {
			var t = this,
				player = t.player,
				$UILayer = player.$UILayer,
				$video = t.$video,
				$fullscreen = this.$control.find(x.html5skin.elements.fullscreen);

			var container = $UILayer[0],
				videoTag = $video[0];
			if (container.webkitRequestFullScreen) {
				container.webkitRequestFullScreen();
				$UILayer.css("width", screen.width).css("height", screen.height);
				$video.css("width", screen.width).css("height", screen.height);
			} else {
				//ios系统上触发，系统特性使然，不需要再用样式去修改各种元素的宽度，系统自动完成
				if (videoTag.webkitSupportsFullscreen) {
					videoTag.webkitEnterFullscreen();
				}
			}
			$fullscreen.removeClass("x_fullscreen").addClass("x_unfullscreen");
		},
		/**
		 * 调用全屏API取消全屏
		 * @return {[type]} [description]
		 */
		cancelRealFullScreen: function() {
			var t = this,
				player = t.player,
				$UILayer = player.$UILayer,
				$video = t.$video,
				$fullscreen = this.$control.find(x.html5skin.elements.fullscreen);


			$fullscreen.removeClass("x_unfullscreen").addClass("x_fullscreen");

			if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
				$video.css("width", player.config.width).css("height", player.config.height);
				$UILayer.css("width", player.config.width).css("height", player.config.height);
			}
		},
		/**
		 * 进入伪全屏
		 */
		enterFakeFullScreen: function() {
			$("body").addClass('fullscreen');
			this.$video.addClass("fullscreen");
			this.player.$mod.addClass('fullscreen');
			this.player.$videomod.addClass('fullscreen');
			$fullscreen.removeClass('x_fullscreen');
			$fullscreen.addClass('x_unfullscreen');
		},
		/**
		 * 取消伪全屏API
		 * @return {[type]} [description]
		 */
		cancelFakeFullScreen: function() {
			$("body").removeClass('fullscreen');
			this.$video.removeClass("fullscreen");
			this.player.$mod.removeClass('fullscreen');
			this.player.$videomod.removeClass('fullscreen');
			$fullscreen.removeClass('x_unfullscreen');
			$fullscreen.addClass('x_fullscreen');
		}
	});
})(x, x.$);