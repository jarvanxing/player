/**
 * @fileoverview 播放器默认配置
 *
 */

/**
 * 播放器参数值定义
 * @namespace x.PLAYER_DEFINE
 * @type {Object}
 * @ignore
 */
x.PLAYER_DEFINE = {
	/**
	 * 直播
	 * @default 1
	 * @type {Number}
	 */
	LIVE: 1,
	/**
	 * 点播
	 * @default 2
	 */
	VOD: 2

};

/**
 * 播放器默认配置
 * @namespace x.defaultConfig
 * @type {Object}
 */
x.defaultConfig = {

	//========================= 公共配置开始 ======================
	//
	// /**
	//  * 播放器容器宽度
	//  * @type {Number}
	//  */
	// modWidth: 0,
	// /**
	//  * 播放器容器高度
	//  * @type {Number}
	//  */
	// modHeight: 0,
	/**
	 * 默认的视频镀锡i昂
	 * @type {x.VideoInfo}
	 */
	video: null,
	/**
	 * 默认宽度，单位像素
	 * @type {Number}
	 */
	width: 600,
	/**
	 * 默认高度，单位像素
	 * @type {Number}
	 */
	height: 450,
	/**
	 * 是否自动播放
	 * 2013年12月2日 更改默认属性为false，大多数场景都是不需要自动播放的
	 * @type {Boolean}
	 */
	autoplay: false,

	/**
	 * 是否静音
	 * @type {Boolean}
	 */
	mute: false,

	/**
	 * 默认音量
	 * @type {Number}
	 */
	volume: 50,
	/**
	 * 默认的DOM元素ID
	 * @type {String}
	 */
	modId: "mod_player",

	/**
	 * 播放器id，不指定的话系统会自动分配一个，一般不需要配置
	 * @type {String}
	 */
	playerid: "",

	/**
	 * 默认loading图片
	 * @type {String}
	 */
	pic: "",

	/**
	 * 播放器类别
	 * @type {Number}
	 */
	type: x.PLAYER_DEFINE.VOD,

	/**
	 * 播放器类别
	 * @type {String}
	 */
	playerType: "html5",

	/**
	 * 是否显示分享
	 * @type {String}
	 */
	share: true,

	//========================= 公共配置结束 ======================

	isHtml5UseHLS: "auto",
	/**
	 * HTML5播放器是否使用autobuffer属性
	 * @type {Boolean}
	 */
	isHtml5AutoBuffer: false,
	/**
	 * HTML5播放器是否使用Airplay功能，强烈建议开启
	 * @type {Boolean}
	 */
	isHtml5UseAirPlay: true,

	/**
	 * HTML5播放器是否一直显示控制栏
	 * @type {Boolean}
	 */
	isHtml5ControlAlwaysShow: false,

	/**
	 * HTML5播放器preload属性
	 * @type {String}
	 */
	html5Preload: "null",
	/**
	 * HTML5点播播放器UI组件
	 * @type {Array}
	 */
	html5VodUIFeature: [
		'controlbar',
		'tips',
		'title',
		'playpause',
		'progress',
		'timepanel',
		'definition',
		'fullscreen',
		"overlay",
		"bigben",
		"posterlayer",
		"shadow",
		"promotion"
	],

	/**
	 * HTML5直播播放器UI组件
	 * @type {Array}
	 */
	html5LiveUIFeature: [
		'controlbar',
		'tips',
		'playpause',
		'fullscreen',
		"overlay",
		"posterlayer",
		"shadow"
	],

	/**
	 * HTML5UI组件功能异步加载JS配置，有些组件由于不是必须，而代码量又很大，所以采用按需加载
	 * 配置是JSON格式，key是组件名，value是异步加载的JS文件路径
	 * @type {Object}
	 */
	html5FeatureExtJS: {
		// "track": "/js/widgets/h5_track.js"
	},

	/**
	 * HTML5播放器UI需要关闭的功能，跟上述的配置相反，这里列出的功能就不会展现
	 * @type {Array}
	 */
	html5ForbiddenUIFeature: [],

	/**
	 * HTML5播放器是否使用自设计的控制栏
	 * @type {Boolean}
	 */
	isHtml5UseUI: false,

	/**
	 * HTML5播放器自定义UI的CSS文件地址
	 * @type {[type]}
	 */
	HTML5CSSName: "",

	/**
	 * HTML5播放开始的时候是否显示poster
	 * @type {Boolean}
	 */
	isHtml5ShowPosterOnStart: true,
	/**
	 * HTML5播放器播放完毕是否显示poster
	 * @type {Boolean}
	 */
	isHtml5ShowPosterOnEnd: false,

	/**
	 * HTML5播放器切换视频的时候是否要显示Poster
	 * @type {Boolean}
	 */
	isHtml5ShowPosterOnChange: true,

	/**
	 * iPhone在暂停的时候是否显示Poster层
	 * @type {Boolean}
	 */
	isiPhoneShowPosterOnPause: true,

	/**
	 * 暂停的时候是否显示播放按钮
	 * @type {Boolean}
	 */
	isHtml5ShowPlayBtnOnPause: true,

	/**
	 * 是否强制使用伪全屏
	 * @type {Boolean}
	 */
	isHtml5UseFakeFullScreen: true,

	/**
	 * ios系统播放器是否需要做偏移
	 * @type {Boolean}
	 */
	isIOSVideoOffset: true,


	//========================插件配置=============================

	/**
	 * 使用插件列表，如果配置在这里那么会在write之后自动调用这里列出的插件
	 * 当然，用户自己写的插件也可以不用列在这里，直接在外部调用player.[pluginname]即可
	 * 目前（2013-09-30）官方插件就一个下载app的底部banner
	 * @type {Array}
	 */
	plugins: {
		/**
		 * 结束推荐
		 * @type {Boolean}
		 */
		Recommend: false
	}
};