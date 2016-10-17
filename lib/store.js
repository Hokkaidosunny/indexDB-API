import { getDBNames, DBs } from './db.js';

function getStore(db, storeName) {
  if (db instanceof IDBDatabase && db.objectStoreNames.contains(storeName)) {
    const tx = db.transaction(storeName, 'readwrite');
    return tx.objectStore(storeName);
  } else {
    console.error(`store ${storeName} doesn't existes`);
    return false;
  }
}

/**
 * create a new store in an existed db
 */
function createStore({
  dbName = null,
  storeName = null,
  version = new Date().getTime(),
  keyOptions = {},
  index = []
}) {
  if (!dbName || !storeName) {
    console.error(`dbName and storeName are required`);
    return false;
  }

  return new Promise((resolve, reject) => {
    getDBNames().then((dbNames) => {
      if (dbNames.indexOf(dbName) < 0) {
        reject(new Error(`db ${dbName} doesn't existes`));
      }

      if (!DBs[dbName]) {
        reject(new Error(`you need call getDB function first`));
      }

      DBs[dbName].close();
      delete DBs[dbName];

      const dbConnect = indexedDB.open(dbName, version);

      dbConnect.onupgradeneeded = (event) => {
        const db = event.target.result;
        DBs[dbName] = db;
        if (db.objectStoreNames.contains(storeName)) {  //是否已存在该对象库
          reject(new Error(`storeName ${storeName} has existed`));
        } else {
          const store = db.createObjectStore(storeName, keyOptions); //创建对象库
          for (let i in index) {  //创建索引
            store.createIndex(
              index[i].indexName,
              index[i].indexKey,
              index[i].indexOptions
            );
          }
          resolve(store);
        }
      };

      dbConnect.onerror = (event) => {
        reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
      };
    }).catch((error) => {
      reject(error);
    });
  });
}

function deleteStore(dbName, storeName, version = new Date().getTime()) {
  return new Promise((resolve, reject) => {
    getDBNames().then((dbNames) => {
      if (dbNames.indexOf(dbName) < 0) {
        reject(new Error(`db ${dbName} doesn't existes`));
      }

      if (!DBs[dbName]) {
        reject(new Error(`you need call getDB function first`));
      }

      DBs[dbName].close();
      delete DBs[dbName];

      const dbConnect = indexedDB.open(dbName, version);

      dbConnect.onupgradeneeded = (event) => {
        const db = event.target.result;
        DBs[dbName] = db;
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
          resolve(db);
        } else {
          reject(new Error(`store ${storeName} doesn't existes`));
        }

      };

      dbConnect.onerror = (event) => {
        reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
      };
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 *获取对象仓库数据量
 */
function getStoreCount(db, storeName) {
  return new Promise((resolve, reject) => {
    if (!(db instanceof IDBDatabase)) {
      reject(new Error('db parameter should be an instance of IDBDatabase'));
    }

    const store = getStore(db, storeName);
    const store_count_req = store.count();

    store_count_req.onsuccess = (event) => {
      resolve(event.target.result);
    };

    store_count_req.onerror = (event) => {
      reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
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

export {
  getStore,
  createStore,
  getStoreCount,
  deleteStore,
  clearStore
};
