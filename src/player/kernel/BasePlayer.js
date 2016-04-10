/*
* @Author: xilie
* @Date:   2016-04-11 00:29:56
* @Last Modified by:   xilie
* @Last Modified time: 2016-04-11 02:02:37
*/

/**
 * @fileOverview 播放器基类
 */

class BasePlayer {
	constructor () {
		this.modId = ""
		this.$mod = null //显示整个统一播放器输出内容的容器，$查询结果
		this.$videomod = null //仅播放器的容器
		this.playerid = "" // 当前实例
		this.curVideo = null // 视频对象
		this.curVid = "" //当前播放的视频vid
		this.instance = null //当前创建的实例
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
			"getnextenable",
			"msg"
		]
		/**
		 * addParam可以接受的参数
		 */
		this.config = {}
		/**
		 * 劫持Player对象的公共方法列表，外壳播放器调用这些方法实际上调用的实际new出来的播放器实例
		 */
		this.hijackFun = [
			"init",
			"addParam",
			"write",
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
		]
	}

	addParam (k, v) {
		this.config[k] = v
	}
	/**
	 * 设置当前播放视频对象
	 */
	setCurVideo (videoinfo) {
		this.curVideo = videoinfo
	}
	/**
	 * 获取当前传入的视频对象
	 *
	 */
	getCurVideo () {
		return this.curVideo
	}

	getPlayer () {
		return null
	}

	getCurVid () {

	}

	getCurVidList () {

	}

	init (config) {
		_.extend(this.config, config)
		this.eventList.forEach(name => {
			let evtName = "on" + name
			this[evtName] = _.isFunction(this.config[evtName]) ? this.config[evtName] : _.noop
		})
		this.setCurVideo(this.config.video)
		this.write(this.config.modId)
	}

	write (id) {
		this.$mod.innerHTML = 'here is player of base'
	}

	log (msg) {

	}

	/**
	 * 获得事件回调函数
	 */
	getCBEvent (eventName) {
		let fn = undefined
		//看看外壳对象是否有定义自定义的事件回调
		//这一般是创建完播放器以后player.onwrite=function(){}传入
		if (this.instance && _.isFunction(this.instance[eventName]) && this.instance[eventName] != _.noop) {
			fn = this.instance[eventName]
		}
		//如果当前对象定义了自定义的对应事件回调，并且不是默认的空函数，则优先执行
		//一般是由player.create({onwrite:function(){code here}})初始化时传入
		else if (_.isFunction(this[eventName]) && this[eventName] != _.noop) {
			fn = this[eventName]
		}

		return fn
	}

	/**
	 * 调用事件回调
	 */
	callCBEvent (eventName) {
		let fn = this.getCBEvent(eventName)
		if (_.isFunction(fn)) {
			let args = Array.prototype.slice.call(arguments, 1)
			return fn.apply(this, args)
		}
		return undefined
	}

	/**
	 * 重新设置播放器尺寸
	 * @param  {[type]} width  [description]
	 * @param  {[type]} height [description]
	 */
	resize (width, height) {
		let playerobj = this.getPlayer()
		if (!playerobj) return
		playerobj.style.width = _.formatSize(width)
		playerobj.style.height = _.formatSize(height)
	}

	/**
	 * 显示播放器
	 */
	showPlayer () {
		let playerobj = this.getPlayer()
		if (!playerobj) return
		playerobj.style.position = "relative"
		playerobj.style.left = "0px"
	}
	/**
	 * 隐藏播放器
	 * @return {[type]} [description]
	 */
	hidePlayer () {
		let playerobj = this.getPlayer()
		if (!playerobj) return
		playerobj.style.position = "static"
		playerobj.style.left = "-200%"
	}
}

