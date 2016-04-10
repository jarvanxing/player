/*
* @Author: xilie
* @Date:   2016-04-11 03:47:14
* @Last Modified by:   xilie
* @Last Modified time: 2016-04-11 04:12:39
*/

const defaultPrivData = {
	poster: "", //默认封面图
	prefix: 0, // 片头
	tail: 0, // 片尾
	tagStart: 0, // 看点开头
	tagEnd: 0, // 看点结尾
	duration: "",
	historyStart: 0, // 历史观看开始时间，这个参数设置了播放器会有提示“您上次观看到....“
	coverId: "", // 专辑id（可选）
	title: "", // 标题
	tstart: 0, // 历史观看时间，跟historyStart差不多，只是播放器不会有提示，一般用于回链播放
	vFormat: "",
	format: "auto", //默认的视频文件格式
	pid: "", //pid，每播放一次换一次
	rid: "" //请求server的rid，每次请求server换一次
}

/**
 * @fileOverview VideoInfo 视频对象
 */
class VideoInfo {
	constructor (props) {
		super(props)
		this.originVid = null
		this.vid = null
	}

	getVid () {
		return this.vid
	}

	setVid (vid) {
		if (!vid) {
			return
		}

		vid = Util.filterXSS(vid)
		this.clear()
		this.originVid = vid
		return this
	}

	getDuration () {}
	getTail () {}
	/**
	 * 获取视频结束点跟视频文件最后一帧的绝对值时间
	 */
	getEndOffset () {
		return this.getDuration() - this.getTail()
	}

	getTitle () {}
	/**
	 * 清除数据 还原状态
	 *
	 * @public
	 */
	clear () {}

	/**
	 * 克隆，复制对象
	 */
	clone (obj) {}

	/**
	 * 获取缩略图地址
	 */
	getVideoSnap () {}
	/**
	 * 获取MP4文件地址
	 */
	getMP4Url () {}

	getHLS () {}
	/**
	 * 获取正在播放的清晰度
	 * @return {[type]} [description]
	 */
	getPlayFormat () {}

	/**
	 * 获取当前视频软字幕语言列表
	 * @return {[type]} [description]
	 */
	getSrtLangList () {}

	/**
	 * 获取指定软字幕的URL列表
	 * @param  {[type]} sflobj [description]
	 * @return {[type]}        [description]
	 */
	getSrtUrlList () {}

	/**
	 * 获取当前视频支持的格式
	 * @return {Array} 当前视频支持的格式
	 */
	getFormatList () {}

	/**
	 * 当前视频文件是否是有硬字幕
	 * @return {Boolean} [description]
	 */
	hasHardSubtitle () {}

	/**
	 * 当前视频文件是否包含软字幕
	 * @return {Boolean} [description]
	 */
	hasSoftSubtitle () {}
}

