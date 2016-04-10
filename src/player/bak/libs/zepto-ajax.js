;
(function($) {

  if (!$.browser.ie) {
    return;
  }

  var jsonpObj, gcGet, paramToStr, createFunName, callBeforeSend, callError, callSuccess, callComplete;

  gcGet = function(callbackName, script) {
    script.parentNode.removeChild(script);
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch (e) {}
  };

  paramToStr = function(parameters, encodeURI) {
    var str = "",
      key, parameter;
    for (key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        key = encodeURI ? encodeURIComponent(key) : key;
        parameter = encodeURI ? encodeURIComponent(parameters[key]) : parameters[key];
        str += key + "=" + parameter + "&";
      }
    }
    return str.replace(/&$/, "");
  };

  createFunName = function() {
    return "cb_" + x.$.createGUID(16);
  };

  callBeforeSend = function(callback) {
    if (typeof(callback) !== 'undefined') {
      callback();
    }
  };

  callError = function(callback, errorMsg) {
    if (typeof(callback) !== 'undefined') {
      callback(errorMsg);
    }
  };

  callSuccess = function(callback, data) {
    if (typeof(callback) !== 'undefined') {
      callback(data);
    }
  };

  callComplete = function(callback) {
    if (typeof(callback) !== 'undefined') {
      callback();
    }
  };

  jsonpObj = {};
  jsonpObj.init = function(options) {
    var key;
    for (key in options) {
      if (options.hasOwnProperty(key)) {
        jsonpObj.options[key] = options[key];
      }
    }
    return true;
  };

  jsonpObj.get = function(options) {
    options = options || {};
    var url = options.url,
      callbackParameter = options.callbackParameter || 'callback',
      parameters = options.data || {}, script = document.createElement('script'),
      callbackName = createFunName(),
      prefix = "?";

    if (!url) {
      return;
    }

    parameters[callbackParameter] = callbackName;
    if (url.indexOf("?") >= 0) {
      prefix = "&";
    }
    url += prefix + paramToStr(parameters, true);
    url = url.replace(/=\?/, '=' + callbackName);

    window[callbackName] = function(data) {
      if (typeof(data) === 'undefined') {
        callError(options.error, 'Invalid JSON data returned');
      } else {
        callSuccess(options.success, data);
      }
      gcGet(callbackName, script);
      callComplete(options.complete);
    };
    callBeforeSend(options.beforeSend);
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);

    script.onerror = function() {
      gcGet(callbackName, script);
      callComplete(options.complete);
      callError(options.error, 'Error while trying to access the URL');
    }
  };

  $.ajax = jsonpObj.get;

})(Zepto);