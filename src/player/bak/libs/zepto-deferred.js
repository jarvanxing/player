(function() {
  var Deferred, PENDING, REJECTED, RESOLVED, VERSION, after, execute, flatten, has, installInto, isArguments, wrap, _when,
    __slice = [].slice;
  VERSION = '1.3.2', PENDING = "pending", RESOLVED = "resolved", REJECTED = "rejected";


  has = function(obj, prop) {
    return obj != null ? obj.hasOwnProperty(prop) : void 0;
  };

  function isArray(value) {
    return value instanceof Array
  }
  isArguments = function(obj) {
    return has(obj, 'length') && has(obj, 'callee');
  };

  flatten = function(array) {
    if (isArguments(array)) {
      return flatten(Array.prototype.slice.call(array));
    }
    if (!isArray(array)) {
      return [array];
    }
    return array.reduce(function(memo, value) {
      if (isArray(value)) {
        return memo.concat(flatten(value));
      }
      memo.push(value);
      return memo;
    }, []);
  };

  after = function(times, func) {
    if (times <= 0) {
      return func();
    }
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  wrap = function(func, wrapper) {
    return function() {
      var args;
      args = [func].concat(Array.prototype.slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  execute = function(callbacks, args, context) {
    var callback, _i, _len, _ref, _results;
    _ref = flatten(callbacks);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback.call.apply(callback, [context].concat(__slice.call(args))));
    }
    return _results;
  };

  Deferred = function() {
    var alwaysCallbacks, close, closingArguments, doneCallbacks, failCallbacks, state;
    state = PENDING;
    doneCallbacks = [];
    failCallbacks = [];
    alwaysCallbacks = [];
    closingArguments = {};
    this.promise = function(candidate) {
      var pipe, storeCallbacks;
      candidate = candidate || {};
      candidate.state = function() {
        return state;
      };
      storeCallbacks = function(shouldExecuteImmediately, holder) {
        return function() {
          if (state === PENDING) {
            holder.push.apply(holder, flatten(arguments));
          }
          if (shouldExecuteImmediately()) {
            execute(arguments, closingArguments);
          }
          return candidate;
        };
      };
      candidate.done = storeCallbacks((function() {
        return state === RESOLVED;
      }), doneCallbacks);
      candidate.fail = storeCallbacks((function() {
        return state === REJECTED;
      }), failCallbacks);
      candidate.always = storeCallbacks((function() {
        return state !== PENDING;
      }), alwaysCallbacks);
      pipe = function(doneFilter, failFilter) {
        var deferred, filter;
        deferred = new Deferred();
        filter = function(target, source, filter) {
          if (filter) {
            return target(function() {
              return source(filter.apply(null, flatten(arguments)));
            });
          } else {
            return target(function() {
              return source.apply(null, flatten(arguments));
            });
          }
        };
        filter(candidate.done, deferred.resolve, doneFilter);
        filter(candidate.fail, deferred.reject, failFilter);
        return deferred;
      };
      candidate.pipe = pipe;
      candidate.then = pipe;
      return candidate;
    };
    this.promise(this);
    close = function(finalState, callbacks, context) {
      return function() {
        if (state === PENDING) {
          state = finalState;
          closingArguments = arguments;
          execute([callbacks, alwaysCallbacks], closingArguments, context);
        }
        return this;
      };
    };
    this.resolve = close(RESOLVED, doneCallbacks);
    this.reject = close(REJECTED, failCallbacks);
    this.resolveWith = function() {
      var args, context;
      context = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return close(RESOLVED, doneCallbacks, context).apply(null, args);
    };
    this.rejectWith = function() {
      var args, context;
      context = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return close(REJECTED, failCallbacks, context).apply(null, args);
    };
    return this;
  };

  _when = function() {
    var def, defs, finish, trigger, _i, _j, _len, _len1;
    trigger = new Deferred();
    defs = flatten(arguments);
    finish = after(defs.length, trigger.resolve);
    for (_i = 0, _len = defs.length; _i < _len; _i++) {
      def = defs[_i];
      def.done(finish);
    }
    for (_j = 0, _len1 = defs.length; _j < _len1; _j++) {
      def = defs[_j];
      def.fail(function() {
        return trigger.reject();
      });
    }
    return trigger.promise();
  };

  installInto = function(fw) {
    fw.Deferred = function() {
      return new Deferred();
    };
    fw.ajax = wrap(fw.ajax, function(ajax, options) {
      var createWrapper, def;
      if (options == null) {
        options = {};
      }
      def = new Deferred();
      createWrapper = function(wrapped, finisher) {
        return wrap(wrapped, function() {
          var args, func;
          func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (func) {
            func.apply(null, args);
          }
          return finisher.apply(null, args);
        });
      };
      options.success = createWrapper(options.success, def.resolve);
      options.error = createWrapper(options.error, def.reject);
      ajax(options);
      return def.promise();
    });
    return fw.when = _when;
  };

  if (typeof exports !== 'undefined') {
    exports.Deferred = function() {
      return new Deferred();
    };
    exports.when = _when;
    exports.installInto = installInto;
  } else {
    this.Deferred = function() {
      return new Deferred();
    };
    this.Deferred.when = _when;
    this.Deferred.installInto = installInto;
    this.DeferedClass = Deferred;
  }

}).call(x);


x.Deferred.installInto(typeof Zepto != "undefined" ? Zepto : jq);