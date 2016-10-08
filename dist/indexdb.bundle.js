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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL2xpYi9kYi5qcyIsIi4uL2xpYi9kYXRhLmpzIiwiLi4vbGliL3N0b3JlLmpzIiwiLi4vbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGdldERCTmFtZXMoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgZ2V0X2RiTmFtZXNfcmVxID0gaW5kZXhlZERCLndlYmtpdEdldERhdGFiYXNlTmFtZXMoKTtcblxuICAgIGdldF9kYk5hbWVzX3JlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGRiTmFtZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIHJlc29sdmUoZGJOYW1lcyk7XG4gICAgfTtcblxuICAgIGdldF9kYk5hbWVzX3JlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICByZWplY3QobmV3IEVycm9yKGBlcnJvciwgZGIgZXJyb3JDb2RlOiAke2V2ZW50LnRhcmdldC5lcnJvckNvZGV9YCkpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogY3JlYXRlIGEgbmV3IGRiXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURCKGRiTmFtZSwgdmVyc2lvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpKXtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBnZXREQk5hbWVzKCkudGhlbigoZGJOYW1lcykgPT4ge1xuICAgICAgaWYgKGRiTmFtZXMuaW5kZXhPZihkYk5hbWUpID49IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBkYiAke2RiTmFtZX0gaGFzIGV4aXN0ZWRgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGJDb25uZWN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lLCB2ZXJzaW9uKTtcbiAgICAgIGRiQ29ubmVjdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICBkYkNvbm5lY3Qub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yQ29kZSk7XG4gICAgICB9O1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KVxuICB9KTtcbn1cblxuLyoqXG4gKiBvcGVuIGFuIGV4aXN0ZWQgZGJcbiAqL1xuZnVuY3Rpb24gb3BlbkRCKGRiTmFtZSwgdmVyc2lvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZ2V0REJOYW1lcygpLnRoZW4oKGRiTmFtZXMpID0+IHtcbiAgICAgIGlmIChkYk5hbWVzLmluZGV4T2YoZGJOYW1lKSA+PSAwKSB7XG4gICAgICAgIGNvbnN0IGRiQ29ubmVjdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgdmVyc2lvbik7XG5cbiAgICAgICAgZGJDb25uZWN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIGRiQ29ubmVjdC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZGIgJHtkYk5hbWV9IGRvZXNuJ3QgZXhpc3Rlc2ApO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIGdldERCTmFtZXMsXG4gIGNyZWF0ZURCLFxuICBvcGVuREJcbn07XG4iLCIvKipcbiAqIOiOt+WPluaMh+WumuWvueixoeW6k+eahOaJgOacieaVsOaNrlxuICovXG5mdW5jdGlvbiBnZXRBbGxEYXRhKHN0b3JlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHJlcSA9IHN0b3JlLm9wZW5DdXJzb3IoKSxcbiAgICAgIGRhdGFBcnIgPSBbXTtcblxuICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgIGxldCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICBkYXRhQXJyLnB1c2goY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKGRhdGFBcnIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXEub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihgZXJyb3IsIGRiIGVycm9yQ29kZTogJHtldmVudC50YXJnZXQuZXJyb3JDb2RlfWApKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIOaMiWluZGV4TmFtZeiOt+WPluaVsOaNrlxuICovXG5mdW5jdGlvbiBnZXREYXRhQnlJbmRleChzdG9yZSwgaW5kZXhOYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RvcmUuaW5kZXgoaW5kZXhOYW1lKTtcbiAgICBsZXQgcmVxID0gaW5kZXguZ2V0KHZhbHVlKTtcblxuICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgfVxuXG4gICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoYGVycm9yLCBkYiBlcnJvckNvZGU6ICR7ZXZlbnQudGFyZ2V0LmVycm9yQ29kZX1gKSk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiDnlKjkuLvplK7ojrflj5bmjIflrprlr7nosaHlupPnmoTojIPlm7TmlbDmja5cbiAqL1xuZnVuY3Rpb24gZ2V0UmFuZ2VEYXRhQnlLZXkoc3RvcmUsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgcmFuZ2UgPSBJREJLZXlSYW5nZS5ib3VuZChzdGFydCwgZW5kKSxcbiAgICAgIGRhdGFBcnIgPSBbXSxcbiAgICAgIHJlcSA9IHN0b3JlLm9wZW5DdXJzb3IocmFuZ2UpO1xuXG4gICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgbGV0IGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgIGRhdGFBcnIucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZGF0YUFycik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICByZWplY3QobmV3IEVycm9yKGBlcnJvciwgZGIgZXJyb3JDb2RlOiAke2V2ZW50LnRhcmdldC5lcnJvckNvZGV9YCkpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogYWRkIGEgZGF0YVxuICovXG5mdW5jdGlvbiBhZGRPbmVEYXRhKHN0b3JlLCBkYXRhKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgYWRkX2RhdGFfcmVxID0gc3RvcmUuYWRkKGRhdGEpO1xuXG4gICAgYWRkX2RhdGFfcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICB9XG4gICAgYWRkX2RhdGFfcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoYGVycm9yLCBkYiBlcnJvckNvZGU6ICR7ZXZlbnQudGFyZ2V0LmVycm9yQ29kZX1gKSk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBtb2RpZnkgYSBkYXRhXG4gKi9cbmZ1bmN0aW9uIHB1dE9uZURhdGEoc3RvcmUsIGRhdGEpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBhZGRfZGF0YV9yZXEgPSBzdG9yZS5wdXQoZGF0YSk7XG5cbiAgICBwdXRfZGF0YV9yZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgIH1cbiAgICBwdXRfZGF0YV9yZXEub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihgZXJyb3IsIGRiIGVycm9yQ29kZTogJHtldmVudC50YXJnZXQuZXJyb3JDb2RlfWApKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIOaMieS4u+mUruWIoOmZpOaVsOaNrlxuICovXG5mdW5jdGlvbiBkZWxldGVEYXRhQnlLZXkoc3RvcmUsIHZhbHVlKSB7XG4gIHN0b3JlLmRlbGV0ZSh2YWx1ZSk7XG59XG5cbmV4cG9ydCB7XG4gIGdldEFsbERhdGEsXG4gIGdldERhdGFCeUluZGV4LFxuICBnZXRSYW5nZURhdGFCeUtleSxcbiAgYWRkT25lRGF0YSxcbiAgcHV0T25lRGF0YSxcbiAgZGVsZXRlRGF0YUJ5S2V5XG59XG4iLCJpbXBvcnQgeyBnZXREQk5hbWVzIH0gZnJvbSAnLi9kYi5qcyc7XG5cbmZ1bmN0aW9uIGdldFN0b3JlKGRiLCBzdG9yZU5hbWUpIHtcbiAgaWYgKGRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoc3RvcmVOYW1lKSkge1xuICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZHdyaXRlJyk7XG4gICAgcmV0dXJuIHR4Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihgc3RvcmUgJHtzdG9yZU5hbWV9IGRvZXNuJ3QgZXhpc3Rlc2ApO1xuICB9XG59XG5cbi8qKlxuICogY3JlYXRlIGEgbmV3IHN0b3JlIGluIGFuIGV4aXN0ZWQgZGJcbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3RvcmUoe1xuICBkYk5hbWUgPSBudWxsLFxuICBzdG9yZU5hbWUgPSBudWxsLFxuICB2ZXJzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gIGtleU9wdGlvbnMgPSB7fSxcbiAgaW5kZXggPSBbXVxufSkge1xuICBpZiAoIWRiTmFtZSB8fCAhc3RvcmVOYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihgZGJOYW1lIGFuZCBzdG9yZU5hbWUgYXJlIHJlcXVpcmVkYCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBnZXREQk5hbWVzKCkudGhlbigoZGJOYW1lcykgPT4ge1xuICAgICAgaWYgKGRiTmFtZXMuaW5kZXhPZihkYk5hbWUpID49IDApIHtcbiAgICAgICAgY29uc3QgZGJDb25uZWN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lLCB2ZXJzaW9uKTtcblxuICAgICAgICBkYkNvbm5lY3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgIGlmIChkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHN0b3JlTmFtZSkpIHsgIC8v5piv5ZCm5bey5a2Y5Zyo6K+l5a+56LGh5bqTXG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBzdG9yZU5hbWUgJHtzdG9yZU5hbWV9IGhhcyBleGlzdGVkYCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSwga2V5T3B0aW9ucyk7IC8v5Yib5bu65a+56LGh5bqTXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGluZGV4KSB7ICAvL+WIm+W7uue0ouW8lVxuICAgICAgICAgICAgICBzdG9yZS5jcmVhdGVJbmRleChcbiAgICAgICAgICAgICAgICBpbmRleFtpXS5pbmRleE5hbWUsXG4gICAgICAgICAgICAgICAgaW5kZXhbaV0uaW5kZXhLZXksXG4gICAgICAgICAgICAgICAgaW5kZXhbaV0uaW5kZXhPcHRpb25zXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKHN0b3JlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZGJDb25uZWN0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBlcnJvciwgZGIgZXJyb3JDb2RlOiAke2V2ZW50LnRhcmdldC5lcnJvckNvZGV9YCkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGRiICR7ZGJOYW1lfSBkb2Vzbid0IGV4aXN0ZXNgKTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVTdG9yZShkYiwgc3RvcmVOYW1lKSB7XG4gIGlmIChkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHN0b3JlTmFtZSkpIHtcbiAgICBkYi5kZWxldGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoYHN0b3JlICR7c3RvcmVOYW1lfSBkb2Vzbid0IGV4aXN0ZXNgKTtcbiAgfVxufVxuXG4vKipcbiAq6I635Y+W5a+56LGh5LuT5bqT5pWw5o2u6YePXG4gKi9cbmZ1bmN0aW9uIGdldFN0b3JlQ291bnQoZGIsIHN0b3JlTmFtZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHN0b3JlID0gZ2V0U3RvcmUoZGIsIHN0b3JlTmFtZSk7XG4gICAgY29uc3Qgc3RvcmVfY291bnRfcmVxID0gc3RvcmUuY291bnQoKTtcblxuICAgIHN0b3JlX2NvdW50X3JlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgfTtcblxuICAgIHN0b3JlX2NvdW50X3JlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICByZWplY3QobmV3IEVycm9yKGBlcnJvciwgZGIgZXJyb3JDb2RlOiAke2V2ZW50LnRhcmdldC5lcnJvckNvZGV9YCkpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyU3RvcmUoc3RvcmUpIHtcbiAgc3RvcmUuY2xlYXIoKTtcbn1cblxuZXhwb3J0IHtcbiAgZ2V0U3RvcmUsXG4gIGNyZWF0ZVN0b3JlLFxuICBnZXRTdG9yZUNvdW50LFxuICBkZWxldGVTdG9yZSxcbiAgY2xlYXJTdG9yZVxufTtcbiIsImltcG9ydCAqIGFzIGRiIGZyb20gJy4vZGIuanMnO1xuaW1wb3J0ICogYXMgZGF0YSBmcm9tICcuL2RhdGEuanMnO1xuaW1wb3J0ICogYXMgc3RvcmUgZnJvbSAnLi9zdG9yZS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLi4uZGIsXG4gIC4uLmRhdGEsXG4gIC4uLnN0b3JlXG59XG4iXSwibmFtZXMiOlsiZ2V0REJOYW1lcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0X2RiTmFtZXNfcmVxIiwiaW5kZXhlZERCIiwid2Via2l0R2V0RGF0YWJhc2VOYW1lcyIsIm9uc3VjY2VzcyIsImV2ZW50IiwiZGJOYW1lcyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwidGFyZ2V0IiwicmVzdWx0Iiwib25lcnJvciIsIkVycm9yIiwiZXJyb3JDb2RlIiwiY3JlYXRlREIiLCJkYk5hbWUiLCJ2ZXJzaW9uIiwiRGF0ZSIsImdldFRpbWUiLCJ0aGVuIiwiaW5kZXhPZiIsImRiQ29ubmVjdCIsIm9wZW4iLCJjYXRjaCIsImVycm9yIiwib3BlbkRCIiwiZ2V0QWxsRGF0YSIsInN0b3JlIiwicmVxIiwib3BlbkN1cnNvciIsImRhdGFBcnIiLCJjdXJzb3IiLCJwdXNoIiwidmFsdWUiLCJjb250aW51ZSIsImdldERhdGFCeUluZGV4IiwiaW5kZXhOYW1lIiwiaW5kZXgiLCJnZXQiLCJnZXRSYW5nZURhdGFCeUtleSIsInN0YXJ0IiwiZW5kIiwicmFuZ2UiLCJJREJLZXlSYW5nZSIsImJvdW5kIiwiYWRkT25lRGF0YSIsImRhdGEiLCJhZGRfZGF0YV9yZXEiLCJhZGQiLCJwdXRPbmVEYXRhIiwicHV0IiwiZGVsZXRlRGF0YUJ5S2V5IiwiZGVsZXRlIiwiZ2V0U3RvcmUiLCJkYiIsInN0b3JlTmFtZSIsIm9iamVjdFN0b3JlTmFtZXMiLCJjb250YWlucyIsInR4IiwidHJhbnNhY3Rpb24iLCJvYmplY3RTdG9yZSIsImNyZWF0ZVN0b3JlIiwia2V5T3B0aW9ucyIsIm9udXBncmFkZW5lZWRlZCIsImNyZWF0ZU9iamVjdFN0b3JlIiwiaSIsImNyZWF0ZUluZGV4IiwiaW5kZXhLZXkiLCJpbmRleE9wdGlvbnMiLCJkZWxldGVTdG9yZSIsImRlbGV0ZU9iamVjdFN0b3JlIiwiZ2V0U3RvcmVDb3VudCIsInN0b3JlX2NvdW50X3JlcSIsImNvdW50IiwiY2xlYXJTdG9yZSIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxTQUFTQSxVQUFULEdBQXNCO1NBQ2IsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtRQUNoQ0Msa0JBQWtCQyxVQUFVQyxzQkFBVixFQUF4Qjs7b0JBRWdCQyxTQUFoQixHQUE0QixV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
