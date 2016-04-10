x.html5skin = {
	/**
	 * 默认出错样式
	 */
	defaultError: (function() {
		return [
			'<div class="x_overlay_warning" id="$ERROR-TIPS-INNER$">',
			'	<div class="x_overlay_content">',
			'		<i class="x_ico_hint"></i><span class="x_text">$ERROR-MSG$ $ERROR-DETAIL$</span>',
			'	</div>',
			'</div>'].join("");
	})()
}