/*
* @Author: xilie
* @Date:   2016-04-11 03:13:03
* @Last Modified by:   xilie
* @Last Modified time: 2016-04-11 03:43:53
*/

export default function (_class) {
	/**
	 * 绑定事件处理
	 */
  _class.prototype.bindEventAdapter = () {
		let evts = [
			"-empty",
			"-abort",
			"-loadstart",
			"-can-play",
			"-can-play-through",
			"-loaded-data",
			"-loaded-metadata",
			"-abort",
			"-error",
			"-pause",
			"-paused",
			"-waiting",
			"-stalled",
			"-suspend",
			"-play",
			"-volume-change",
			"-playing",
			"-seeked",
			"-seeking",
			"-duration-change",
			"-progress",
			"-rate-change",
			"-timeupdate",
			"-ended"
		]

		evts.forEach((value, key) => {
			let evtName = 'on' + key.toLowerCase()
			let fn = this.h5EvtAdapter[evtName]
			if (_.isFunction(fn)) {
				this.$video.on(key.replace(/-/g, ""), e => {
					// if (DEBUG) {
					// 	x.log(e.type);
					// 	if (e.type == "durationchange") {
					// 		x.log("duration = " + e.target.duration);
					// 	}
					// }
					_.isFunction(fn) && (fn.call(t, this, e))
				})
			}
		})
  }

  _class.prototype.eventAdapter = {
		'onEnded' () {
			this.$video.trigger("x:player:ended");
			this.callCBEvent("onended", curVid);
			var nextVid = "",
				vidArr = this.curVideo.getVidList().split("|"),
				vidIndexOf = $.inArray(curVid, vidArr);
			if (vidIndexOf < vidArr.length - 1) {
				nextVid = vidArr[vidIndexOf + 1];
			}
			if (nextVid != "") { //同时传入了多个视频id，那么就一个一个播放
				this.play(nextVid);
				return;
			}
			this.callCBEvent("onallended");
			this.$video.trigger("x:player:allended"); //触发自定义的全部播放完毕事件

			if (this.config.isHtml5ShowPosterOnEnd) {
				this.setPoster();
			}

			var nextVideoInfo = this.callCBEvent("ongetnext", curVid, this.curVideo);
			if ( !! nextVideoInfo && nextVideoInfo instanceof x.VideoInfo) {
				this.play(nextVideoInfo);
			}
		}

		'onError' (ts, e) {
			if (e.target.currentSrc.indexOf(".m3u8") > 0 /* && this.config.isHtml5UseHLS === "auto"*/ ) {
				x.debug("play hls error,reload play mp4...");
				x.report({
					cmd: 3525,
					vid: this.curVideo.lastQueryVid,
					ver: x.ver.replace(/\$/g, ""),
					str4: navigator.userAgent,
					url: window != top ? document.referrer : document.location.href,
					str2: x.filename || "unknown"
				});
				this.play(this.curVideo.lastQueryVid, this.config.autoplay, false);
				return;
			}
			var errContent = -1;
			if ( !! e.target && e.target.error) {
				errContent = e.target.error.code;
			}
			if (errContent != 4) {
				return;
			}
			this.showError(0, errContent);
		}

		'onPlaying' () {
			this.callCBEvent("onplaying", curVid, this.curVideo);
		}
  }

  return _class
}