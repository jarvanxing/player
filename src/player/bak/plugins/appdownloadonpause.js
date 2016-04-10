/**
 * @fileOverview  移动端暂停/结束时显示App下载提示banner和微信推荐视频
 * @author jarvanxing
 * @copyright TencentVideo Web Front-end Team
 */


;
(function(x, $) {
	var g_cfg = {
		pluginName:'AppDownloadOnPause',
		text: "查看公众号更多视频",
		posterTpl:'<div class="x_overlay_poster"><img class="x_poster_img" /></div>',
		bigPlayTpl:'<div style="z-index:10" class="x_overlay_play"><span class="x_button_play"></span></div>',
		bannerTpl:[
			'<div data-role="box" class="x_app_download" style="display:none">',
			'   <a data-role="a" class="x_download_app" href="${url}" ${iframe}>',
			'		<i class="x_icon_logo"></i>',
			'		<span class="x_download_app_wording"><span class="x_download_app_title">${text1}</span><span class="x_download_app_desc">${text}</span></span>',
			'		<span class="x_app_btn_em">${btnText}</span>',
			'	</a>',
			'</div>'
		].join('')
	};

	//var mione = navigator.userAgent.indexOf('MI-ONE')>-1;
		
	$.extend($, {
		createAppDownloadOnPause: function(config) {
			var t = config.t,
				layer = t.$UILayer||t.$videomod,
				$video = t.$video,
				videoTag = $video[0],
				//controlBox = layer.find('.x_controls'),
				shadow = null,
				curl = window != top ? document.referrer : document.location.href,
				url = t.config.libpath + t.config.pluginUrl['AppBanner'],
				eventType = $.os.hasTouch?'touchend':'click',
				bannerid = "x_appbanner_" + t.playerid,
				bannerBox = null,
				bigPlay=null,			
				//ios直接从全屏切回普通状态时，currentTime总是为0,
				//此处自己根据timeupdate记录当前播放时间
				currentTime = 0,
				showTimer = null,				
				//当前视频vid
				curvid = t.curVideo.getVid(),
				//当前视频拿到的截图,在ios暂停的时候填上
				curPoster = 'http://shp.qpic.cn/qqvideo_ori/0/'+curvid+'_496_280/0',
				curPosterBox = null,
				pausetime = config.pausetime?parseInt(config.pausetime):30,
				//banner上报的参数,因为此处只有在推荐显示时才上报banner曝光
				appBannerReportParams = "";	
			if($.browser.WeChat){
				config.downloadUrl = "http://mcgi.v.qq.com/commdatav2?cmd=4&confid=231&platform=aphone";
			}

			function init(){
				fixUI();
				fixBigPlay();
				loadCss(function(){
					fillBanner();					
				});
				
			}

			function fixUI(){
				//没有用h5皮肤时
				if(!t.$UILayer){
					layer.addClass('x_container');
					shadow = layer.find('.x_shadow');
					if(!shadow.length){
						shadow = $('<div class="x_shadow"></div>').appendTo(layer);
						shadow.hide();
					}
					if (!x.common.isSupportSVG()) {
						t.$mod.addClass('x_no_svg');
					}					
				}
				bannerBox = $('<div style="-webkit-transition-duration:500ms;transition-duration:500ms;position:absolute;bottom:-55px;width:100%;height:55px;z-index:10;" id="' + bannerid + '"></div>').appendTo(layer);
				bannerBox.hide();
				curPosterBox = $(g_cfg.posterTpl).appendTo(layer);
				curPosterBox.find('img').attr('src',curPoster);
				curPosterBox.hide();

			}

			function fixBigPlay(){
				bigPlay = $(g_cfg.bigPlayTpl).appendTo(layer);
				bigPlay.hide();
				bigPlay.on(eventType,function(){
					setTimeout(function(){
						videoTag.play();
					},400);
				});
			}			


			function initEvent(){

				$video.on('pause paused',function(e){
					//$('body').append('<div>pause</div>');
					//如果当前是正在拖动控制栏，也会触发pause
					if ( !! t.isTouching) {
						return;
					}
					var duration = parseInt(t.getDuration());	
					var curTime = parseInt($.os.iphone?currentTime:videoTag.currentTime);
					//只有最后5s才显示广告
					if(curTime > (pausetime-1) && (duration-curTime) > 5){
						//$('body').append('<div>pausetime</div>');
						fixShow(1);
						return;
					}
				});	

				$video.on('timeupdate',function(){
					//ios在非用户主动触发暂停结束事件时会自动把currentTime设为0.......
					if(videoTag.currentTime){
						currentTime = videoTag.currentTime;
					}
				});			

				
				$video.on('play playing',function(){
					//$('body').append('<div>play</div>');
					fixShow(0);					
				});
							
			}

			function hidePlayer(){
				videoTag.style.position = "absolute";
				videoTag.style.top = '-200%';
				//QQ浏览器下得使这招才有效
				if($.browser.MQQ){
					videoTag.height = 1;	
				}
							
			}

			function showPlayer(){
				videoTag.style.position = "static";
				videoTag.style.top = '0';
				if($.browser.MQQ){
					videoTag.height = layer.height();	
				}
			}


			function fixShow(isShow){
				if(isShow){	
					clearTimeout(showTimer);
					showTimer = setTimeout(function(){
						//没有用h5皮肤时
						if(!t.$UILayer){
							layer.addClass('x_finished x_onpause');
							shadow.show();
						}
						bigPlay.show();
						//controlBox.hide();
						hidePlayer();
						curPosterBox.show();
						
						bannerBox.show().css({
							"transform":"translateY(-55px)",
							"-webkit-transform":"translateY(-55px)"
						});
						//微信banner暂停上报
						x.report(appBannerReportParams);						
					},800);
			
				}else{
					clearTimeout(showTimer);
					showTimer = setTimeout(function(){
						//controlBox.show();
						showPlayer();
						bannerBox.css({
							"transform":"translateY(0)",
							"-webkit-transform":"translateY(0)"
						});
						setTimeout(function(){
							bannerBox.hide();
						},500);					
						//没有用h5皮肤时
						if(!t.$UILayer){
							layer.removeClass('x_finished x_onpause');
							setTimeout(function(){
								shadow.hide();
							},500);
						}					
						bigPlay.hide();	
						curPosterBox.hide();							
					},800);							
				}
			}

			function loadCss(cb){
				$.loadPluginCss(g_cfg.pluginName).done(cb);
			}


			/**
			 * [getAppBanner 加载appBanner]
			 * @return {[type]} [description]
			 */
			function getAppBanner(){
				var defer = $.Deferred();
				if($.createAppBanner){
					defer.resolve();
				}else{
					$.getScript(url,function(){
						defer.resolve();
					});					
				}

				return defer;
			}

			function getPausetime(cb){
					$.ajax({
						url: "http://sns.video.qq.com/fcgi-bin/dlib/dataout_ex?auto_id=1026&otype=json",
						dataType: "jsonp"
					}).done(function(data) {
						if(data && data.time){
							pausetime = parseInt(data.time);
						}
						cb();
					}).fail(function() {
						cb();
					});					
			}

			/**
			 * [fillBanner 初始化banner提示]
			 * @return {[type]} [description]
			 */
			function fillBanner(){

				getAppBanner().done(function(){
					$.createAppBanner({
						text:config.text,
						defaultText:g_cfg.text,
						//禁止appbanner插件使用自己默认的style
						style:'none',
						//禁止appbanner自动上报曝光
						isAutoReport:false,							
						vid:curvid,	
						downloadUrl:config.downloadUrl,
						reportParams:{int2:2},				
						tpl: g_cfg.bannerTpl,
						modId:bannerid						
					}).done(function(result){
						appBannerReportParams = result;
						appBannerReportParams.int2 = 2;
						getPausetime(initEvent);
					});										
				});
			}


			init();

	
		}
	});
})(x, x.$);


;
(function(x, $) {
	$.extend(x.Player.fn, {
		/**
		 * 创建暂停后的banner提示
		 */
		buildAppDownloadOnPause: function(config) {
			!config?config = {}:"";
			config.t = this;
			$.createAppDownloadOnPause(config);
		}
	});
})(x, x.$);