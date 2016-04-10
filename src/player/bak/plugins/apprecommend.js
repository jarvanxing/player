/**
 * @fileOverview  移动端暂停/结束时显示App下载提示banner和微信推荐视频
 * @author jarvanxing
 * @copyright TencentVideo Web Front-end Team
 */



;
(function(x, $) {
	var g_cfg = {
		pluginName:'AppRecommend',
		text: "查看公众号更多视频",
		picCgi:'http://sns.video.qq.com/fcgi-bin/rmd_weixin',
		replayTpl:'<div data-role="replay" class="x_replay"><i class="x_icon_replay"></i>重新播放</div>',
		picTpl:'<ul data-role="recommend" class="x_related_list"></ul>',
		picItemTpl:[
			'	<li class="x_item">',
			'		<a ${iframe} data-role="cmtVideo" href="#" data-vid="${id}" class="x_related_link"><img class="x_figure" src="${picurl}" /><strong class="x_title">${title}</strong></a>',
			'	</li>'
		].join(''),
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

	function format(str, obj) {
		if (!str || $.type(obj) !== 'object') return;
		for (var key in obj) {
			str = str.replace('${' + key + '}', obj[key]);
		}
		return str;
	}

	$.extend($, {
		createAppRecommend: function(config) {
			var t = config.t,
				layer = t.$UILayer||t.$videomod,
				$video = t.$video,
				videoTag = $video[0],
				relateid = "x_related_" + t.playerid,
				relateBox = null,
				replay=null,
				shadow = null,
				$control = layer.find('.x_controls'),
				$pauseBtn = layer.find('.x_playpause_button'),
				curl = window != top ? document.referrer : document.location.href,
				url = t.config.libpath + t.config.pluginUrl['AppBanner'],
				eventType = $.os.hasTouch?'touchend':'click',
				//ios直接从全屏切回普通状态时，currentTime总是为0,
				//此处自己根据timeupdate记录当前播放时间
				currentTime = 0,				
				//微信公众账号id
				biz=config.biz,
				appid = "",
				replayClicked = false,
				//banner上报的参数,因为此处只有在推荐显示时才上报banner曝光
				appBannerReportParams = "",
				//当前视频vid
				curvid = t.curVideo.getVid(),
				//是否已经进行了曝光上报
				isShowReport = false,
				//拿到推荐列表后返回的算法id参数,好上报
				reportParams = "",
				//微信推荐热门视频vid集合
				vidArray = [];	
			if($.browser.WeChat){
				config.downloadUrl = "http://mcgi.v.qq.com/commdatav2?cmd=4&confid=236&platform=aphone";
			}

			function init(){
				fixUI();
				fixReplay();
				fixRelatBox();
				fixParams();
				loadCss(function(){
					fillList();
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
					
				}				
			}


			function checkPause(time){
				var defer = $.Deferred(),
					t1 = videoTag.currentTime,
					t2 = 0,
					rs = false;
				setTimeout(function(){
					t2 = videoTag.currentTime;
					if(t2 == t1){
						rs = true;
					}
					defer.resolve(rs);
				},time||50);

				return defer;				
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
					if((duration-curTime) > 5){
						fixShow(0);
						return;
					}
					
					fixShow(1);	
				});	

				$video.on('timeupdate',function(){
					//ios在非用户主动触发暂停结束事件时会自动把currentTime设为0.......
					if(videoTag.currentTime){
						currentTime = videoTag.currentTime;
					}
				});			

				$video.on('ended',function(){
					//$('body').append('<div>ended</div>');
					fixShow(1);
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
					//不在全屏状态下显示
					// if(!t.checkIsFullScreen()){
					// 	return;
					// }
					//防止ios下video遮不住
					// if($.os.iphone){
					// 	hidePlayer();	
					// }
					hidePlayer();
									
					//没有用h5皮肤时
					if(!t.$UILayer){
						layer.addClass('x_finished');
						shadow.show();
					}

					relateBox.show();

					replay.show();
					//广告显示出来上报,只上报一次曝光
					if(vidArray.length>0 && !isShowReport){
						isShowReport = true;
						tjreport(curvid,0);
						//此时appbanner才显示,则进行曝光上报
						appBannerReportParams?x.report(appBannerReportParams):"";
					}				
			
				}else{

					if(!replayClicked){
						relateBox.hide();
						replay.hide();					
						//没有用h5皮肤时
						if(!t.$UILayer){
							layer.removeClass('x_finished');
							shadow.hide();
						}

						//广告隐藏后把video位置还原
						// if($.os.iphone){
						// 	showPlayer();	
						// }	
						showPlayer();	
					}										
				}
			}

			function loadCss(cb){
				$.loadPluginCss(g_cfg.pluginName).done(cb);
			}

			/**
			 * [fixReplay 填上重新播放按钮]
			 * @return {[type]} [description]
			 */
			function fixReplay(){
				replay = $(g_cfg.replayTpl).appendTo(layer);
				replay.hide();
				replay.on(eventType, function(e) {
					replayClicked = true;
					//最后5s的话直接重新播放
					if((parseInt(t.getDuration()) - parseInt(videoTag.currentTime))<6){
						videoTag.load();
					}
					setTimeout(function(){
						replayClicked = false;
						//$('body').append('<div>ended-PLAY</div>');
						videoTag.play();
					},500);
				});	
			}

			/**
			 * [fixRelatBox 先填上推荐视频的外层容器]
			 * @return {[type]} [description]
			 */
			function fixRelatBox(){
				relateBox = $('<div class="x_related" id="' + relateid + '"></div>').appendTo(layer);
				relateBox.hide();
			}

			/**
			 * [fillList 拉取填充微信推荐视频]
			 * @return {[type]} [description]
			 */
			function fillList(){
				relateBox.prepend(g_cfg.picTpl);

				$.ajax({
					url: g_cfg.picCgi,
					data:{
						otype:'json',
						size:config.size||2,
						playvid:curvid,
						account:biz
						//account:'MTE3MTE0NDg4MQ'
					},
					dataType: "jsonp",
					jsonCache: 600
				}).done(function(json){
					reportParams = json;
					if(json && json.videos && json.videos.length){
						var listbox = relateBox.find('[data-role=recommend]');
				
						var html = "";
						$.each(json.videos,function(i,obj){
							window!=top?obj.iframe = 'target="_parent"':obj.iframe="";
							html+=format(g_cfg.picItemTpl,obj);
							vidArray.push(obj.id);
							
						});
						listbox.html(html);
						fixVideoUrl();
						//有数据才处理事件显示
						initEvent();
					}
				}).fail(function(){

				});
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

			/**
			 * [fixUrl 根据是否安装app处理推荐视频的链接]
			 * @return {[type]} [description]
			 */
			function fixVideoUrl(){
				var a = relateBox.find('[data-role=cmtVideo]');
				getAppBanner().done(function(){
					$.createAppBannerResult({downloadUrl:config.downloadUrl}).done(function(rs){
						if(rs && rs.url){
							a.each(function(i,o){
								var href = rs.url.replace('${vid}',$(o).data('vid'));
								o.href = href+'&from='+appid+'&extend='+biz;
							});
						}				
					});					
				});

				a.on(eventType, function(e) {
					var vid = $(e.currentTarget).data('vid');
					tjreport(curvid,1,vid);
				});					
			}

			//微信热门推荐上报
			function tjreport(vid,action,_vid) {
				var int1 = reportParams&&reportParams.int1? reportParams.int1:640000;
				x.report({
					vid:vid,
					itype: 2,
					ctype: 10,
					cmd: action == 0 ? 1801 : 1802,
					int1:int1,
					int2:0,
					int3:0,
					val:1,
					str1:biz,
					val2:11,
					host:$.getHost(),
					str2:action == 0 ? vidArray.join('+'):_vid,
					_:new Date().getTime()
				});
			}

			/**
			 * [fixParams 拿到公众账号id]
			 * @return {[type]} [description]
			 */
			function fixParams(){

				function get(key){
					var v = $.getUrlParam(key,curl);
					if (v) {
						v = decodeURIComponent(v);
						v = $.filterXSS(v);
					}
					return v;
				}

				biz = biz || get('__biz');
				appid = appid || get('appmsgid');
		
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
						vid:curvid,	
						//禁止appbanner自动上报曝光
						isAutoReport:false,	
						//区分是微信结束推荐
						reportParams:{int2:1},	
						//微信结束下载url
						downloadUrl:config.downloadUrl,			
						tpl: g_cfg.bannerTpl,
						modId:relateid						
					}).done(function(result){
						appBannerReportParams = result;
						appBannerReportParams.int2 = 1;
						var a = relateBox.find('[data-role=a]');
						var href = a.attr('href');
						a.attr('href',href+='&from='+appid+'&extend='+biz);
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
		 * 创建暂停/结束后的推荐视频和banner
		 */
		buildAppRecommend: function(config) {
			!config?config = {}:"";
			config.t = this;
			$.createAppRecommend(config);

		}
	});
})(x, x.$);