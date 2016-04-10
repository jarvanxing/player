/**
 * @fileoverview 统一播放器默认配置
 *
 */

/**
 * 统一播放器参数值定义
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
 * 统一播放器默认配置
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
	 * 专辑id
	 * @type {String}
	 */
	coverId: "",

	/**
	 * 分类id
	 * @type {Number}
	 */
	typeId: 0,

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
	playerType: "auto",

	/**
	 * loading动画的swf地址
	 * @type {String}
	 */
	loadingswf: "",

	// *
	//  * 是否是付费模式
	//  * @type {Boolean}

	// isPay: false,

	/**
	 * 广告订单id
	 * @type {String}
	 */
	oid: "",

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

	//==========================================================================

	/**
	 * flash播放器的wmode
	 * @type {String}
	 */
	flashWmode: "direct",

	/**
	 * flash点播播放器地址
	 * @type {String}
	 */
	vodFlashUrl: "",

	/**
	 * flash点播播放器类型
	 * @type {String}
	 */
	vodFlashType: "TPout",

	/**
	 * flash点播播放器扩展flashvars参数
	 * @type {Object}
	 */
	vodFlashExtVars: {},

	/**
	 * 点播flash播放器listtype参数
	 * @type {Number}
	 */
	vodFlashListType: 2,

	/**
	 * flash点播播放器皮肤地址
	 * @type {String}
	 */
	vodFlashSkin: "",

	/**
	 * flash点播播放器是否出现设置按钮
	 * @type {Boolean}
	 */
	isVodFlashShowCfg: true,

	/**
	 * flash点播播放器播放结束出现结束推荐
	 * @type {Boolean}
	 */
	isVodFlashShowEnd: true,


	/**
	 * flash点播播放器是否出现搜索框
	 * @type {Boolean}
	 */
	isVodFlashShowSearchBar: true,


	/**
	 * flash点播播放器是否出现“下一个视频”按钮
	 * @type {Boolean}
	 */
	isVodFlashShowNextBtn: true,


	/**
	 * 直播播放器swf的url地址
	 * @type {String}
	 */
	liveFlashUrl: "",

	/**
	 * 直播播放器类型
	 * @type {String}
	 */
	liveFlashSwfType: "TencentPlayerLive",

	/**
	 * 直播播放器是否显示设置按钮
	 * @type {Boolean}
	 */
	isLiveFlashShowConfigBtn: true,


	/**
	 * 直播播放器是否显示全屏按钮
	 * @type {Boolean}
	 */
	isLiveflashShowFullBtn: true,


	/**
	 * 直播播放器是否显示配置菜单
	 * @type {Boolean}
	 */
	isLiveFlashShowCfg: true,

	/**
	 * 直播播放器右上角水印图片
	 * @type {String}
	 */
	liveFlashWatermark: "",

	/**
	 * 直播播放器皮肤类型，不传入则flash播放器内部会默认为live
	 * weidiantai:微电台，weidianshi:微电视，live:腾讯直播，inlive:公司内部直播
	 * @type {String}
	 */
	liveFlashAppType: "",

	/**
	 * 直播播放器扩展flashvars
	 * @type {Object}
	 */
	liveFlashExtVars: {},
	//============================== 控件配置 =================================

	/**
	 * 控件控制栏地址
	 * @type {String}
	 */
	ocxControlBar: "",

	/**
	 * 控件控制栏高度
	 * @type {Number}
	 */
	ocxControlHeight: 60,

	/**
	 * 控件皮肤
	 * @type {String}
	 */
	ocxSkin: "",

	/**
	 * 控件播放器暂停的时候是否在画面上显示暂停按钮
	 * @type {Boolean}
	 */
	isOcxShowPauseBtn: false,

	/**
	 * 控件是否隐藏控制栏
	 * @type {Boolean}
	 */
	isOcxHideControl: false,

	//========================插件配置=============================

	/**
	 * 使用插件列表，如果配置在这里那么会在write之后自动调用这里列出的插件
	 * 当然，用户自己写的插件也可以不用列在这里，直接在外部调用player.[pluginname]即可
	 * 目前（2013-09-30）官方插件就一个下载app的底部banner
	 * @type {Array}
	 */
	plugins: {
		/**
		 * 是否显示下载App的Banner
		 * @type {Boolean}
		 */
		AppBanner: false,
		/**
		 * 是否在暂停/结束后显示下载App的Banner和微信推荐视频
		 * @type {Boolean}
		 */
		AppRecommend: false,
		/**
		 * [是否在暂停时在画面底部浮出appbanner]
		 * @type {Boolean}
		 */
		AppDownloadOnPause: false
	},

	/**
	 * 插件JS存放路径，key是插件名，value是插件的JS路径，跟下面的libpath组合成完成的URL地址
	 * 如果定义了这里的路径，那么会异步加载，否则会探测当前页面是否有对应的build+插件名的函数
	 * @type {Object}
	 */
	pluginUrl: {
		"AppBanner": "js/plugins/appbanner.js?v=20140114",
		"AppRecommend": "js/plugins/apprecommend.js?v=20140114",
		"AppDownloadOnPause": "js/plugins/appdownloadonpause.js?v=20140110"
	},

	/**
	 * css存放根目录
	 * @type {string}
	 */
	cssPath: "http://imgcache.gtimg.cn/tencentvideo_v1/vstyle/mobile/v2/style/",
	/**
	 * 插件css存放路径，key是插件名，value是插件的JS路径，跟上面的cssPath组合成完成的URL地址
	 * 插件的css地址都只从这里找
	 * @type {Object}
	 */
	pluginCssUrl: {
		"AppRecommend": "player_plugins_apprecommend.css?v=20131127",
		"AppDownloadOnPause": "player_plugins_appdownloadonpause.css?v=20131211"
	},
	/**
	 * 统一播放器框架的存放路径
	 * @type {String}
	 */
	libpath: "http://qzs.qq.com/tencentvideo_v1/x/"

};