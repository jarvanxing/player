/**
 * @fileOverview HTML5获取服务器视频文件信息通用接口
 */

;
(function(x, $) {
	var globalCfg = {
		isHLS: false,
		isPay: false,
		vid: "",
		fmt: "auto",
		platform: 11001
	};


	/**
	 * 获取要增加到MP4文件的后缀参数
	 *
	 * @ignore
	 * @private
	 */

	function getMp4Key() {
		if ($.os.iphone || $.os.ipod) return "v3010";
		if ($.os.ipad) return "v4010";
		if ($.os.android) {
			// userAgent里说了这是pad，或者屏幕宽度大于600，说明这是Android Pad
			if ($.os.tablet || screen.width >= 600) {
				return "v6010";
			}
			return "v5010"
		}
		if ($.browser.IEMobile) {
			return "v7010";
		}
		return "v1010";
	}

	/**
	 * 获得请求getkey时的format参数
	 * @param  {type} fi [description]
	 * @return {type}    [description]
	 */

	function getKeyFormat(cfg, fi) {
		for (var i = 0, len = fi.length; i < len; i++) {
			if (fi[i].sl == 1) {
				return fi[i].id;
			}
		}
		return -1;
	}


	x.h5Helper = {
		/**
		 * 读取视频MP4文件
		 * @param  {Object} cfg 配置
		 * @return {$.Deferred}    $.Deferred对象
		 */
		loadVideoUrlByVid: function(cfg) {
			var s = {}, infoData = {}, defer = $.Deferred();
			$.extend($.extend(s, globalCfg), cfg);
			var retcode_getinfo = new x.RetCode(100126);
			retcode_getinfo.begin();
			$.ajax({
				url: "http://vv.video.qq.com/getinfo?callback=?&" + $.param({
					"vids": s.vid,
					"platform": s.platform,
					"charge": s.isPay ? 1 : 0,
					"otype": "json",
					"defaultfmt": s.fmt,
					"sb": 1,
					"_rnd": new Date().valueOf()
				}),
				dataType: "jsonp"
			}).done(function(infojson) {
				// getinfo返回的结果详细说明见 http://tapd.oa.com/v3/shiping_dev/wikis/view/getinfo
				// 如果返回结果不是预期的合法数据
				if (!infojson || !infojson.s) {
					retcode_getinfo.reportErr(50);
					defer.reject(50)
					return;
				}
				if (infojson.s != "o") {
					retcode_getinfo.reportErr(infojson.em || 50);
					defer.reject(infojson.em || 50);
					return;
				}
				if (!infojson.vl || !infojson.vl.vi || !$.isArray(infojson.vl.vi) || infojson.vl.cnt == 0) {
					retcode_getinfo.reportErr(68);
					defer.reject(68)
					return;
				}

				//TODO:多个视频vids需要循环做判断，现在这里只判断了一个视频
				var vi = infojson.vl.vi[0];
				//视频文件不可以播放，或者视频文件不允许访问，或者根本就没有播放地址，就告知62错误，表示视频状态不合法
				//TODO:区分视频付费状态码
				if (vi.fst != 5 || !$.isPlainObject(vi.ul) || !$.isArray(vi.ul.ui) || vi.ul.ui.length == 0) {
					retcode_getinfo.reportErr(62);
					defer.reject(62); //视频状态不合法
					return;
				}

				//视频状态不对
				if (vi.st != 2) {
					if (vi.st != 8) {
						retcode_getinfo.reportErr(62);
						defer.reject(62); //视频状态不合法
						return;
					}
					retcode_getinfo.reportErr(83);
					defer.reject(83, vi.ch);
				}

				retcode_getinfo.reportSuc();

				var ui = vi.ul.ui[0];

				infoData["br"] = vi.br;
				infoData["path"] = ui.url;
				infoData["fn"] = vi.fn;
				infoData["fiid"] = getKeyFormat(s, infojson.fl.fi);
				infoData["vt"] = ui.vt;

				var retcode_getkey = new x.RetCode(100127);
				retcode_getkey.begin();
				$.ajax({
					url: "http://vv.video.qq.com/getkey?callback=?&" + $.param({
						"otype": "json",
						"vid": s.vid,
						"format": infoData.fiid,
						"filename": infoData.fn,
						"platform": s.platform,
						"vt": infoData.vt,
						"charge": s.isPay ? 1 : 0,
						"_rnd": new Date().valueOf()
					}),
					dataType: "jsonp"
				}).done(function(keyjson) {
					// 如果返回结果不是预期的合法数据
					if (!keyjson || !keyjson.s) {
						retcode_getkey.reportErr(50);
						defer.reject(50);
						return;
					}
					if (keyjson.s != "o") {
						retcode_getkey.reportErr(keyjson.em || 50);
						defer.reject(keyjson.em || 50);
						return;
					}

					var videourl = [],
						charge = -2;

					videourl = infoData["path"] + infoData["fn"] + "?vkey=" + keyjson.key + "&br=" + infoData["br"] + "&platform=2&fmt=" + s.fmt + "&level=" + keyjson.level + "&sdtfrom=" + getMp4Key();
					if ($.isString(keyjson.sha) && keyjson.sha.length > 0) {
						videourl += "&sha=" + keyjson.sha;
					}
					retcode_getkey.reportSuc();
					defer.resolve(videourl, {
						"vl": infojson.vl,
						"fl": infojson.fl,
						"sfl": infojson.sfl,
						"preview": infojson.preview
					});
				}).fail(function() {
					retcode_getkey.reportErr();
					defer.reject(500, 2);
				})
			}).fail(function() {
				retcode_getinfo.reportErr();
				defer.reject(500, 1);
			});
			return defer;
		},
		/**
		 * 读取高清MP4地址
		 */
		loadHDVideoUrlByVid: function(cfg) {
			cfg.fmt = "mp4";
			x.h5Helper.loadVideoUrlByVid(cfg);
		},

		/**
		 * 根据vid读取HLS的路径
		 * @param  {[type]} cfg [description]
		 * @return {[type]}     [description]
		 */
		loadHLSUrlByVid: function(cfg) {
			var s = {}, defer = $.Deferred();
			$.extend($.extend(s, globalCfg), cfg);

			var retcode = new x.RetCode(100128);
			retcode.begin();
			$.ajax({
				"url": "http://vv.video.qq.com/gethls?callback=?&" + $.param({
					"vid": s.vid,
					"charge": s.isPay ? 1 : 0,
					"otype": "json",
					"platform": s.platform,
					"_rnd": new Date().valueOf()
				}),
				"dataType": "jsonp"
			}).done(function(json) {
				// 如果返回结果不是预期的合法数据
				if (!json || !json.s) {
					retcode.reportErr(50);
					defer.reject(50);
					return;
				} else if (json.s != "o") {
					retcode.reportErr(json.em || 50);
					defer.reject(json.em || 50);
					return;
				} else if (!json.vd || !json.vd.vi || !x.$.isArray(json.vd.vi)) {
					retcode.reportErr(68);
					defer.reject(68);
					return;
				}

				var videourl = [],
					charge = -2;
				for (var i = 0; i < json.vd.vi.length; i++) {
					charge = json.vd.vi[i].ch;

					if (json.vd.vi[i].st != 2)
						continue;

					var url = json.vd.vi[i].url.toLowerCase();
					if (url.indexOf(".mp4") < 0 && url.indexOf(".m3u8") < 0)
						continue;

					if ( !! json.vd.vi[i].url) {
						var d = json.vd.vi[i];
						videourl.push(d.url);
						// try {
						// 	videodata.duration = parseInt(d.dur);
						// 	videodata.vt = d.vt;
						// 	videodata.vurl = d.url;
						// 	videodata.bt = curVideo.getTimelong() || videodata.duration;
						// } catch (e) {}
						break;
					}
				}

				if (videourl.length == 0) {
					retcode.reportErr(68);
					defer.reject(68, charge);
					return;
				}

				retcode.reportSuc();
				defer.resolve(videourl[0], json.vd);

			}).fail(function() {
				retcode.reportErr();
				defer.reject(500, 3);
			});
			return defer;
		},
		/**
		 * 读取手机200K码率的视频文件MP4地址
		 * @param  {Object} cfg 配置
		 * @return {[type]}     [description]
		 */
		load3GVideoUrl: function(cfg) {
			cfg.fmt = "msd";
			x.h5Helper.loadVideoUrlByVid(cfg);
		},
		/**
		 * 读取CGI判断当前vid是否要求使用HLS
		 * @param  {[type]} cfg [description]
		 * @return {[type]}     [description]
		 */
		loadIsUseHLS: function(cfg) {
			var s = {}, infoData = {}, defer = $.Deferred();
			$.extend($.extend(s, globalCfg), cfg);

			var retcode = new x.RetCode(100125);
			retcode.begin();
			//CGI说明 http://tapd.oa.com/v3/shiping_dev/wikis/view/getdtype
			$.ajax({
				url: "http://vv.video.qq.com/getdtype?callback=?&" + $.param({
					"vids": s.vid,
					"platform": s.platform,
					"otype": "json",
					"_rnd": new Date().valueOf()
				}),
				dataType: "jsonp"
			}).done(function(json) {
				var dltype = 1;
				if ($.type(json) != "object") {
					retcode.reportErr();
					defer.reject(500, 4)
					return;
				}
				if (json.s != "o" || !$.isArray(json.dl) || json.dl.length == 0) {
					retcode.reportErr(json.em);
					defer.reject(json.em || 50);
					return;
				}
				for (var i = 0, len = json.dl.length; i < len; i++) {
					if (json.dl[i].vid === cfg.vid) {
						dltype = json.dl[i].dltype;
					}
				}
				retcode.reportSuc();
				defer.resolve(dltype, json);
			}).fail(function() {
				retcode.reportErr();
				defer.reject(500, 4);
			});
			return defer;
		},

		/**
		 * 读取软字幕，CGI接口详情访问http://tapd.oa.com/v3/shiping_dev/wikis/view/getsurl
		 * @return {[type]} [description]
		 */
		loadSRT: function(cfg) {
			var s = {}, infoData = {}, defer = $.Deferred();
			$.extend($.extend(s, globalCfg), cfg);

			$.ajax({
				url: "http://vv.video.qq.com/getsurl?" + $.param({
					"vid": s.vid,
					"format": s.sflid,
					"platform": s.platform,
					"pid": s.pid,
					"otype": "json",
					"_rnd": new Date().valueOf()
				}),
				dataType: "jsonp"
			}).done(function(json) {
				//数据源错误
				if ($.type(json) != "object") {
					defer.reject(500);
					return;
				}

				if (json.s != "o") {
					defer.reject(isNaN(json.em) ? 500 : json.em, json.msg || "");
					return;
				}
				defer.resolve(json);
			}).fail(function() {
				defer.reject(500);
			});
			return defer;
		}

	}
})(x, x.$);