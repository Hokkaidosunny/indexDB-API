import showError from './showError.js';
import {getDB} from './db.js';

/**
 * [getAllData description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
function getAllData(dbName, storeName) {

  return new Promise((resolve, reject) => {
    getDB(dbName).then((db) => {
      if (!isStoreNameCorrect(db, storeName)) {
        reject();
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.oncomplete = function() {
        resolve(dataArr);
      };

      const req = store.openCursor(),
            dataArr = [];

      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          dataArr.push(cursor.value);
          cursor.continue();
        }
      };

      req.onerror = (event) => {
        showError(event.target.error.message);
        reject(event.target.error);
      };
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * [getDataByIndex description]
 * @param  {[type]} store     [description]
 * @param  {[type]} indexName [description]
 * @param  {[type]} value     [description]
 * @return {[type]}           [description]
 */
function getDataByIndex(dbName, storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    getDB(dbName).then((db) => {
      if (!isStoreNameCorrect(db, storeName)) {
        reject();
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.oncomplete = function() {
        resolve(data);
      };

      const index = store.index(indexName);
      const req = index.get(value);
      let data;

      req.onsuccess = (event) => {
        data = event.target.result;
      };

      req.onerror = (event) => {
        showError(event.target.error.message);
        reject(event.target.error);
      };
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * 用主键获取指定对象库的范围数据
 */
function getRangeDataByPrimaryKey(dbName, storeName, start, end) {
  return new Promise((resolve, reject) => {
    getDB(dbName).then((db) => {
      if (!isStoreNameCorrect(db, storeName)) {
        reject();
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.oncomplete = function() {
        resolve(dataArr);
      };

      const range = IDBKeyRange.bound(start, end),
            dataArr = [],
            req = store.openCursor(range);

      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          dataArr.push(cursor.value);
          cursor.continue();
        }
      };

      req.onerror = (event) => {
        showError(event.target.error.message);
        reject(event.target.error);
      };
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * addOneData
 */

function addOneData(dbName, storeName, data) {
  return new Promise((resolve, reject) => {
    getDB(dbName).then((db) => {
      if (!isStoreNameCorrect(db, storeName)) {
        reject();
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.oncomplete = function() {
        resolve(count);
      };

      const add_data_req = store.add(data);
      let count;

      add_data_req.onsuccess = (event) => {
        //event.target.result is the count of the data
        count = event.target.result;
      };
      add_data_req.onerror = (event) => {
        showError(event.target.error.message);
        reject(event.target.error);
      };
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * update a data accoring to the primary key
 * you can use putOneData to add a data, when the primary is the same, then putOneData will update the old data
 */
function putOneData(dbName, storeName, data) {
  return new Promise((resolve, reject) => {
    getDB(dbName).then((db) => {
      if (!isStoreNameCorrect(db, storeName)) {
        reject();
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.oncomplete = function() {
        resolve(count);
      };

      const put_data_req = store.put(data);
      let count;

      put_data_req.onsuccess = (event) => {
        count = event.target.result;
      };
      put_data_req.onerror = (event) => {
        showError(event.target.error.message);
        reject(event.target.error);
      };
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * 按主键删除数据
 */
function deleteDataByPrimaKey(dbName, storeName, primaryKeyValue) {
  return new Promise((resolve, reject) => {
    getDB(dbName).then((db) => {
      if (!isStoreNameCorrect(db, storeName)) {
        reject();
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.oncomplete = function() {
        resolve(true);
      };

      store.delete(primaryKeyValue);

    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * check store
 * @param  {[type]}  store [description]
 * @return {Boolean}       [description]
 */
function isStoreInstance(store) {
  if (!(store instanceof IDBObjectStore)) {
    showError('store parameter should be an instance of IDBObjectStore');
    return false;
  } else {
    return true;
  }
}

function isStoreNameCorrect(db, storeName) {
  if (db.objectStoreNames.contains(storeName)) {
    return true;
  } else {
    showError(`store ${storeName} doesn't existes`);
    return false;
  }
}

export {
  getAllData,
  getDataByIndex,
  getRangeDataByPrimaryKey,
  addOneData,
  putOneData,
  deleteDataByPrimaKey
};
