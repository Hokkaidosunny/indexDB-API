(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.IndexDB = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var es6Promise = createCommonjsModule(function (module, exports) {
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.3+28cd7ddc
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(commonjsGlobal, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  return function () {
    vertxNext(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = commonjsRequire;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof commonjsGlobal !== 'undefined') {
        local = commonjsGlobal;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

es6Promise.polyfill();
var IndexDB = function () {
  function IndexDB() {
    classCallCheck(this, IndexDB);
  }

  /**
   * get all the db names
   */
  IndexDB.prototype.getDBNames = function getDBNames() {
    return new Promise(function (resolve, reject) {
      var get_dbNames_req = indexedDB.webkitGetDatabaseNames();

      get_dbNames_req.onsuccess = function (event) {
        var dbNames = Array.prototype.slice.call(event.target.result);
        resolve(dbNames);
      };

      get_dbNames_req.onerror = function (event) {
        reject(new Error('error, db errorCode: ' + event.target.errorCode));
      };
    });
  };

  /**
   * create a new db
   */


  IndexDB.prototype.createDB = function createDB(dbName) {
    var _this = this;

    var version = arguments.length <= 1 || arguments[1] === undefined ? new Date().getTime() : arguments[1];

    return new Promise(function (resolve, reject) {
      _this.getDBNames().then(function (dbNames) {
        if (dbNames.indexOf(dbName) >= 0) {
          throw new Error('db ' + dbName + ' has existed');
        }

        var dbConnect = indexedDB.open(dbName, version);
        dbConnect.onsuccess = function (event) {
          resolve(event.target.result);
        };
        dbConnect.onerror = function (event) {
          reject(event.target.errorCode);
        };
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  /**
   * open an existed db
   */


  IndexDB.prototype.openDB = function openDB(dbName) {
    var _this2 = this;

    var version = arguments.length <= 1 || arguments[1] === undefined ? new Date().getTime() : arguments[1];

    return new Promise(function (resolve, reject) {
      _this2.getDBNames().then(function (dbNames) {
        if (dbNames.indexOf(dbName) >= 0) {
          var dbConnect = indexedDB.open(dbName, version);

          dbConnect.onsuccess = function (event) {
            resolve(event.target.result);
          };
          dbConnect.onerror = function (event) {
            reject(event);
          };
        } else {
          throw new Error('db ' + dbName + ' doesn\'t existes');
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  /**
   * create a new store in an existed db
   */


  IndexDB.prototype.createStore = function createStore(_ref) {
    var _this3 = this;

    var _ref$dbName = _ref.dbName;
    var dbName = _ref$dbName === undefined ? null : _ref$dbName;
    var _ref$storeName = _ref.storeName;
    var storeName = _ref$storeName === undefined ? null : _ref$storeName;
    var _ref$version = _ref.version;
    var version = _ref$version === undefined ? new Date().getTime() : _ref$version;
    var _ref$keyOptions = _ref.keyOptions;
    var keyOptions = _ref$keyOptions === undefined ? {} : _ref$keyOptions;
    var _ref$index = _ref.index;
    var index = _ref$index === undefined ? [] : _ref$index;

    if (!dbName || !storeName) {
      console.error('dbName and storeName are required');
      return false;
    }

    return new Promise(function (resolve, reject) {
      _this3.getDBNames().then(function (dbNames) {
        if (dbNames.indexOf(dbName) >= 0) {
          var dbConnect = indexedDB.open(dbName, version);

          dbConnect.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (db.objectStoreNames.contains(storeName)) {
              //是否已存在该对象库
              reject(new Error('storeName ' + storeName + ' has existed'));
            } else {
              var store = db.createObjectStore(storeName, keyOptions); //创建对象库
              for (var i in index) {
                //创建索引
                store.createIndex(index[i].indexName, index[i].indexKey, index[i].indexOptions);
              }
              resolve(store);
            }
          };

          dbConnect.onerror = function (event) {
            reject(new Error('error, db errorCode: ' + event.target.errorCode));
          };
        } else {
          throw new Error('db ' + dbName + ' doesn\'t existes');
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  IndexDB.prototype.getStore = function getStore(db, storeName) {
    if (db.objectStoreNames.contains(storeName)) {
      var tx = db.transaction(storeName, 'readwrite');
      return tx.objectStore(storeName);
    } else {
      console.error('store ' + storeName + ' doesn\'t existes');
    }
  };

  /**
   *获取对象仓库数据量
   */


  IndexDB.prototype.getStoreCount = function getStoreCount(db, storeName) {
    var _this4 = this;

    return new Promise(function (resolve, reject) {
      var store = _this4.getStore(db, storeName);
      var store_count_req = store.count();
      store_count_req.onsuccess = function (event) {
        resolve(event.target.result);
        window.result = event;
      };
    });
  };

  return IndexDB;
}();

return IndexDB;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwiLi4vbGliL2luZGV4ZGIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICA0LjAuMysyOGNkN2RkY1xuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5FUzZQcm9taXNlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG52YXIgX2lzQXJyYXkgPSB1bmRlZmluZWQ7XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59XG5cbnZhciBpc0FycmF5ID0gX2lzQXJyYXk7XG5cbnZhciBsZW4gPSAwO1xudmFyIHZlcnR4TmV4dCA9IHVuZGVmaW5lZDtcbnZhciBjdXN0b21TY2hlZHVsZXJGbiA9IHVuZGVmaW5lZDtcblxudmFyIGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgcXVldWVbbGVuXSA9IGNhbGxiYWNrO1xuICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgbGVuICs9IDI7XG4gIGlmIChsZW4gPT09IDIpIHtcbiAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgaWYgKGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICBjdXN0b21TY2hlZHVsZXJGbihmbHVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XG4gIGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbn1cblxuZnVuY3Rpb24gc2V0QXNhcChhc2FwRm4pIHtcbiAgYXNhcCA9IGFzYXBGbjtcbn1cblxudmFyIGJyb3dzZXJXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbnZhciBicm93c2VyR2xvYmFsID0gYnJvd3NlcldpbmRvdyB8fCB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAoe30pLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2ZXJ0eE5leHQoZmx1c2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIG5vZGUuZGF0YSA9IGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyO1xuICB9O1xufVxuXG4vLyB3ZWIgd29ya2VyXG5mdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gZXM2LXByb21pc2Ugd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgZ2xvYmFsU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdsb2JhbFNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgIHZhciBhcmcgPSBxdWV1ZVtpICsgMV07XG5cbiAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgcXVldWVbaSArIDFdID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGVuID0gMDtcbn1cblxuZnVuY3Rpb24gYXR0ZW1wdFZlcnR4KCkge1xuICB0cnkge1xuICAgIHZhciByID0gcmVxdWlyZTtcbiAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgIHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgcmV0dXJuIHVzZVZlcnR4VGltZXIoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbn1cblxudmFyIHNjaGVkdWxlRmx1c2ggPSB1bmRlZmluZWQ7XG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKGlzTm9kZSkge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU1lc3NhZ2VDaGFubmVsKCk7XG59IGVsc2UgaWYgKGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBzY2hlZHVsZUZsdXNoID0gYXR0ZW1wdFZlcnR4KCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmIChjaGlsZFtQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFrZVByb21pc2UoY2hpbGQpO1xuICB9XG5cbiAgdmFyIF9zdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgaWYgKF9zdGF0ZSkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBfYXJndW1lbnRzW19zdGF0ZSAtIDFdO1xuICAgICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2VDYWxsYmFjayhfc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG4vKipcbiAgYFByb21pc2UucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZXNvbHZlZCB3aXRoIHRoZVxuICBwYXNzZWQgYHZhbHVlYC4gSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSB2YWx1ZSB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aFxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG52YXIgUFJPTUlTRV9JRCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygxNik7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgUEVORElORyA9IHZvaWQgMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcblxudmFyIEdFVF9USEVOX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHNlbGZGdWxmaWxsbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5ub3RSZXR1cm5Pd24oKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW4ocHJvbWlzZSkge1xuICB0cnkge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICByZXR1cm4gR0VUX1RIRU5fRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gIHRyeSB7XG4gICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gIGFzYXAoZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgdmFyIGVycm9yID0gdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH1cbiAgfSwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKSB7XG4gIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmIHRoZW4kJCA9PT0gdGhlbiAmJiBtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yLnJlc29sdmUgPT09IHJlc29sdmUpIHtcbiAgICBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhlbiQkID09PSBHRVRfVEhFTl9FUlJPUikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgfSBlbHNlIGlmICh0aGVuJCQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odGhlbiQkKSkge1xuICAgICAgaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgc2VsZkZ1bGZpbGxtZW50KCkpO1xuICB9IGVsc2UgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgZ2V0VGhlbih2YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgIHByb21pc2UuX29uZXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgfVxuXG4gIHB1Ymxpc2gocHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gIHByb21pc2UuX3N0YXRlID0gRlVMRklMTEVEO1xuXG4gIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggIT09IDApIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHByb21pc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgYXNhcChwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICB2YXIgbGVuZ3RoID0gX3N1YnNjcmliZXJzLmxlbmd0aDtcblxuICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gIF9zdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIFJFSkVDVEVEXSA9IG9uUmVqZWN0aW9uO1xuXG4gIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgIGFzYXAocHVibGlzaCwgcGFyZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHVuZGVmaW5lZCxcbiAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkLFxuICAgICAgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gRXJyb3JPYmplY3QoKSB7XG4gIHRoaXMuZXJyb3IgPSBudWxsO1xufVxuXG52YXIgVFJZX0NBVENIX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgcmV0dXJuIFRSWV9DQVRDSF9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHZhciBoYXNDYWxsYmFjayA9IGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICBlcnJvciA9IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2NlZWRlZCA9IHVuZGVmaW5lZCxcbiAgICAgIGZhaWxlZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICB2YWx1ZSA9IHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBjYW5ub3RSZXR1cm5Pd24oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZGV0YWlsO1xuICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gIH1cblxuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAvLyBub29wXG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gRlVMRklMTEVEKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBlKTtcbiAgfVxufVxuXG52YXIgaWQgPSAwO1xuZnVuY3Rpb24gbmV4dElkKCkge1xuICByZXR1cm4gaWQrKztcbn1cblxuZnVuY3Rpb24gbWFrZVByb21pc2UocHJvbWlzZSkge1xuICBwcm9taXNlW1BST01JU0VfSURdID0gaWQrKztcbiAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKCF0aGlzLnByb21pc2VbUFJPTUlTRV9JRF0pIHtcbiAgICBtYWtlUHJvbWlzZSh0aGlzLnByb21pc2UpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBfcmVqZWN0KHRoaXMucHJvbWlzZSwgdmFsaWRhdGlvbkVycm9yKCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gIHZhciBfaW5wdXQgPSB0aGlzLl9pbnB1dDtcblxuICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5fZWFjaEVudHJ5KF9pbnB1dFtpXSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbiAoZW50cnksIGkpIHtcbiAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICB2YXIgcmVzb2x2ZSQkID0gYy5yZXNvbHZlO1xuXG4gIGlmIChyZXNvbHZlJCQgPT09IHJlc29sdmUpIHtcbiAgICB2YXIgX3RoZW4gPSBnZXRUaGVuKGVudHJ5KTtcblxuICAgIGlmIChfdGhlbiA9PT0gdGhlbiAmJiBlbnRyeS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gUHJvbWlzZSkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhub29wKTtcbiAgICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIF90aGVuKTtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uIChyZXNvbHZlJCQpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUkJChlbnRyeSk7XG4gICAgICB9KSwgaSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlJCQoZW50cnkpLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uIChzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uIChwcm9taXNlLCBpKSB7XG4gIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICBzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgfSk7XG59O1xuXG4vKipcbiAgYFByb21pc2UuYWxsYCBhY2NlcHRzIGFuIGFycmF5IG9mIHByb21pc2VzLCBhbmQgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoXG4gIGlzIGZ1bGZpbGxlZCB3aXRoIGFuIGFycmF5IG9mIGZ1bGZpbGxtZW50IHZhbHVlcyBmb3IgdGhlIHBhc3NlZCBwcm9taXNlcywgb3JcbiAgcmVqZWN0ZWQgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBiZSByZWplY3RlZC4gSXQgY2FzdHMgYWxsXG4gIGVsZW1lbnRzIG9mIHRoZSBwYXNzZWQgaXRlcmFibGUgdG8gcHJvbWlzZXMgYXMgaXQgcnVucyB0aGlzIGFsZ29yaXRobS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVzb2x2ZSgyKTtcbiAgbGV0IHByb21pc2UzID0gcmVzb2x2ZSgzKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBhbGxgIGFyZSByZWplY3RlZCwgdGhlIGZpcnN0IHByb21pc2VcbiAgdGhhdCBpcyByZWplY3RlZCB3aWxsIGJlIGdpdmVuIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZXR1cm5lZCBwcm9taXNlcydzXG4gIHJlamVjdGlvbiBoYW5kbGVyLiBGb3IgZXhhbXBsZTpcblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICBsZXQgcHJvbWlzZTMgPSByZWplY3QobmV3IEVycm9yKFwiM1wiKSk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAvLyBlcnJvci5tZXNzYWdlID09PSBcIjJcIlxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCBhbGxcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBlbnRyaWVzIGFycmF5IG9mIHByb21pc2VzXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4gIEBzdGF0aWNcbiovXG5mdW5jdGlvbiBhbGwoZW50cmllcykge1xuICByZXR1cm4gbmV3IEVudW1lcmF0b3IodGhpcywgZW50cmllcykucHJvbWlzZTtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJhY2VgIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaCBpcyBzZXR0bGVkIGluIHRoZSBzYW1lIHdheSBhcyB0aGVcbiAgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gc2V0dGxlLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAyJyk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIGl0IHdhcyByZXNvbHZlZCBiZWZvcmUgcHJvbWlzZTFcbiAgICAvLyB3YXMgcmVzb2x2ZWQuXG4gIH0pO1xuICBgYGBcblxuICBgUHJvbWlzZS5yYWNlYCBpcyBkZXRlcm1pbmlzdGljIGluIHRoYXQgb25seSB0aGUgc3RhdGUgb2YgdGhlIGZpcnN0XG4gIHNldHRsZWQgcHJvbWlzZSBtYXR0ZXJzLiBGb3IgZXhhbXBsZSwgZXZlbiBpZiBvdGhlciBwcm9taXNlcyBnaXZlbiB0byB0aGVcbiAgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudCBhcmUgcmVzb2x2ZWQsIGJ1dCB0aGUgZmlyc3Qgc2V0dGxlZCBwcm9taXNlIGhhc1xuICBiZWNvbWUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWRcbiAgcHJvbWlzZSB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKCdwcm9taXNlIDInKSk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnNcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBwcm9taXNlIDIgYmVjYW1lIHJlamVjdGVkIGJlZm9yZVxuICAgIC8vIHByb21pc2UgMSBiZWNhbWUgZnVsZmlsbGVkXG4gIH0pO1xuICBgYGBcblxuICBBbiBleGFtcGxlIHJlYWwtd29ybGQgdXNlIGNhc2UgaXMgaW1wbGVtZW50aW5nIHRpbWVvdXRzOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgUHJvbWlzZS5yYWNlKFthamF4KCdmb28uanNvbicpLCB0aW1lb3V0KDUwMDApXSlcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYXJyYXkgb2YgcHJvbWlzZXMgdG8gb2JzZXJ2ZVxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB3aGljaCBzZXR0bGVzIGluIHRoZSBzYW1lIHdheSBhcyB0aGUgZmlyc3QgcGFzc2VkXG4gIHByb21pc2UgdG8gc2V0dGxlLlxuKi9cbmZ1bmN0aW9uIHJhY2UoZW50cmllcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShlbnRyaWVzKSkge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKF8sIHJlamVjdCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgYFByb21pc2UucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBwYXNzZWQgYHJlYXNvbmAuXG4gIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSByZWFzb24gdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGguXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIGdpdmVuIGByZWFzb25gLlxuKi9cbmZ1bmN0aW9uIHJlamVjdChyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIG5lZWRzUmVzb2x2ZXIoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbn1cblxuZnVuY3Rpb24gbmVlZHNOZXcoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG59XG5cbi8qKlxuICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICBUZXJtaW5vbG9neVxuICAtLS0tLS0tLS0tLVxuXG4gIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gIEJhc2ljIFVzYWdlOlxuICAtLS0tLS0tLS0tLS1cblxuICBgYGBqc1xuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgIC8vIG9uIGZhaWx1cmVcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBBZHZhbmNlZCBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICBgYGBqc1xuICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgYGBganNcbiAgUHJvbWlzZS5hbGwoW1xuICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSk7XG4gIGBgYFxuXG4gIEBjbGFzcyBQcm9taXNlXG4gIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQGNvbnN0cnVjdG9yXG4qL1xuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICB0aGlzW1BST01JU0VfSURdID0gbmV4dElkKCk7XG4gIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gIGlmIChub29wICE9PSByZXNvbHZlcikge1xuICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBuZWVkc1Jlc29sdmVyKCk7XG4gICAgdGhpcyBpbnN0YW5jZW9mIFByb21pc2UgPyBpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBuZWVkc05ldygpO1xuICB9XG59XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5yYWNlID0gcmFjZTtcblByb21pc2UucmVzb2x2ZSA9IHJlc29sdmU7XG5Qcm9taXNlLnJlamVjdCA9IHJlamVjdDtcblByb21pc2UuX3NldFNjaGVkdWxlciA9IHNldFNjaGVkdWxlcjtcblByb21pc2UuX3NldEFzYXAgPSBzZXRBc2FwO1xuUHJvbWlzZS5fYXNhcCA9IGFzYXA7XG5cblByb21pc2UucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSxcblxuICAvKipcbiAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBDaGFpbmluZ1xuICAgIC0tLS0tLS0tXG4gIFxuICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgIH0pO1xuICBcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICB9KTtcbiAgICBgYGBcbiAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQXNzaW1pbGF0aW9uXG4gICAgLS0tLS0tLS0tLS0tXG4gIFxuICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IHJlc3VsdDtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IGF1dGhvciwgYm9va3M7XG4gIFxuICAgIHRyeSB7XG4gICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgXG4gICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuICBcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kQXV0aG9yKCkuXG4gICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIHRoZW5cbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgdGhlbjogdGhlbixcblxuICAvKipcbiAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cbiAgXG4gICAgYGBganNcbiAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICB9XG4gIFxuICAgIC8vIHN5bmNocm9ub3VzXG4gICAgdHJ5IHtcbiAgICAgIGZpbmRBdXRob3IoKTtcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9XG4gIFxuICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgY2F0Y2hcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICAnY2F0Y2gnOiBmdW5jdGlvbiBfY2F0Y2gob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgdmFyIGxvY2FsID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xuXG4gICAgaWYgKFApIHtcbiAgICAgICAgdmFyIHByb21pc2VUb1N0cmluZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBzaWxlbnRseSBpZ25vcmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZVRvU3RyaW5nID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWwuUHJvbWlzZSA9IFByb21pc2U7XG59XG5cbi8vIFN0cmFuZ2UgY29tcGF0Li5cblByb21pc2UucG9seWZpbGwgPSBwb2x5ZmlsbDtcblByb21pc2UuUHJvbWlzZSA9IFByb21pc2U7XG5cbnJldHVybiBQcm9taXNlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXM2LXByb21pc2UubWFwIiwiaW1wb3J0IHByb21pc2UgZnJvbSAnZXM2LXByb21pc2UnO1xucHJvbWlzZS5wb2x5ZmlsbCgpO1xuLyoqXG4gKiBnZXQgb2JqZWN0IHZhbHVlc1xuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIF9vYmplY3RWYWx1ZXMob2JqKXtcbiAgaWYgKChvYmogaW5zdGFuY2VvZiBPYmplY3QpICYmICh0eXBlb2Ygb2JqLmxlbmd0aCA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgIHZhbHVlcy5wdXNoKG9ialtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKGAke29ian0gZXhwZWN0ZWQgdG8gYmUgYW4gT2JqZWN0YCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNsYXNzIEluZGV4REJ7XG5cbiAgLyoqXG4gICAqIGdldCBhbGwgdGhlIGRiIG5hbWVzXG4gICAqL1xuICBnZXREQk5hbWVzKCl7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGdldF9kYk5hbWVzX3JlcSA9IGluZGV4ZWREQi53ZWJraXRHZXREYXRhYmFzZU5hbWVzKCk7XG5cbiAgICAgIGdldF9kYk5hbWVzX3JlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGJOYW1lcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICByZXNvbHZlKGRiTmFtZXMpO1xuICAgICAgfTtcblxuICAgICAgZ2V0X2RiTmFtZXNfcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgZXJyb3IsIGRiIGVycm9yQ29kZTogJHtldmVudC50YXJnZXQuZXJyb3JDb2RlfWApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSBuZXcgZGJcbiAgICovXG4gIGNyZWF0ZURCKGRiTmFtZSwgdmVyc2lvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpKXtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5nZXREQk5hbWVzKCkudGhlbigoZGJOYW1lcykgPT4ge1xuICAgICAgICBpZiAoZGJOYW1lcy5pbmRleE9mKGRiTmFtZSkgPj0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZGIgJHtkYk5hbWV9IGhhcyBleGlzdGVkYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYkNvbm5lY3QgPSBpbmRleGVkREIub3BlbihkYk5hbWUsIHZlcnNpb24pO1xuICAgICAgICBkYkNvbm5lY3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgZGJDb25uZWN0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yQ29kZSk7XG4gICAgICAgIH07XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogb3BlbiBhbiBleGlzdGVkIGRiXG4gICAqL1xuICBvcGVuREIoZGJOYW1lLCB2ZXJzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5nZXREQk5hbWVzKCkudGhlbigoZGJOYW1lcykgPT4ge1xuICAgICAgICBpZiAoZGJOYW1lcy5pbmRleE9mKGRiTmFtZSkgPj0gMCkge1xuICAgICAgICAgIGNvbnN0IGRiQ29ubmVjdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgdmVyc2lvbik7XG5cbiAgICAgICAgICBkYkNvbm5lY3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZGJDb25uZWN0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChldmVudCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGRiICR7ZGJOYW1lfSBkb2Vzbid0IGV4aXN0ZXNgKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSBuZXcgc3RvcmUgaW4gYW4gZXhpc3RlZCBkYlxuICAgKi9cbiAgY3JlYXRlU3RvcmUoe1xuICAgIGRiTmFtZSA9IG51bGwsXG4gICAgc3RvcmVOYW1lID0gbnVsbCxcbiAgICB2ZXJzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAga2V5T3B0aW9ucyA9IHt9LFxuICAgIGluZGV4ID0gW11cbiAgfSkge1xuICAgIGlmICghZGJOYW1lIHx8ICFzdG9yZU5hbWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGRiTmFtZSBhbmQgc3RvcmVOYW1lIGFyZSByZXF1aXJlZGApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmdldERCTmFtZXMoKS50aGVuKChkYk5hbWVzKSA9PiB7XG4gICAgICAgIGlmIChkYk5hbWVzLmluZGV4T2YoZGJOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgY29uc3QgZGJDb25uZWN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lLCB2ZXJzaW9uKTtcblxuICAgICAgICAgIGRiQ29ubmVjdC5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcbiAgICAgIFx0XHRcdGNvbnN0IGRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICBcdFx0XHRcdGlmIChkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHN0b3JlTmFtZSkpIHsgIC8v5piv5ZCm5bey5a2Y5Zyo6K+l5a+56LGh5bqTXG4gICAgXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoYHN0b3JlTmFtZSAke3N0b3JlTmFtZX0gaGFzIGV4aXN0ZWRgKSk7XG4gICAgXHRcdFx0XHR9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBzdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSwga2V5T3B0aW9ucyk7IC8v5Yib5bu65a+56LGh5bqTXG4gICAgXHRcdFx0XHRcdGZvciAobGV0IGkgaW4gaW5kZXgpIHsgIC8v5Yib5bu657Si5byVXG4gICAgXHRcdFx0XHRcdFx0c3RvcmUuY3JlYXRlSW5kZXgoXG4gICAgXHRcdFx0XHRcdFx0XHRpbmRleFtpXS5pbmRleE5hbWUsXG4gICAgXHRcdFx0XHRcdFx0XHRpbmRleFtpXS5pbmRleEtleSxcbiAgICBcdFx0XHRcdFx0XHRcdGluZGV4W2ldLmluZGV4T3B0aW9uc1xuICAgIFx0XHRcdFx0XHRcdCk7XG4gICAgXHRcdFx0XHRcdH1cbiAgICAgICAgICAgICAgcmVzb2x2ZShzdG9yZSk7XG4gICAgXHRcdFx0XHR9XG4gICAgICBcdCAgfTtcblxuICAgICAgICAgIGRiQ29ubmVjdC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBlcnJvciwgZGIgZXJyb3JDb2RlOiAke2V2ZW50LnRhcmdldC5lcnJvckNvZGV9YCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGRiICR7ZGJOYW1lfSBkb2Vzbid0IGV4aXN0ZXNgKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9KTtcbiAgICB9KTtcblx0fVxuXG4gIGdldFN0b3JlKGRiLCBzdG9yZU5hbWUpIHtcbiAgICBpZiAoZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhzdG9yZU5hbWUpKSB7XG4gICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpO1xuICAgICAgcmV0dXJuIHR4Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYHN0b3JlICR7c3RvcmVOYW1lfSBkb2Vzbid0IGV4aXN0ZXNgKTtcbiAgICB9XG5cdH1cblxuICAvKipcbiAgICrojrflj5blr7nosaHku5PlupPmlbDmja7ph49cbiAgICovXG5cdGdldFN0b3JlQ291bnQoZGIsIHN0b3JlTmFtZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoZGIsIHN0b3JlTmFtZSk7XG4gICAgICBjb25zdCBzdG9yZV9jb3VudF9yZXEgPSBzdG9yZS5jb3VudCgpO1xuICAgICAgc3RvcmVfY291bnRfcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICB3aW5kb3cucmVzdWx0ID0gZXZlbnQ7XG4gICAgICB9O1xuICAgIH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4REI7XG4iXSwibmFtZXMiOlsidGhpcyIsInJlcXVpcmUiLCJnbG9iYWwiLCJwcm9taXNlIiwicG9seWZpbGwiLCJJbmRleERCIiwiZ2V0REJOYW1lcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0X2RiTmFtZXNfcmVxIiwiaW5kZXhlZERCIiwid2Via2l0R2V0RGF0YWJhc2VOYW1lcyIsIm9uc3VjY2VzcyIsImV2ZW50IiwiZGJOYW1lcyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwidGFyZ2V0IiwicmVzdWx0Iiwib25lcnJvciIsIkVycm9yIiwiZXJyb3JDb2RlIiwiY3JlYXRlREIiLCJkYk5hbWUiLCJ2ZXJzaW9uIiwiRGF0ZSIsImdldFRpbWUiLCJ0aGVuIiwiaW5kZXhPZiIsImRiQ29ubmVjdCIsIm9wZW4iLCJjYXRjaCIsImVycm9yIiwib3BlbkRCIiwiY3JlYXRlU3RvcmUiLCJzdG9yZU5hbWUiLCJrZXlPcHRpb25zIiwiaW5kZXgiLCJvbnVwZ3JhZGVuZWVkZWQiLCJkYiIsIm9iamVjdFN0b3JlTmFtZXMiLCJjb250YWlucyIsInN0b3JlIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJpIiwiY3JlYXRlSW5kZXgiLCJpbmRleE5hbWUiLCJpbmRleEtleSIsImluZGV4T3B0aW9ucyIsImdldFN0b3JlIiwidHgiLCJ0cmFuc2FjdGlvbiIsIm9iamVjdFN0b3JlIiwiZ2V0U3RvcmVDb3VudCIsInN0b3JlX2NvdW50X3JlcSIsImNvdW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQSxDQUFDLFVBQVUsTUFBTSxFQUFFLE9BQU8sRUFBRTtJQUN4QixPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLGNBQWMsR0FBRyxPQUFPLEVBQUU7SUFDekYsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUMzRCxNQUFNLENBQUMsVUFBVSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7Q0FDbkMsQ0FBQ0EsY0FBSSxHQUFHLFlBQVksRUFBRSxZQUFZLENBQUM7O0FBRXBDLFNBQVMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFO0VBQzNCLE9BQU8sT0FB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
