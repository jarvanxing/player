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

	function Html5Live(vWidth, vHeight) {
		this.isUseControl = false;

		this.config.width = x.$.filterXSS(vWidth);
		this.config.height = x.$.filterXSS(vHeight);

		this.control = null;
		this.$UILayer = null;

		var $self = this;
		$.extend(this.protectedFn, {
			onwrite: function() {
				this.control = new x.Html5UI($self);
				this.control.feature = this.config.html5LiveUIFeature;
				this.control.init();
				this.$UILayer = this.control.$UILayer;
			}
		});
	};
	Html5Live.fn = Html5Live.prototype = new x.Html5LiveTiny();

	$.extend(Html5Live.prototype, {
		createVideoHtml: function() {
			var videoTagHtml = x.Html5LiveTiny.prototype.createVideoHtml.call(this), // 调用父类的方法
				html = x.html5skin.getHtml(this.config);
			return html.replace("$VIDEO$", videoTagHtml);
		},
		getPlayerType: function() {
			return "html5live";
		}
	});

	// extends Html5Live to x namespace
	x.Html5Live = Html5Live;

})(x, x.$);