/**
 * @fileOverview 云播放器 封装直播的辅助函数
 */

/*
 * @include "./x.define.js"
 * @include "./x.common.js"
 */

;
(function(x, $) {

	/**
	 * 封装直播的辅助函数
	 *
	 * @namespace x.livehub
	 * @type
	 */
	x.livehub = {
		/**
		 * 是否五地
		 *
		 * @ignore
		 * @type Boolean
		 */
		g_isFiveCity: false,
		/**
		 * 是否支持回看
		 *
		 * @ignore
		 * @type Boolean
		 */
		g_lookback: false,
		/**
		 * 是否开启flash p2p
		 * @ignore
		 * @type Boolean
		 */
		g_flashp2p: false,
		/**
		 * iretcode
		 * @type
		 */
		iretcode: 0,
		/**
		 * 当前直播频道信息
		 *
		 * @type
		 */
		g_curCnlInfo: {},

		checkUserArea: function() {
			return false
		},
		/**
		 * 异步请求CGI判断当前是否应该使用Flash来播放直播
		 *
		 * @class x.livehub.FlashChecker
		 */
		FlashChecker: function() {
			var $me = this;
			this.cnlId = "";
			this.extParam = {};
			this.onError = $.noop;
			this.onCanFlash = $.noop;
			this.onCanHTML5 = $.noop;
			this.onCanOCX = $.noop;
			this.onComplete = $.noop;
			this.onGetCnlId = $.noop;
			/**
			 * 当ajax请求成功
			 */
			this.onSuccess = function(json) {
				// 请求成功
				if ($.type(json) == "object" && !$.isUndefined(json.ret) && json.ret == 0) {

					if ($.isUndefined(json.isfivecity)) {
						x.livehub.g_isFiveCity = json.isfivecity;
					}
					x.livehub.iretcode = json.iretcode;
					x.livehub.g_flashp2p = +json.flashp2p || 0;
					x.debug("get channel info:cnlid=" + json.progid + ",lookback=" + json.lookback + ",isflash=" + json.flash + ",flashp2p=" + json.flashp2p);
					$me.cnlId = ("" + json.progid) || "";
					$me.onGetCnlId("" + $me.cnlId, !! json.lookback);
					x.livehub.getCurChannelInfo($me.cnlId, $me.extParam);

					if (json.flash == 1) {
						// 获取是否支持回看
						x.livehub.g_lookback = !! json.lookback;
						// 可以使用flash播放的回调
						$me.onCanFlash($me.cnlId);
					} else if (x.common.isUseHtml5()) { // 可以播，但是不能用flash，那就用HTML5
						$me.onCanHTML5($me.cnlId);
					} else if ( !! $.os.windows) {
						$me.onCanOCX($me.cnlId);
					} else {
						$me.onError(json.iretcode);
					}
				} else {
					$me.onError(500);
				}
			}

			/**
			 * 发起请求
			 */
			this.send = function() {
				var sendData = {
					cnlid: $me.cnlId || "",
					area: x.livehub.checkUserArea() ? 1 : 0,
					qq: x.common.getUin(),
					ios: x.common.isUseHtml5() ? 1 : 0
				};
				var extData = {
					debug: "",
					key: "",
					ip: ""
				}
				$.each(extData, function(el) {
					extData[el] = $.getUrlParam(el);
				})
				$.extend(sendData, extData);
				$.extend(sendData, this.extParam);

				$.ajax({
					type: "GET",
					url: "http://zb.s.qq.com/getproginfo.fcgi",
					data: sendData,
					dataType: "jsonp",
					error: function() {
						$me.onError();
						$me.onComplete();
					},
					success: function(json) {
						$me.onSuccess(json);
						$me.onComplete();
					}
				});
			}
		},

		/**
		 * 异步获取当前直播频道信息
		 *
		 * @param {}
		 *          cnlId
		 */
		getCurChannelInfo: function(cnlId, extParam) {
			var curInfo = x.livehub.g_curCnlInfo;
			if (extParam && $.type(extParam) == 'object') {
				//var curtime =  extParam.currenttime.substr(11,16);
				curInfo.cnlId = extParam.cnlId;
				extParam.channelname && (curInfo.cnlName = extParam.channelname);
				extParam.currentname && extParam.currenttime && (curInfo.prmInfo = extParam.currenttime + "|" + extParam.currentname);
			} else {
				curInfo = {};
			}
			// $.ajax({
			// 	type: "get",
			// 	url: "http://sns.video.qq.com/fcgi-bin/dlib/dataout_pc?otype=json&auto_id=191",
			// 	data: {
			// 		cid: cnlId
			// 	},
			// 	dataType: "jsonp",
			// 	success: function(json) {
			// 		if ( !! json && !$.isUndefined(json["channel"])) {
			// 			var channel = json["channel"];
			// 			x.livehub.g_curCnlInfo.cnlId = cnlId;
			// 			x.livehub.g_curCnlInfo.cnlName = channel["cname"];
			// 			x.livehub.g_curCnlInfo.prmInfo = channel["cur_ptime"] + "|" + channel["cur_pname"]
			// 		} else {
			// 			x.livehub.g_curCnlInfo = {};
			// 		}
			// 	}
			// });
		}

	}

})(x, x.$);