;
(function($) {
	$.extend(x.html5skin, {
		html: (function() {
			return [
				'<div class="x_container">',
				'	<% if(!!feature.title) {%>',
				// 标题 开始 
				'		<div class="x_titles">',
				'			<strong class="x_title"><span></span></strong>',
				//'			<div class="x_button x_button_back">',
				//'				<button type="button" title="返回"><span class="x_btn_value">返回</span></button>',
				//'			</div>',
				'		</div>',
				// 标题 结束 
				'	<% } %>',
				'	<div class="x_video">', '$VIDEO$', '</div>',

				// 控制栏开始 
				'	<% if(!!feature.controlbar) {%>',
				'	<div class="x_controls">',

				// 进度条开始 
				'		<% if(!!feature.progress) {%>',
				'		<div class="x_time_rail">',
				'			<% if(!!feature.timepanel) {%>',
				'			<span class="x_time_panel_current">00:00</span>',
				'			<% } %>',
				'			<span class="x_time_total" >',
				'				<span class="x_time_loaded" ></span>',
				'				<span class="x_time_current"><span class="x_time_handle"></span></span>',
				'			</span>',
				'			<% if(!!feature.timepanel) {%>',
				'			<span class="x_time_panel_total">00:00</span>',
				'			<% } %>',
				'		</div>',
				'		<% } %>',
				// 进度条结束 
				// 提示信息 
				'		<span class="x_time_handel_hint" style="display:none"></span>',
				// 播放暂停开始 
				'		<% if(!!feature.playpause) {%>',
				'		<div class="x_button x_playpause_button x_play">',
				'			<button type="button" title="播放/暂停"><span class="x_btn_value">播放</span></button>',
				'		</div>',
				'		<% } %>',
				// 播放暂停结束 
				// 下载App文字提示开始
				'		<% if(!!feature.promotion) {%>',
				'		<div class="x_promotion" style="display:none;">',
				'			<a href="https://itunes.apple.com/cn/app/id407925512?mt=8" target="_blank">安装iPad客户端 &gt;&gt;</a>',
				'		</div>',
				'		<% } %>',
				// 下载App文字提示结束
				'		<% if(!!feature.fullscreen) {%>',
				'		<div class="x_button x_fullscreen_button x_fullscreen">',
				'			<button type="button" title="切换全屏"><span class="x_btn_value">全屏</span></button>',
				'		</div>',
				'		<% } %>',
				// 清晰度选择 开始 
				'		<% if(!!feature.definition) {%>',
				'		<div class="x_button x_definition _x_definition_" style="display:none">',
				'			<div class="x_definition_button"><span>清晰度</span></div>',
				'			<div class="x_definition_list"></div>',
				'		</div>',
				'		<% } %>',
				// 清晰度选择 结束 
				// 字幕选择 开始 
				'		<% if(!!feature.track) {%>',
				// '		<div class="x_button x_definition _x_track_" style="display:none">',
				// '			<div class="x_definition_button"><span>字幕</span></div>',
				// '			<div class="x_definition_list"></div>',
				// '		</div>',
				'		<% } %>',
				// 清晰度选择 结束 
				'	</div>',
				'	<% } %>',
				// 控制栏结束

				'	<% if(!!feature.overlay) {%>',
				// loading图标 开始 
				'	<div class="x_overlay_loading x_none" style="z-index:5">',
				'		<span class="x_icon_loading"></span>',
				'	</div>',
				// loading图标 结束 

				// 播放大按钮 开始   
				'	<div class="x_overlay_play" style="z-index:5">',
				'		<span class="x_button_play"></span>',
				'	</div>',
				// 播放大按钮 结束   
				'	<% } %>',

				'	<% if(!!feature.bigben) {%>',
				'	<div class="x_overlay_bigben">',
				'		<div class="x_overlay_content">',
				'			<i class="x_ico_ff_rw x_ico_ff"></i><span class="x_text x_overlay_bigben_text">0:03:12</span>',
				'			<span class="x_time_total_small"><span class="x_time_current_small"></span></span>',
				'		</div>',
				'	</div>',
				'	<% } %>',

				'	<% if(!!feature.posterlayer) {%>',
				'	<div class="x_overlay_poster" style="display:none;">',
				'		<img class="x_poster_img"/>',
				'	</div>',
				'	<% } %>',

				// 功能性提示 开始 
				'	<% if(!!feature.tips) {%>',
				'	<div class="x_overlay_tips x_none">',
				'		<div class="x_overlay_content">',
				'			<span class="x_text"></span> ',
				'		</div>',
				'	</div>',
				'	<% } %>',
				// 功能性提示 结束 
				'</div>'].join("");
		})(),
		definitionList: (function() {
			return [
				'<ul>',
				'	<% for(var p in data.list) { %><% if(data.curv!=p){ %>',
				'	<li data-fmt="<%=p%>">',
				'		<span><%=data.list[p]%></span>',
				'	</li>',
				'	<% } }%>',
				'</ul>'].join("");
		})(),
		/**
		 * 不支持svg时需要添加的classname
		 * @type {String}
		 */
		noSVGClassName: "x_no_svg",

		/**
		 * DOM元素集合
		 * @type {Object}
		 */
		elements: {
			title: {
				main: ".x_titles",
				text: ".x_title span"
			},
			/**
			 * 播放器UI最外层容器
			 * @type {String}
			 */
			layer: ".x_container",
			/**
			 * 播放器控制栏
			 * @type {String}
			 */
			control: ".x_controls",
			/**
			 * 播放暂停按钮
			 * @type {String}
			 */
			play: ".x_playpause_button",
			/**
			 * 遮罩层
			 * @type {Object}
			 */
			overlay: {
				/**
				 * 播放按钮
				 * @type {String}
				 */
				play: ".x_overlay_play",
				/**
				 * 加载中按钮
				 * @type {String}
				 */
				loading: ".x_overlay_loading"
			},
			/**
			 * 进度条
			 * @type {Object}
			 */
			progress: {
				main: ".x_time_rail",
				cur: ".x_time_current",
				loaded: ".x_time_loaded",
				total: ".x_time_total",
				handle: ".x_time_handle",
				tips: ".x_time_float"
			},
			fullscreen: ".x_fullscreen_button",
			timePanel: {
				cur: ".x_time_panel_current",
				total: ".x_time_panel_total"
			},
			bigben: {
				main: ".x_overlay_bigben",
				desc: ".x_overlay_bigben_text",
				ffrw: ".x_ico_ff_rw",
				bar: ".x_time_current_small"
			},
			/**
			 * 清晰度
			 * @type {Object}
			 */
			definition: {
				/**
				 * 主面板
				 * @type {String}
				 */
				main: "._x_definition_",
				/**
				 * 控制栏上展示清晰度的按钮
				 * @type {String}
				 */
				button: "._x_definition_ .x_definition_button > span",
				/**
				 * 选择清晰度的列表
				 * @type {String}
				 */
				list: "._x_definition_ .x_definition_list"
			},
			track: {
				/**
				 * 主面板
				 * @type {String}
				 */
				main: "._x_track_",
				/**
				 * 控制栏上展示清晰度的按钮
				 * @type {String}
				 */
				button: "._x_track_ .x_definition_button > span",
				/**
				 * 选择清晰度的列表
				 * @type {String}
				 */
				list: "._x_track_ .x_definition_list"
			},
			/**
			 * 封面图图层
			 * @type {Object}
			 */
			posterlayer: {
				/**
				 * 主面板
				 * @type {String}
				 */
				main: ".x_overlay_poster",
				/**
				 * 图片img元素
				 * @type {String}
				 */
				img: ".x_poster_img"
			},
			/**
			 * 功能性tips
			 * @type {Object}
			 */
			tips: {
				/**
				 * 面板div
				 * @type {String}
				 */
				main: ".x_overlay_tips",
				/**
				 * 文案显示区域
				 * @type {String}
				 */
				desc: " .x_overlay_tips .x_text"
			},
			/**
			 * 下载App文字提示
			 * @type {Object}
			 */
			promotion: {
				/**
				 * 主面板div
				 * @type {String}
				 */
				main: ".x_promotion",
				/**
				 * 链接
				 * @type {String}
				 */
				link: ".x_promotion >a"
			}
		},
		/**
		 * 获取播放器HTML字符串
		 * @param  {object} cfg 配置项
		 * @return {String}     返回得到的播放器HTML字符串
		 */
		getHtml: function(cfg) {
			var render = x.$.tmpl(x.html5skin.html),
				featureData = {};
			x.$.each(cfg.type == x.PLAYER_DEFINE.LIVE ? cfg.html5LiveUIFeature : cfg.html5VodUIFeature, function(i, v) {
				featureData[v] = true;
			});
			x.$.each(cfg.html5ForbiddenUIFeature, function(i, v) {
				featureData[v] = false;
			});
			return render({
				"feature": featureData
			});
		}
	})
})(x.$);