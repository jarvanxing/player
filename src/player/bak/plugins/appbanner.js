/**
 * @fileOverview  移动端App下载提示banner
 * @author popotang
 * @copyright TencentVideo Web Front-end Team
 */


;
(function(x, $) {
	var g_cfg = {
		modId: "",
		vid: "",
		width: "100%",
		height: "57px",
		text1: '客户端',
		text: "可观看更多视频",
		btnText: ['安装', '打开', '升级'],
		style: '<style type="text/css">.x_download_app{overflow:hidden;margin:0px;height:55px;position:relative;background-color:#f8f7f5;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.1),inset 0 1px rgba(255,255,255,.26);-moz-box-shadow:0 1px 1px rgba(0,0,0,.1),inset 0 1px rgba(255,255,255,.26);box-shadow:0 1px 1px rgba(0,0,0,.1),inset 0 1px rgba(255,255,255,.26);border:1px solid #cbcbcb;}.x_mod_message{position:absolute;top:50%;left:50%;width:300px;height:160px;margin:-80px 0 0 -150px;text-align:center;z-index:1000}.x_mod_message a{color:#E0E0E0;text-decoration:underline}.x_mod_message a:hover{color:#f90}.x_mod_message h2{line-height:30px;margin:70px 0 0 0;padding:0;font-size:14px;font-weight:normal;color:#FB9100}.x_message_hack h2{margin-top:40px;}.x_fixRight{margin-right:0px;}.x_btn_download_app{color:#383838;text-decoration:none;display:block;height:100%;}.x_btn_download_text{vertical-align:middle;display:inline-block;color:#383838;text-shadow:0 1px #fff;font-size:14px;width:50%;margin-top:2px;}.x_btn_download_text p{margin:0;padding:0;line-height:18px;}.x_btn_download_btn{position:absolute;right:10px;top:12px;width:60px;height:30px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;background-color:#36383a;-webkit-box-shadow:0 2px 3px rgba(0,0,0,.2),inset 0 1px rgba(255,255,255,.2);-moz-box-shadow:0 2px 3px rgba(0,0,0,.2),inset 0 1px rgba(255,255,255,.2);box-shadow:0 2px 3px rgba(0,0,0,.2),inset 0 1px rgba(255,255,255,.2);border:solid 1px #1f2226;font-size:15px;color:#fff;text-shadow:0 1px 1px rgba(4,0,0,.24);text-align:center;line-height:30px;}.x_btn_download_icon{display:inline-block;vertical-align:middle;height:100%;}.x_btn_download_icon i{display:inline-block;margin:13px 5px 0 10px;width:32.5px;height:30px;background-repeat:no-repeat;background-size:contain;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAA8CAYAAAA5S9daAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQjU1NzJBNDExQUUxMUUzQTlGRjg1MjY1MkY3QzU5NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQjU1NzJBNTExQUUxMUUzQTlGRjg1MjY1MkY3QzU5NCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFCNTU3MkEyMTFBRTExRTNBOUZGODUyNjUyRjdDNTk0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFCNTU3MkEzMTFBRTExRTNBOUZGODUyNjUyRjdDNTk0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9wpGBwAACbpJREFUeNrUWw1w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)</style>',
		tpl:[
			'<div data-role="box" class="x_download_app" style="display:none">',
			'   <a data-role="a" class="x_btn_download_app" href="${url}" ${iframe}>',
			'		<div class="x_btn_download_icon">',
			'			<i></i>',
			'		</div>',
			'		<div class="x_btn_download_text"><p class="download_title">${text1}</p><p class="download_title">${text}</p></div>',
			'		<div class="x_btn_download_btn">',
			'			<span>${btnText}</span>',
			'		</div>',
			'	</a>',
			'</div>'
		].join('')
	};

	//var isQQClient = !$.browser.MQQ && navigator.userAgent.indexOf('QQ')>-1;

	function format(str, obj) {
		if (!str || $.type(obj) !== 'object') return;
		for (var key in obj) {
			str = str.replace('${' + key + '}', obj[key]);
		}
		return str;
	}


	$.extend($, {
		/**
		 * [createAppBannerResult 获取场景,是否安装app,app链接等信息]
		 * @param  {[type]} vid [视频id]
		 * @return {[type]}     [string]
		 */
		createAppBannerResult:function(config){
			var showTimer = null,
				//使用场景,默认为其它
				apptype = 4,
				isDone = false,
				tjTimeout=1,
				ios = $.os.iphone?1:0,
				//微信检测无权限重试次数
				wechatNum = 0,
				config = config || {},
				defer = $.Deferred();

			function getAppType(){
				//微信
				if($.browser.WeChat){
					apptype = 1;
				}
				//QQ浏览器
				if ($.browser.MQQ) {
					apptype = 3;
				}

				//在手机qq下(IOS下手机qq打开页面按手机qq处理)
				if ($.browser.MQQClient && ios) {
					apptype = 2;
				}				

			}

			init();

			function init(){

				getAppType();
				//在微信里就需要尝试获取微信接口判断是否安装了App
				if (apptype==1) {
					document.addEventListener("WeixinJSBridgeReady",function(){
						isDone = true;
					});
					
					showTimer = setTimeout(function() {
						tjTimeout = 2;
						setResult(0);
						isDone = true;
					}, 5000);
					invokeWeChatAPI();
					return;
				}
				//在qq浏览器下(在andriod的手机qq里面打开页面是按照qq浏览器处理)
				if (apptype==3) {
					invokeQQBrowserAPI();
					return;
				}
				//在手机qq下(IOS下手机qq打开页面按手机qq处理)
				if (apptype==2) {
					invokeQQClientAPI();
					return;
				}

				setResult(0);				
			}


			function invokeQQBrowserAPI() {
				if (!$.os.iphone && window.x5mtt) {
					var _flag = window.x5mtt.isApkInstalled('{"packagename": "com.tencent.qqlive"}');
					setResult(_flag!= -1 ?1:0);
				}else{
					setResult(0);
				}
			}

			function invokeQQClientAPI() {
				function cb() {
					mqq.app.isAppInstalled('tenvideo2://can_open_me_if_install_and_regeister_this_scheme', function(rs) {
						rs ? setResult(1) : function(){
							mqq.app.isAppInstalled('tenvideo://can_open_me_if_install_and_regeister_this_scheme',function(rs){
								setResult(rs?2:0);
							});
						}();
					});
				}
				
				if (typeof mqq != 'undefined') {
					cb();
				} else {
					x.$.getScript("http://pub.idqqimg.com/qqmobile/qqapi.js", function() {
						cb();
					});
				}	
				
			}

			function invokeWeChatAPI() {
				//判断在正常页面和在iframe内部的情况
				if ( (window==top&&typeof WeixinJSBridge == "undefined") || (window!=top && typeof parent.WeixinJSBridge == "undefined")) {
					if (!isDone) {
						setTimeout(function() {
							invokeWeChatAPI();
						}, 100);
					}

					return;
				}
				clearTimeout(showTimer);
				if(window!=top && !wechatNum){
					WeixinJSBridge = parent.WeixinJSBridge;
				}				
				
				if (typeof WeixinJSBridge.invoke == "undefined") {
					setResult(0);
					return;
				}


				if ($.os.iphone) {
					WeixinJSBridge.invoke('getInstallState', {
						'packageName': 'com.tencent.live4iphone',
						'packageUrl': 'tenvideo2://can_open_me_if_install_and_regeister_this_scheme'
					}, function(n) {
						var o = n.err_msg;

						if (o.indexOf("not_allow") > -1 && wechatNum < 7) {
							wechatNum++;
							setTimeout(function() {
								invokeWeChatAPI();
							}, 500 * wechatNum);
							return;
						}
						//统计通过重试判定的数量
						if(wechatNum){
							tjTimeout = 3;
						}											
						if (o.indexOf("get_install_state:yes") > -1) {
							setResult(1);
						} else {
							WeixinJSBridge.invoke('getInstallState', {
								'packageName': 'com.tencent.live4iphone',
								'packageUrl': 'tenvideo://can_open_me_if_install_and_regeister_this_scheme'
							}, function(n) {
								o = n.err_msg;
								if (o.indexOf("get_install_state:yes") > -1) {
									setResult(2);
								} else {
									setResult(0);
								}
							});
						}
					});
				} else { //aphone
					WeixinJSBridge.invoke('getInstallState', {
						'packageName': 'com.tencent.qqlive',
						'packageUrl': 'tenvideo://can_open_me_if_install_and_regeister_this_scheme'
					}, function(n) {
						var o = n.err_msg;
						if (o.indexOf("not_allow") > -1 && wechatNum < 7) {
							wechatNum++;
							setTimeout(function() {
								invokeWeChatAPI();
							}, 500 * wechatNum);
							return;
						}
						//统计通过重试判定的数量
						if(wechatNum){
							tjTimeout = 3;
						}														
						if (o.indexOf("get_install_state:yes") > -1) {
							var arr = o.split("yes_"),
								ver = 0;
							if (arr.length >= 2) {
								ver = parseInt(arr[1], 10);
							}
							ver = isNaN(ver) ? 0 : ver;
							if (ver >= 5613) {
								setResult(1);
							} else {
								setResult(2);
							}
						} else {
							setResult(0);
						}
					})
				}
			}

			function setResult(num) {

				var url = "";
				if(num==1){
					vid = config.vid?encodeURIComponent(config.vid):"${vid}";
					if (ios) {
						url = num == 1 ? ("tenvideo2://?action=5&video_id=" + vid) : "tenvideo://";
						if(apptype==1 && num == 1){
							url+="&callback=weixin%3A%2F%2F&sender=%e5%be%ae%e4%bf%a1";
						}else if($.browser.MQQClient && num == 1){
							url+="&callback=mqqapi%3A%2F%2F&sender=%E6%89%8B%E6%9C%BAQQ";
						}else if(apptype==3 && num == 1){
							url+="&callback=mqqbrowser%3A%2F%2F&sender=QQ%E6%B5%8F%E8%A7%88%E5%99%A8";
						}
					} else {
						url = "tenvideo2://?action=5&video_id=" + vid;
					}
				}else{
					if(ios){
						url = "http://itunes.apple.com/cn/app/id458318329?mt=8";
					}else if($.browser.MQQClient){
						url = "http://3g.v.qq.com/d/downapp.html?ptag=205";
					}else if(apptype==1){
						url = config.downloadUrl ||"http://3g.v.qq.com/d/downapp.html?ptag=231";
					}else {
						url = "http://mcgi.v.qq.com/commdatav2?cmd=4&confid=140&platform=aphone";
					}

				}

				defer.resolve({
					hasApp:num,
					apptype:apptype,
					os:ios,
					tjTimeout:tjTimeout,
					url:url
				});
				
			}

			return defer;						

		},
		createAppBanner: function(config) {
			var cfg = $.extend({isAutoReport:true}, g_cfg, config),
				$mod = $("#" + cfg.modId),
				btnText = cfg.btnText[0],
				text1 = cfg.text1,
				text = config.text,
				html = cfg.tpl || g_cfg.tpl,
				url = "javascript:;",
				defer = $.Deferred();
				//调用createAppBannerResult获取到的信息
				info = "";

			//style为none时不需要默认样式
			if(cfg.style!='none'){
				$("head").append(cfg.style || g_cfg.style);
			}

			init();

			function init() {
				var getTextDone = false;
				if(text){
					showDownload();
				}else{
					//防止微信,手Q请求404时不触发,3秒后还没得到结果就算了
					var timer = setTimeout(function(){
						getTextDone = true;
						showDownload();
					},3000);					
					$.ajax({
						url: "http://sns.video.qq.com/fcgi-bin/dlib/dataout_ex?auto_id=906&vid=" + cfg.vid + "&otype=json&_rnd_=" + new Date().valueOf(),
						dataType: "jsonp"
					}).done(function(data) {
						clearTimeout(timer);
						if(!getTextDone){
							(data && data.text2) ? text = data.text2 : "";
							showDownload();
						}
						
					}).fail(function() {
						clearTimeout(timer);
						if(!getTextDone){
							showDownload();
						}
					});						
				}
			}

			function showDownload() {
				$.createAppBannerResult(config).done(function(rs){
					info = rs;
					url = rs.url;
					rs.hasApp>0?btnText = cfg.btnText[rs.hasApp]:"";
					showtips();
					bindTap();					
				});		
			}

			function getReportParams(action){
				var ctype = info.hasApp == 0 ? 1 : (info.hasApp == 1 ? 2 : 3),
					itype = $.os.iphone ? 2 : 1,
					cmd = action == 0 ? 3518 : 3519;
				var op = {
					itype: itype,
					ctype: ctype,
					cmd: cmd,
					int1:info.apptype,
					int3:info.tjTimeout,
					url: window != top ? document.referrer : document.location.href,
					//str1:navigator.userAgent,
					_:new Date().getTime()
				};
				op = $.extend(op,cfg.reportParams||{});
				return op;				
			}

			function tjreport(action) {
				var op = getReportParams(action);
				x.report(op);
			}




			function bindTap() {
				var $lk = $mod.find('[data-role=a]');
				$lk.on($.os.hasTouch?'touchend':'click', function() {
					tjreport(1);
				});				
			}


			function showtips() {
				text1 = btnText + text1;
				if(!text){
					cfg.defaultText?text=cfg.defaultText:text=g_cfg.text;
				}
				//当是微信超时的情况时,设置文字显示为打开
				if(info && info.tjTimeout==2){
					btnText = cfg.btnText[1];
				}
				html = format(html, {
					"text1": $.filterXSS(text1),
					"text": $.filterXSS(text),
					"btnText": $.filterXSS(btnText),
					"url": $.filterXSS(url),
					"iframe":window!=top?'target="_parent"':""
				});

				$mod.append(html);
				var $dl = $mod.find("[data-role=box]");
				if (($.os.android && window.screen.width > 480) || ($.os.iphone && window.screen.width <= 320)) {
					$dl.addClass("x_fixRight");
				}
				$dl.show();
				//isAutoReport设置为true时认为一旦创建完毕就上报,默认为true
				if(cfg.isAutoReport){
					tjreport(0);
				}
				defer.resolve(getReportParams(0));
			}

			return defer;
		}
	});
})(x, x.$);


;
(function(x, $) {
	$.extend(x.Player.fn, {
		/**
		 * 创建App下载banner
		 */
		buildAppBanner: function(config) {
			var t = this,
				$mod = t.$mod,
				modId = "mod_down_" + t.playerid;
			$mod.append('<div id="' + modId + '"></div>');
			//增高外层mod
			$mod.height(parseInt($mod.height()) + 57);
			$.createAppBanner({
				modId: modId,
				vid: t.curVideo.getVid(),
				text: !! config.text ? config.text : "",
				style: config.style || "",
				isAutoReport:true,
				tpl: config.tpl || ""
			});

		}
	});
})(x, x.$);