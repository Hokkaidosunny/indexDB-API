import { getDB } from './db.js';

function getStore(db, storeName) {
  if (db.objectStoreNames.contains(storeName)) {
    const tx = db.transaction(storeName, 'readwrite');
    return tx.objectStore(storeName);
  } else {
    console.error(`store ${storeName} doesn't existes`);
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
    getDB(dbName).then((db) => {

      db.close();

      const dbConnect = indexedDB.open(dbName, version);

      dbConnect.onupgradeneeded = (event) => {
        const db = event.target.result;
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

function deleteStore(db, storeName) {
  if (db.objectStoreNames.contains(storeName)) {
    db.deleteObjectStore(storeName);
  } else {
    console.error(`store ${storeName} doesn't existes`);
  }
}

/**
 *获取对象仓库数据量
 */
function getStoreCount(db, storeName) {
  return new Promise((resolve, reject) => {
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
  store.clear();
}

export {
  getStore,
  createStore,
  getStoreCount,
  deleteStore,
  clearStore
};
