(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.IndexDB = factory());
}(this, (function () { 'use strict';

var showError = (function (msg) {
  console.error("[indexdb_api]: " + msg + ".");
});

//cache
var DBs = {};

/**
 * create a new db
 */
function createDB(dbName) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getTime();

  return new Promise(function (resolve, reject) {
    var dbConnect = window.indexedDB.open(dbName, version);
    dbConnect.onsuccess = function (event) {
      //save the opened db
      DBs[dbName] = event.target.result;
      resolve(event.target.result);
    };
    dbConnect.onerror = function (event) {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * delete a existed db
 */
function deleteDB(dbName) {
  return new Promise(function (resolve, reject) {
    var dbConnect = window.indexedDB.deleteDatabase(dbName);
    dbConnect.onsuccess = function () {
      resolve();
    };
    dbConnect.onerror = function (event) {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * open an existed db
 */
function getDB(dbName) {

  return new Promise(function (resolve, reject) {
    getDBNames().then(function (dbNames) {
      //name error
      if (dbNames.indexOf(dbName) < 0) {
        showError('you haven\'t created this named db, use createDB[function] to creat it');
        reject();
      }

      //get db from cache
      if (DBs[dbName]) {
        resolve(DBs[dbName]);
      }

      //get db from connect
      return createDB(dbName);
    }).then(function (db) {
      resolve(db);
    }).catch(function (error) {
      reject(error);
    });
  });
}

/**
 * get all dbnames
 * @return {[type]} [description]
 */
function getDBNames() {
  return new Promise(function (resolve, reject) {
    var get_dbNames_req = window.indexedDB.webkitGetDatabaseNames();

    get_dbNames_req.onsuccess = function (event) {
      var dbNames = Array.prototype.slice.call(event.target.result);
      resolve(dbNames);
    };

    get_dbNames_req.onerror = function (event) {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}



var db = Object.freeze({
	DBs: DBs,
	getDBNames: getDBNames,
	createDB: createDB,
	getDB: getDB,
	deleteDB: deleteDB
});

/**
 * 获取指定对象库的所有数据
 */
function getAllData(store) {

  return new Promise(function (resolve, reject) {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

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
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * 按indexName获取数据
 */
function getDataByIndex(store, indexName, value) {
  return new Promise(function (resolve, reject) {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

    var index = store.index(indexName);
    var req = index.get(value);

    req.onsuccess = function (event) {
      resolve(event.target.result);
    };

    req.onerror = function (event) {
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * 用主键获取指定对象库的范围数据
 */
function getRangeDataByPrimaryKey(store, start, end) {
  return new Promise(function (resolve, reject) {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

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
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * add a data
 */
function addOneData(store, data) {
  return new Promise(function (resolve, reject) {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

    var add_data_req = store.add(data);

    add_data_req.onsuccess = function (event) {
      resolve(event.target.result);
    };
    add_data_req.onerror = function (event) {
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * modify a data
 */
function putOneData(store, data) {
  return new Promise(function (resolve, reject) {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

    var put_data_req = store.put(data);
    put_data_req.onsuccess = function (event) {
      resolve(event.target.result);
    };
    put_data_req.onerror = function (event) {
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * 按主键删除数据
 */
function deleteDataByKey(store, value) {
  if (store instanceof IDBObjectStore) {
    store.delete(value);
    return true;
  } else {
    return false;
  }
}



var data = Object.freeze({
	getAllData: getAllData,
	getDataByIndex: getDataByIndex,
	getRangeDataByPrimaryKey: getRangeDataByPrimaryKey,
	addOneData: addOneData,
	putOneData: putOneData,
	deleteDataByKey: deleteDataByKey
});

function getStore(db, storeName) {
  if (db instanceof IDBDatabase && db.objectStoreNames.contains(storeName)) {
    var tx = db.transaction(storeName, 'readwrite');
    return tx.objectStore(storeName);
  } else {
    console.error('store ' + storeName + ' doesn\'t existes');
    return false;
  }
}

/**
 * create a new store in an existed db
 */
function createStore(_ref) {
  var _ref$dbName = _ref.dbName,
      dbName = _ref$dbName === undefined ? null : _ref$dbName,
      _ref$storeName = _ref.storeName,
      storeName = _ref$storeName === undefined ? null : _ref$storeName,
      _ref$version = _ref.version,
      version = _ref$version === undefined ? new Date().getTime() : _ref$version,
      _ref$keyOptions = _ref.keyOptions,
      keyOptions = _ref$keyOptions === undefined ? {} : _ref$keyOptions,
      _ref$index = _ref.index,
      index = _ref$index === undefined ? [] : _ref$index;

  if (!dbName || !storeName) {
    console.error('dbName and storeName are required');
    return false;
  }

  return new Promise(function (resolve, reject) {
    getDBNames().then(function (dbNames) {
      if (dbNames.indexOf(dbName) < 0) {
        reject(new Error('db ' + dbName + ' doesn\'t existes'));
      }

      if (!DBs[dbName]) {
        reject(new Error('you need call getDB function first'));
      }

      DBs[dbName].close();
      delete DBs[dbName];

      var dbConnect = indexedDB.open(dbName, version);

      dbConnect.onupgradeneeded = function (event) {
        var db = event.target.result;
        DBs[dbName] = db;
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
        reject(new Error(event.target.error.message));
      };
    }).catch(function (error) {
      reject(error);
    });
  });
}

function deleteStore(dbName, storeName) {
  var version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date().getTime();

  return new Promise(function (resolve, reject) {
    getDBNames().then(function (dbNames) {
      if (dbNames.indexOf(dbName) < 0) {
        reject(new Error('db ' + dbName + ' doesn\'t existes'));
      }

      if (!DBs[dbName]) {
        reject(new Error('you need call getDB function first'));
      }

      DBs[dbName].close();
      delete DBs[dbName];

      var dbConnect = indexedDB.open(dbName, version);

      dbConnect.onupgradeneeded = function (event) {
        var db = event.target.result;
        DBs[dbName] = db;
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
          resolve(db);
        } else {
          reject(new Error('store ' + storeName + ' doesn\'t existes'));
        }
      };

      dbConnect.onerror = function (event) {
        reject(new Error(event.target.error.message));
      };
    }).catch(function (error) {
      reject(error);
    });
  });
}

/**
 *获取对象仓库数据量
 */
function getStoreCount(db, storeName) {
  return new Promise(function (resolve, reject) {
    if (!(db instanceof IDBDatabase)) {
      reject(new Error('db parameter should be an instance of IDBDatabase'));
    }

    var store = getStore(db, storeName);
    var store_count_req = store.count();

    store_count_req.onsuccess = function (event) {
      resolve(event.target.result);
    };

    store_count_req.onerror = function (event) {
      reject(new Error(event.target.error.message));
    };
  });
}

function clearStore(store) {
  if (store instanceof IDBObjectStore) {
    store.clear();
    return true;
  } else {
    return false;
  }
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

if (!window.indexedDB) {
  showError('Your browser doesn\'t support indexedDB.');
}

var index = _extends({}, db, data, store);

return index;

})));
