;
(function($) {
	if (typeof $.getScript == "undefined") {
		$.getScript = function(src, func) {
			var script = document.createElement('script'),
				head = document.getElementsByTagName("head")[0],
				READY_STATE_RE = /^(?:loaded|complete|undefined)$/;
			script.async = "async";
			script.src = src;
			if (func) {
				script.onload = script.onerror = script.onreadystatechange = function() {
					if (READY_STATE_RE.test(script.readyState)) {
						// Ensure only run once and handle memory leak in IE
						script.onload = script.onerror = script.onreadystatechange = null;
						if (!DEBUG) {
							head.removeChild(script);
						}
						// Dereference the script
						script = null;
						func();
					}
				}
			}
			head.appendChild(script);
		}
	}
})(x.$);
