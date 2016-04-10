;
(function(x, $) {

	/**
	 * 播放质量监控组件
	 * @param {type} vid [description]
	 */
	function TimerObject() {
		this.start = x.$.now();
		this.end = 0;
	};
	TimerObject.prototype = {
		getTimelong: function() {
			this.end = x.$.now();
			if (this.end <= 0 || this.start <= 0) return 0;
			var a = this.end - this.start;
			return (a <= 0 ? 0 : a);
		},
		getSeconds: function() {
			return parseInt(this.getTimelong() / 1000, 10);
		}
	};


	function Monitor(vid, player) {
		this.vid = vid || "";
		this.player = player;
		this.rid = player.curVideo.getRid() || $.createGUID();
		this.pid = player.curVideo.getPid() || $.createGUID();
		this.reportTimer = {};

		var playertype = $.isFunction(player.getPlayerType) ? player.getPlayerType().toUpperCase() : "";
		var cgiURL = "http://rcgi.video.qq.com/report/play?",
			platformId = this.getplatform(),
			ver = ["TenPlayer", playertype, "V2.0"].join(""),
			param = {
				"version": ver,
				"vid": this.vid,
				"rid": this.rid,
				"pid": this.pid,
				"url": window != top ? document.referrer : document.location.href,
				"platform": platformId,
				"ptag": $.cookie.get("ptag"),
				"pfversion": $.os.version
			};

		this.getStepName = function(step) {
			return "report_" + step;
		};
		this.addStep = function(step, extData) {
			this.reportTimer[this.getStepName(step)] = new TimerObject();
		};
		this.delStep = function(step) {
			delete this.reportTimer[this.getStepName(step)];
		};

		this.report = function(step, val, extData) {
			var r = [],
				videodata = {},
				pa = {},
				url = cgiURL;

			if (!step) return;

			$.extend(pa, param);

			if (typeof extData == "object") {
				$.extend(pa, extData);
			}

			try {
				videodata.vt = player.curVideo.data.vl.vi[0].ul.ui[0].vt;
			} catch (er) {
				videodata.vt = 0;
			}
			videodata.vurl = player.curVideo.url;
			videodata.bt = parseInt(player.getDuration(), 10);

			$.extend(pa, videodata);
			pa.step = step;
			pa.ctime = $.getISOTimeFormat();
			pa.val = val;

			for (var p in pa) {
				var v = pa[p];
				if (isNaN(v)) {
					v = encodeURIComponent("" + v);
				}
				r.push(p + "=" + v);
			}
			url += r.join("&");

			x.report(url);
		}

		this.reportStep = function(step, extData) {
			if (!(this.reportTimer[this.getStepName(step)] instanceof TimerObject)) {
				x.debug("no timer " + step);
				return;
			}

			var val = this.reportTimer[this.getStepName(step)].getTimelong();

			if (isNaN(val) || val <= 0 || val > 9000000) {
				return;
			}

			this.report(step, val, extData);
			this.delStep(step);
		}
	};

	Monitor.fn = Monitor.prototype = {
		/**
		 * 获取上报的业务id
		 * @return {Number} 业务id
		 */
		getBusinessId: function() {
			//任何页面只要是在微信里打开，都算到微信的头上
			if ( !! $.userAgent.WeChat) {
				return 6;
			}

			var host = "";
			//如果是使用的播放器iframe版本，则需要获取顶部的url，由于可能跨域所以从referrer里取
			//被iframe的页面的referrer是其父页面的url
			if (document.location.href.indexOf("http://v.qq.com/iframe/") >= 0 && window != top) {
				var l = document.referrer;
				if (l != "") {
					var link = document.createElement("a");
					link.href = l;
					host = link.hostname;
					link = null;
					delete link;
				}
			}
			if (host == "") {
				host = document.location.hostname || document.location.host;
			}
			var keys = [];
			host = host.toLowerCase();
			for (var i = 0, len = keys.length; i < len; i++) {
				var key = keys[i];
				if (key.r.test(host)) {
					return key.v;
				}
			}
			return 7; //7表示其他，固定值，详情咨询figecheng或者vicyao
		},
		/**
		 * 获取上报的设备编号
		 * @return {Number} 设备编号
		 */
		getDeviceId: function() {
			var os = $.os,
				ua = navigator.userAgent;
			if (os.ipad) return 1;
			if (os.windows) {
				//windows pad userAgent like this: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; Touch)
				if (/Touch/i.test(ua)) return 8;
				//windows phone userAgent like this:
				//Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)
				if (/Phone/i.test(ua)) return 7;
				return 2;
			}
			if (os.android) {
				if (os.tablet) return 5;
				return 3;
			}
			if (os.iphone) return 4;
			if (os.Mac) return 9;

			//未知设备
			return 10;
		},
		/**
		 * 获取上报的platform值
		 * @return {Number} platform值
		 */
		getplatform: function() {
			//编号方式	业务编号×10000+设备编号×100+播放方式			
			var bussId = this.getBusinessId(),
				deviceId = this.getDeviceId();
			return bussId * 10000 + deviceId * 100 + 1; //播放方式 1表示HTML5，写死
		}
	}

	x.H5Monitor = Monitor;

})(x, x.$);