(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.IndexDB = factory());
}(this, (function () { 'use strict';

function getDBNames() {
  return new Promise(function (resolve, reject) {
    var get_dbNames_req = indexedDB.webkitGetDatabaseNames();

    get_dbNames_req.onsuccess = function (event) {
      var dbNames = Array.prototype.slice.call(event.target.result);
      resolve(dbNames);
    };

    get_dbNames_req.onerror = function (event) {
      reject(new Error("error, db errorCode: " + event.target.errorCode));
    };
  });
}

/**
 * create a new db
 */
function createDB(dbName) {
  var version = arguments.length <= 1 || arguments[1] === undefined ? new Date().getTime() : arguments[1];

  return new Promise(function (resolve, reject) {
    getDBNames().then(function (dbNames) {
      if (dbNames.indexOf(dbName) >= 0) {
        throw new Error("db " + dbName + " has existed");
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
}

/**
 * open an existed db
 */
function openDB(dbName) {
  var version = arguments.length <= 1 || arguments[1] === undefined ? new Date().getTime() : arguments[1];

  return new Promise(function (resolve, reject) {
    getDBNames().then(function (dbNames) {
      if (dbNames.indexOf(dbName) >= 0) {
        var dbConnect = indexedDB.open(dbName, version);

        dbConnect.onsuccess = function (event) {
          resolve(event.target.result);
        };
        dbConnect.onerror = function (event) {
          reject(event);
        };
      } else {
        throw new Error("db " + dbName + " doesn't existes");
      }
    }).catch(function (error) {
      reject(error);
    });
  });
}



var db = Object.freeze({
	getDBNames: getDBNames,
	createDB: createDB,
	openDB: openDB
});

/**
 * 获取指定对象库的所有数据
 */
function getAllData(store) {
  return new Promise(function (resolve, reject) {
    var req = store.openCursor(),
        dataArr = [];

    req.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        dataArr.push(cursor.value);
        cursor.continue();
      } else {
        resolve(dataArr);
      }
    };

    req.onerror = function (event) {
      reject(new Error("error, db errorCode: " + event.target.errorCode));
    };
  });
}

/**
 * 按indexName获取数据
 */
function getDataByIndex(store, indexName, value) {
  return new Promise(function (resolve, reject) {
    var index = store.index(indexName);
    var req = index.get(value);

    req.onsuccess = function (event) {
      resolve(event.target.result);
    };

    req.onerror = function (event) {
      reject(new Error("error, db errorCode: " + event.target.errorCode));
    };
  });
}

/**
 * 用主键获取指定对象库的范围数据
 */
function getRangeDataByKey(store, start, end) {
  return new Promise(function (resolve, reject) {
    var range = IDBKeyRange.bound(start, end),
        dataArr = [],
        req = store.openCursor(range);

    req.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        dataArr.push(cursor.value);
        cursor.continue();
      } else {
        resolve(dataArr);
      }
    };

    req.onerror = function (event) {
      reject(new Error("error, db errorCode: " + event.target.errorCode));
    };
  });
}

/**
 * add a data
 */
function addOneData(store, data) {
  return new Promise(function (resolve, reject) {
    var add_data_req = store.add(data);

    add_data_req.onsuccess = function (event) {
      resolve(event.target.result);
    };
    add_data_req.onerror = function (event) {
      reject(new Error("error, db errorCode: " + event.target.errorCode));
    };
  });
}

/**
 * modify a data
 */
function putOneData(store, data) {
  return new Promise(function (resolve, reject) {
    var add_data_req = store.put(data);

    put_data_req.onsuccess = function (event) {
      resolve(event.target.result);
    };
    put_data_req.onerror = function (event) {
      reject(new Error("error, db errorCode: " + event.target.errorCode));
    };
  });
}

/**
 * 按主键删除数据
 */
function deleteDataByKey(store, value) {
  store.delete(value);
}



var data = Object.freeze({
	getAllData: getAllData,
	getDataByIndex: getDataByIndex,
	getRangeDataByKey: getRangeDataByKey,
	addOneData: addOneData,
	putOneData: putOneData,
	deleteDataByKey: deleteDataByKey
});

function getStore(db, storeName) {
  if (db.objectStoreNames.contains(storeName)) {
    var tx = db.transaction(storeName, 'readwrite');
    return tx.objectStore(storeName);
  } else {
    console.error('store ' + storeName + ' doesn\'t existes');
  }
}

/**
 * create a new store in an existed db
 */
function createStore(_ref) {
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
    getDBNames().then(function (dbNames) {
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
}

function deleteStore(db, storeName) {
  if (db.objectStoreNames.contains(storeName)) {
    db.deleteObjectStore(storeName);
  } else {
    console.error('store ' + storeName + ' doesn\'t existes');
  }
}

/**
 *获取对象仓库数据量
 */
function getStoreCount(db, storeName) {
  return new Promise(function (resolve, reject) {
    var store = getStore(db, storeName);
    var store_count_req = store.count();

    store_count_req.onsuccess = function (event) {
      resolve(event.target.result);
    };

    store_count_req.onerror = function (event) {
      reject(new Error('error, db errorCode: ' + event.target.errorCode));
    };
  });
}

function clearStore(store) {
  store.clear();
}



var store = Object.freeze({
	getStore: getStore,
	createStore: createStore,
	getStoreCount: getStoreCount,
	deleteStore: deleteStore,
	clearStore: clearStore
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
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

var index = _extends({}, db, data, store);

return index;

})));
