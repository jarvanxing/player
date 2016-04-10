/**
 * @fileOverview 播放器 HTML5播放器
 *
 */

/*
 * @include "../x.define.js"
 * @include "../../extend/zepto.js"
 * @include "../x.common.js"
 * @include "../x.baseplayer.js"
 * @include "./x.html5tiny.js"
 */

;
(function(x, $) {

	/**
	 * 播放器 带有控制栏的HTML5播放器
	 */

	function Html5Player(vWidth, vHeight) {
		this.isUseControl = false;
		this.config.width = x.$.filterXSS(vWidth);
		this.config.height = x.$.filterXSS(vHeight);
		this.control = null;
		this.$UILayer = null;

		var $self = this;
		$.extend(this.protectedFn, {
			onwrite: function() { //注意这个会覆盖tinyplayer的onwrite接口哦
				//皮肤图片使用了SVG，对于不支持SVG的直接加个样式
				//这个样式名能自动使用png图片，重构接口人blankyu
				var cssname = x.html5skin.noSVGClassName;
				if ($.isString(cssname) && cssname.length > 0 && !x.common.isSupportSVG()) {
					this.videomod.classList.add(cssname);
				}

				//开始创建各种UI皮肤和皮肤里的各种零件
				this.control = new x.Html5UI($self);
				this.control.init();
				this.$UILayer = this.control.$UILayer;

			}
		});

		// $.extend(this.h5EvtAdapter, {
		// 	"onCanPlayThrough": function() {
		// 		var prefix = $self.getCurVideo().getPrefix();
		// 		if (prefix > 0) {
		// 			this.seek(prefix);
		// 			$self.showTips("播放器已经为您自动跳过片头");
		// 		}
		// 	}
		// });
	};
	Html5Player.fn = Html5Player.prototype = new x.Html5Tiny();

	$.extend(Html5Player.prototype, {
		createVideoHtml: function() {
			var videoTagHtml = x.Html5Tiny.prototype.createVideoHtml.call(this), // 调用父类的方法
				html = x.html5skin.getHtml(this.config);
			return html.replace("$VIDEO$", videoTagHtml);
		},
		// write: function(modId) {
		// 	var t = this;
		// 	this.loadCss().done(function() {
		// 		x.Html5Tiny.prototype.write.call(t, modId);
		// 	});
		// },
		hideControl: function() {
			this.control.hide();
		},
		showControl: function() {
			this.control.show();
		}
	});

	// extends Html5Player to x namespace
	x.Html5Player = Html5Player;

})(x, x.$);