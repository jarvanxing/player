/*
* @Author: xilie
* @Date:   2016-04-11 01:00:44
* @Last Modified by:   xilie
* @Last Modified time: 2016-04-11 03:24:27
*/

var _isInited = false
var curVid = ""
var pauseCheckTimer = null

class Html5Player extends BasePlayer {
	constructor (props) {
		super(props)
		this.videoTag = null, // <video>标签对象
		this.$video = null
		this.protectedFn = {}
		this.h5EvtAdapter = {}
		this.eventList = this.eventList.concat(["html5error"])
		this.html5AttrList = {
			/**
			 * 自动播放
			 */
			"autoplay": "autoplay",
			/**
			 * 支持AirPlay
			 */
			"x-webkit-airplay": "isHtml5UseAirPlay"
		}
	}

	getPlayer () {
		return this.videoTag
	}

	getPlayerType () {
		return "html5"
	}

	createVideoHtml () {
		this.playerid = this.config.playerid
		if (!this.playerid) {
			this.playerid = 'player_' + UUID()
		}

		let str = `<video id="${this.playerid}" width="100%" height="100%" `

		//本身ios不允许div浮层罩在video标签上方，否则只能看到浮层但无法点击
		//在iPad上可以禁止control属性，这样就可以点击了。
		//但这招对iPhone无效，应该是iPhone播放特性使然
		//解决的方案是先把播放器移到屏幕外比如-200%的地方，播放的时候iphone会自动将视频全屏播放，默认特性
		if ((Detector.os.iphone || Detector.os.ipod) && !! this.config.isIOSVideoOffset) {
			str += 'style="position:absolute;left:-200%"'
		}

		for (let p in this.html5AttrList) {
			str += " "
			let cfgKey = this.html5AttrList[p]
			let cfgVal = ""
			if (cfgKey == "") {
				cfgVal = ""
			} else {
				if (!(cfgKey in this.config)) continue //给的配置在全局配置项里根本就没有对应的属性值，鬼知道该输出啥，跳过
				cfgVal = this.config[cfgKey]
			}
			if (cfgVal === false || cfgVal == "disabled" || cfgVal === 0) continue
			str += p
			if (p == "autoplay" && cfgVal == true) {
				str += '="autoplay"'
				continue
			}
			if (cfgVal != "") {
				str += ['=', cfgVal].join("")
			}
		}

		str += "></video>"
		return str
	}

