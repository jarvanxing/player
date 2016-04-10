;
(function($) {
  function detect(ua) {
    var browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/);

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !! webkit) browser.version = webkit[1];
    if (playbook) browser.playbook = true;
    if (silk) browser.silk = true, browser.version = silk[1];
    if (chrome) browser.chrome = true, browser.version = chrome[1];
    if (firefox) browser.firefox = true, browser.version = firefox[1];

    this.browser = browser;
  }
  detect.call($, navigator.userAgent);

  var class2type = {};
  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase()
  });
  $.type = function(obj) {
    return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
  }

  $.camelCase = function(str) {
    return str.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : ''
    })
  }

  $.isWindow = function(obj) {
    return obj != null && obj == obj.window;
  }
  $.isPlainObject = function(obj) {
    return $.isObject(obj) && !$.isWindow(obj) && obj.__proto__ == Object.prototype;
  }

  $.inArray = function(elem, array, i) {
    return [].indexOf.call(array, elem, i);
  }

})(jq)