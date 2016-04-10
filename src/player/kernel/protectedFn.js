/*
* @Author: xilie
* @Date:   2016-04-11 03:07:13
* @Last Modified by:   xilie
* @Last Modified time: 2016-04-11 03:43:49
*/

export default function (_class) {
  _class.prototype.protectedFn = {
		onwrite () {
			//开始创建各种UI皮肤和皮肤里的各种零件
			this.control = new x.Html5UI(this)
			this.control.init()
			this.$UILayer = this.control.$UILayer
	  }
  }
	/**
	 * 调用本地的保护方法
	 */
  _class.prototype.callProtectFn = (fnName) {
		let fn = this.protectedFn[fnName]
		if (_.isFunction(fn)) {
			fn.call(this)
		}
  }

  return _class
}