	write (modId) {
		let el = null
		if (_.type(modId) === "object" && modId.nodeType === 1) {
			el = modId
			this.$mod = el
			this.modId = el.getAttribute('id')
		} else {
			el = Util.getByID(modId)
			this.modId = modId
			this.$mod = el
		}

		if (!el) return

		let htmlBuf = this.createVideoHtml()
		let videoModId = "mod_" + this.playerid
		el.innerHTML = `<div id="${videoModId}">${htmlBuf}</div>`
		this.$videomod = Util.getByID(videoModId)
		this.$videomod.size()
		this.videoTag = _.getByID(this.playerid)
		this.$video = $(this.videoTag);
		this.registerMonitor()
		this.bindEventAdapt()
		this.registerPlugins()
		this.callProtectFn("onwrite")
		this.play(this.curVideo, this.config.autoplay)
	}
	/**
	 * 显示播放器播放出错
	 * @param  {Number} errcode 错误码
	 * @param  {Number} errcontent 错误码详细错误内容
	 * @param  {string} errMsg  错误描述
	 */
	showError (errcode, errcontent, errMsg) {
		/*
			延迟不可去掉，因为页面刷新的时候由于网络传输会被各种abort导致错误
			如果不延迟会导致刷新的时候立即显示错误，体验不好，容易引起误解
		*/
		setTimeout(() => {
			let fn = this.getCBEvent("showError")
			if (_.isFunction(fn) && fn != this.showError) {
				fn.call(this, errcode, errcontent, errMsg)
			} else if (_.isFunction(this.config["showError"])) {
				this.config["showError"].call(this, errcode, errcontent, errMsg)
			} else {
				let str = html5skin.defaultError
				let tipsId = this.playerid + "_errtips_inner"
				errcontent = errcontent || ""
				str = str.replace("$ERROR-TIPS-INNER$", tipsId)
					.replace("$ERROR-MSG$", (errMsg || html5lang.getErrMsg(errcode, errcontent) || "播放视频出错"))
					.replace("$ERROR-DETAIL$", !! errcontent ? ("错误码:" + errcode + "(" + errcontent + ")") : "")
				this.$videomod.innerHTML = str
			}
		}, 250)

		//相应onerror事件
		this.callCBEvent("onerror", errcode, errcontent)
	}
	/**
	 * 是否使用了自定义的HTML5播放器的某个特性
	 * @param  {type}    fName [description]
	 * @return {Boolean}       [description]
	 */
	isUseH5UIFeature (fName) {
		return this.config.html5VodUIFeature.indexOf(fName) > -1
	}
	/**
	 * 是否禁止了自定义的HTML5播放器的某个特性
	 * @param  {[type]}  fName [description]
	 * @return {Boolean}       [description]
	 */
	isForbiddenH5UIFeature (fName) {
		return this.config.html5ForbiddenUIFeature.indexOf(fName) > -1
	}
	/**
	 * 注册数据上报监听
	 */
	registerMonitor () {
		let fn = this.protectedFn['buildmonitor']
		if (_.isFunction(fn) {
			fn.call(this)
		}
	}
	hideControl () {
		// this.control.hide()
	}
	showControl () {
		// this.control.show()
	}

	seek (time) {
		// 时间，必须确保这是数值类型
		if (isNaN(time)) return
		time = Math.min(time, this.getDuration() - 5)
		time = Math.max(time, 0)
		let seekTimer = null
		if (seekTimer) {
			clearTimeout(seekTimer)
			seekTimer = null
		}

		let seeks = this.videoTag.seekable
		if (seeks.length === 1 && time < seeks.end(0)) {
			this.seekTo(time)
		} else {
			seekTimer = setTimeout(() => {
				this.seek(time)
			}, 100)
		}
	}

	seekTo (time) {
		try {
			this.videoTag.currentTime = time
			this.videoTag.paused && this.videoTag.play()
		} catch (e) {
			this.$video.one("canplay", e => {
				this.videoTag.currentTime = time
				this.videoTag.paused && this.videoTag.play()
			})
		}
	}
	/**
	 * 获取当前播放的时间
	 * @return {[type]} [description]
	 */
	getCurTime () {
		return this.videoTag.currentTime
	}
	/**
	 * 设置播放时间
	 * @param {[type]} time [description]
	 */
	setCurtime: function(time) {
		this.seek(time)
	}
	/**
	 * 循环检查是否开始播放了
	 * @param  {[type]} times [description]
	 * @return {[type]}       [description]
	 */
	checkIsPlayingLoop (times) {
		times = times || 0
		if (!!this.playinglooptimer) clearTimeout(this.playinglooptimer)
		if (this.videoTag.currentTime === 0 && times <= 30) {
			this.videoTag.load()
			this.videoTag.play()
			this.playinglooptimer = setTimeout(() => {
				this.checkIsPlayingLoop(++times)
			}, 1000)
		}
	}
	setPoster () { }

	hidePoster () { }
	/**
	 * 获取总时长
	 * @return {Number} 返回总时长
	 */
	getDuration () {
		let dur = this.curVideo.getDuration()
		if (!isNaN(dur) && dur > 0) {
			return dur
		}
		return this.videoTag.duration
	}
	// 确保不会中途卡死，导致无法操作
	checkPause () {
		let _timelist = []
		pauseCheckTimer = setInterval((e) => {
			if (this.videoTag.paused) {
				return
			}
			_timelist.push(t.videoTag.currentTime)
			if (_timelist.length >= 2) {
				if (Math.abs(_timelist[0] - _timelist[1]) === 0) {
					if (!!pauseCheckTimer) {
						clearInterval(pauseCheckTimer)
						_timelist = []
						this.videoTag.load()
						this.videoTag.play()
					}
				} else if (pauseCheckTimer) {
					clearInterval(pauseCheckTimer)
				}
				_timelist = []
			}
		}, 500)
	}

	pause () {
		this.videoTag.pause()
	}
}

