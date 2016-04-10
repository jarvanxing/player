;
(function($) {
	$.param = function(obj, prefix) {
		var str = [];

		for (var p in obj) {

			if ($.isFunction(obj[p]))
				continue;
			var k = prefix ? prefix + "[" + p + "]" : p,
				v = obj[p];
			str.push($.isPlainObject(v) ? $.param(v, k) : (k) + "=" + encodeURIComponent(v));
		}

		return str.join("&");
	};

})(Zepto)