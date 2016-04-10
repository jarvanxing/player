;
(function(x, $) {
	//扩展基础插件
	$.extend(x.Html5Tiny.fn, {
		/**
		 * 创建播放质量监控
		 */
		buildmonitor: function() {
			var t = this,
				monitor = null,
				waitingTimes = 0,
				isUseHls = false;

			this.$video.on("x:video:ajaxstart", function(e, vid, hls) {
				isUseHls = hls;
				monitor = null;
				monitor = new x.H5Monitor(vid, t);
				monitor.addStep(isUseHls ? 1009 : 1011);
			}).on("x:video:ajaxsuc", function() {
				monitor.reportStep(isUseHls ? 1009 : 1011, {
					val1: 1,
					val2: 0
				});
			}).on("x:video:src", function() {
				waitingTimes = 0;
				monitor.report(4, 1);
				monitor.addStep(6);
				monitor.addStep(30);

				t.$video.one("canplay", function() {
					monitor.reportStep(30, {
						"val1": 0,
						"val2": 2
					});
				}).one("error", function() {
					monitor.reportStep(30, {
						"val1": 1,
						"val2": 2
					});
					monitor.report(5, 0, {
						"val1": 3
					});
				}).one("playing", function() {
					monitor.reportStep(6, {
						"val1": 1
					});
					monitor.addStep(5);
					t.$video.one("x:player:ended", function() {
						monitor.reportStep(5, {
							"val1": 1
						});
					}).one("x:player:videochange", function() {
						monitor.reportStep(5, {
							"val1": 2
						});
					});
				});
			}).on("waiting", function() {
				if (++waitingTimes == 1) return;
				if ( !! t.isDefinitionSwitching || !! t.isTouching) return;
				monitor.addStep(31);
				t.$video.one("timeupdate", report31)
			});

			var report31 = function() {
				var sp = monitor.reportTimer[monitor.getStepName(31)],
					tl = 0;
				if (!sp) {
					t.$video.off("timeupdate", report31);
					return;
				}
				tl = sp.getTimelong();
				monitor.report(31, Math.min(10000, tl), {
					"val1": tl > 10000 ? 1 : 0,
					"val2": 2,
					"ptime ": t.videoTag.currentTime
				});
				t.$video.off("timeupdate", report31);
			};
		}
	});
})(x, x.$);