/**
 * @fileOverview 云播放器 播放器基类
 */

/*
 * @include "./x.define.js"
 * @include "./x.jquery.js"
 * @include "./x.common.js"
 */

;
(function(x, $) {
	/**
	 * 播放器基类
	 *
	 * @class x.BasePlayer
	 * @param {number}
	 *          vWidth 宽度
	 * @param {number}
	 *          vHeight 高度
	 */
	x.BasePlayer = function() {

		this.modId = "",
		this.sessionId = "", //当前回话id，每次创建播放器都有自己的sessionid，主要用于一些统计上报，区分每次输出播放器的多次上报
		this.$mod = null, //显示整个播放器输出内容的容器，$查询结果
		this.videomod = null, //仅播放器的容器
		this.playerid = "", // 当前实例
		this.curVideo = null, // 视频对象
		//this.curVid = "", //当前播放的视频vid
		this.instance = null, //当前创建的实例
		this.dataset = {}, //数据集,用于当前播放器内部的一些全局变量存储，
		/**
		 * 对外提供的播放事件
		 */
		this.eventList = [
			"inited",
			"play",
			"playing",
			"ended",
			"allended",
			"pause",
			"timeupdate",
			"getnext",
			"error",
			"stop",
			"fullscreen",
			"change",
			"write",
			"flashpopup",
			"getnextenable",
			"msg"
		];
		/**
		 * addParam可以接受的参数
		 */
		this.config = {};
		/**
		 * 劫持x.Player对象的公共方法列表，外壳播放器调用这些方法实际上调用的实际new出来的播放器实例
		 */
		this.hijackFun = [
			"getPlayer",
			"getCurVideo",
			"showPlayer",
			"hidePlayer",
			"play",
			"pause",
			"getPlaytime",
			"setPlaytime",
			"getPlayerType",
			"resize"
		];

		this.prototype = {};

		(function(me) { // 对外提供的公开方法
			var arr = ["init", "addParam", "write", "setPlayerReady"];
			arr = arr.concat(me.hijackFun);
			for (var i = 0, len = arr.length; i < len; i++) {
				me.prototype[arr[i]] = x.$.noop; // 设置为空函数
			}
		})(this);
		/**
		 * 向播放器传递config配置参数
		 *
		 * @public
		 */
		this.addParam = function(k, v) {
			this.config[k] = v;
		}
	}

	x.BasePlayer.prototype = {
		/**
		 * 设置当前播放视频对象
		 */
		setCurVideo: function(videoinfo) {
			// if (this.curVideo === null) {
			// 	this.curVideo = new x.VideoInfo();
			// }
			// if (videoinfo instanceof x.VideoInfo) {
			// 	videoinfo.clone(this.curVideo);
			// }
			this.curVideo = videoinfo;
		},
		getPlayer: function() {
			return null;
		},
		/**
		 * 获取当前传入的视频对象
		 *
		 * @ignore
		 */
		getCurVideo: function() {
			return this.curVideo;
		},

		/**
		 * 获取当前播放的视频vid，如果有多个视频，则返回第一个视频vid（主vid）
		 *
		 * @public
		 */
		getCurVid: function() {
			return (this.curVideo instanceof x.VideoInfo) ? this.curVideo.getVid() : "";
		},
		/**
		 * 获取当前播放的视频列表
		 *
		 * @public
		 */
		getCurVidList: function() {
			return (this.curVideo instanceof x.VideoInfo) ? this.curVideo.getVidList() : "";
		},

		/**
		 * 初始化
		 * @param  {[Object]} config 配置项
		 */
		init: function(config) {

			$.extend(this.config, config);

			// this.config.modWidth = this.config.modWidth || this.config.width;
			// this.config.modHeight = this.config.modHeight || this.config.height;

			for (var i = 0, len = this.eventList.length; i < len; i++) {
				var evtName = "on" + this.eventList[i];
				this[evtName] = $.isFunction(this.config[evtName]) ? this.config[evtName] : x.$.noop;
			}

			this.setCurVideo(this.config.video);
			this.write(this.config.modId);
		},
		/**
		 * 输出播放器
		 * @param  {[string]} id DOM结构id
		 */
		write: function(id) {
			$("#" + id).html("here is player of base");
		},
		/**
		 * 日志接口
		 * @param  {string} msg 日志正文
		 */
		log: function(msg) {
			if (window.console) {
				window.console.log(msg);
			}
		},

		/**
		 * 获得事件回调函数
		 * @param  {[type]} eventName [description]
		 * @return {[type]}           [description]
		 */
		getCBEvent: function(eventName) {
			var fn = undefined;
			//看看外壳对象是否有定义自定义的事件回调
			//这一般是创建完播放器以后player.onwrite=function(){}传入
			if (this.instance && $.isFunction(this.instance[eventName]) && this.instance[eventName] != x.$.noop) {
				fn = this.instance[eventName];
			}
			//如果当前对象定义了自定义的对应事件回调，并且不是默认的空函数，则优先执行
			//一般是由player.create({onwrite:function(){code here}})初始化时传入
			else if ($.isFunction(this[eventName]) && this[eventName] != x.$.noop) {
				fn = this[eventName];
			}
			return fn;
		},
		/**
		 * 调用事件回调
		 * @param  {[type]} eventName [description]
		 * @return {[type]}          [description]
		 */
		callCBEvent: function(eventName) {
			var fn = this.getCBEvent(eventName);
			if ($.isFunction(fn)) {
				var args = Array.prototype.slice.call(arguments, 1);
				return fn.apply(this, args);
			}
			return undefined;
		},
		/**
		 * 重新设置播放器尺寸
		 * @param  {[type]} width  [description]
		 * @param  {[type]} height [description]
		 * @return {[type]}        [description]
		 */
		resize: function(width, height) {
			var playerobj = this.getPlayer();
			if (!playerobj) return;
			playerobj.style.width = $.formatSize(width);
			playerobj.style.height = $.formatSize(height);
		},
		/**
		 * 显示播放器
		 */
		showPlayer: function() {
			var p = this.getPlayer();
			if (!p) return;
			p.style.position = "relative"
			p.style.left = "0px";

		},
		/**
		 * 隐藏播放器
		 * @return {[type]} [description]
		 */
		hidePlayer: function() {
			var p = this.getPlayer();
			if (!p) return;
			p.style.position = "static"
			p.style.left = "-200%";
		}
	}

})(x, x.$);