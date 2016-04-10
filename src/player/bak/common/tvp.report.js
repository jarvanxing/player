/**
 * @type {Function}
 * @namespace Live.report
 */

x.report = (function() {
	var isFree = true;
	var reportObj = null;
	var urlList = [];

	/**
	 * 上报后由于返回的不是图片会引起image的error事件，添加事件回调方法上报url队列中剩下的url
	 */
	function errorHandle() {
		if (urlList.length == 0) {
			isFree = true;
			reportObj = null;
			return;
		}
		create(urlList.splice(0, 1));
		isFree = false;
	}

	function create(url) {
		reportObj = document.createElement("img");
		reportObj.onerror = errorHandle;
		reportObj.src = url;
	}

	function reportUrl(url) {
		if (!url || !/^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i.test(url)) { // 过滤非法参数	
			return;
		}
		if (reportObj == null) { // 第一次调用上报方法时先做初始化工作才上报	
			create(url);
			isFree = false;
			return;
		} else if (isFree) { // 如果当前image对象空闲，则直接上报		
			create(url);
			isFree = false;
			return;
		} else { // 否则进入队列
			urlList.push(url);
		}
	}
	return function(param) {
		if (x.$.isString(param)) {
			reportUrl(param);
			return;
		}

		if (x.$.type(param) == "object") {
			var r = [];
			for (var i in param) {
				r.push(i + "=" + encodeURIComponent("" + param[i]));
			}
			var url = "http://rcgi.video.qq.com/web_report?";
			reportUrl(url + r.join("&"));
		}
	}
})();