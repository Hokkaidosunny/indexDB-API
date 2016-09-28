(function () {
'use strict';

/* eslint-disable no-unused-vars */

var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







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

var IndexDB = function () {
	function IndexDB() {
		classCallCheck(this, IndexDB);

		this.name = name;
		this.db = null;
	}

	createClass(IndexDB, [{
		key: 'createStore_openDB',
		value: function createStore_openDB(storeOptions, cb) {
			if (this.db !== null) {
				this.db.closeDB();
			}
			var default_storeOptions = {
				name: '',
				keyOptions: {},
				index: []
			};
			storeOptions = index(default_storeOptions, storeOptions);
			this.openDB(storeOptions, cb);
		}
	}, {
		key: 'openDB',
		value: function openDB(storeOptions, cb) {
			var _this = this;

			var version = new Date().getTime(),
			    //更新版本号，比旧版本号大，不然无法创建对象库
			dbConnect = indexedDB.open(this.name, version);

			dbConnect.onsuccess = function (event) {
				_this.db = event.target.result;
				if (cb && cb.success) {
					cb.success();
				}
			};

			dbConnect.onerror = function () {
				if (cb && cb.error) {
					cb.error();
				}
			};

			/**
    * 版本更新用于创建对象仓库
    */
			dbConnect.onupgradeneeded = function (event) {
				_this.db = evente.target.result;
				if (storeOptions) {
					if (!_this.db.objectStoreNames.contains(storeOptions.name)) {
						//是否已存在该对象库
						var store = _this.db.createObjectStore(storeOptions.name, storeOptions.keyOptions); //创建对象库
						for (var i in storeOptions.index) {
							//创建索引
							store.createIndex(storeOptions.index[i].indexName, storeOptions.index[i].indexKey, storeOptions.index[i].indexOptions);
						}
						console.log('created objectStore ' + storeOptions.name);
					} else {
						console.log(storeOptions.name + ' existed');
					}
				}
				console.log('DB version changed to ' + version);
			};
		}
	}, {
		key: 'closeDB',
		value: function closeDB() {
			this.db.close();
		}

		/**
   * 获取对象仓库
   */

	}, {
		key: 'getStore',
		value: function getStore(storeName) {
			var tx = this.db.transaction(storeName, 'readwrite');
			return tx.objectStore(storeName);
		}

		/**
   *获取对象仓库数据量
   */

	}, {
		key: 'getStoreCount',
		value: function getStoreCount(storeName, cb) {
			var _this2 = this;

			var store = this.getStore(storeName);
			var req = store.count();
			req.onsuccess = function () {
				cb(_this2.result);
			};
		}

		/**
   * 添加数据
   */

	}, {
		key: 'addData',
		value: function addData(storeName, data, cb) {
			var store = this.getStore(storeName);

			function add(data) {
				var req = store.add(data);
				req.onsuccess = function (event) {
					if (cb && cb.success) {
						cb.success();
					}
				};
				req.onerror = function (event) {
					if (cb && cb.error) {
						cb.error();
					}
				};
			}

			if (Array.isArray(data)) {
				//如果是数组
				for (var i = 0; i < data.length; i++) {
					add(data[i]);
				}
			} else {
				//如果是对象
				add(data);
			}
		}

		/**
   * 修改数据
   */

	}, {
		key: 'putData',
		value: function putData(storeName, data, cb) {
			var store = this.getStore(storeName);

			function put(data) {
				var req = store.put(data);
				req.onsuccess = function (event) {
					if (cb && cb.success) {
						cb.success();
					}
				};
				req.onerror = function (event) {
					if (cb && cb.error) {
						cb.error();
					}
				};
			}

			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					put(data[i]);
				}
			} else {
				put(data);
			}
		}

		/**
   * 按主键删除数据
   */

	}, {
		key: 'deleteDataByKey',
		value: function deleteDataByKey(storeName, value) {
			var store = this.getStore(storeName);
			store.delete(value);
		}

		/**
   * 按indexName获取数据
   */

	}, {
		key: 'getDataByIndex',
		value: function getDataByIndex(storeName, indexName, value, cb) {
			var store = this.getStore(storeName);
			var index$$1 = store.index(indexName);
			index$$1.get(value).onsuccess = function (event) {
				cb(event.target.result);
			};
		}

		/**
   * 获取指定对象库的所有数据
   */

	}, {
		key: 'getAllData',
		value: function getAllData(storeName, cb) {
			var store = this.getStore(storeName),
			    req = store.openCursor(),
			    dataArr = [];
			req.onsuccess = function (event) {
				var cursor = event.target.result;
				if (cursor) {
					dataArr.push(cursor.value);
					cursor.continue();
				} else {
					cb(dataArr);
				}
			};
		}

		/**
   * 用主键获取指定对象库的范围数据
   */

	}, {
		key: 'getRangeDataByKey',
		value: function getRangeDataByKey(storeName, start, end, cb) {
			var store = this.getStore(storeName),
			    range = IDBKeyRange.bound(start, end),
			    dataArr = [],
			    req = store.openCursor(range);

			req.onsuccess = function (event) {
				var cursor = event.target.result;
				if (cursor) {
					dataArr.push(cursor.value);
					cursor.continue();
				} else {
					cb(dataArr);
				}
			};
		}

		/**
   * 清空对象库
   */

	}, {
		key: 'clearStore',
		value: function clearStore(storeName) {
			var store = this.getStore(storeName);
			store.clear();
		}

		/**
   * 删除对象库
   */

	}, {
		key: 'deleteStore',
		value: function deleteStore(storeName) {
			this.db.deleteObjectStore(storeName);
		}
	}]);
	return IndexDB;
}();

}());
