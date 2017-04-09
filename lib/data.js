import showError from './showError.js';

/**
 * [getAllData description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
function getAllData(store) {

  return new Promise((resolve, reject) => {

    if (!isStoreInstance(store)) {
      reject();
    }

    const req = store.openCursor(),
          dataArr = [];

    req.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        dataArr.push(cursor.value);
        cursor.continue();
      } else {
        resolve(dataArr);
      }
    };

    req.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * [getDataByIndex description]
 * @param  {[type]} store     [description]
 * @param  {[type]} indexName [description]
 * @param  {[type]} value     [description]
 * @return {[type]}           [description]
 */
function getDataByIndex(store, indexName, value) {
  return new Promise((resolve, reject) => {

    if (!isStoreInstance(store)) {
      reject();
    }

    const index = store.index(indexName);
    const req = index.get(value);

    req.onsuccess = (event) => {
      resolve(event.target.result);
    };

    req.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * 用主键获取指定对象库的范围数据
 */
function getRangeDataByPrimaryKey(store, start, end) {
  return new Promise((resolve, reject) => {

    if (!isStoreInstance(store)) {
      reject();
    }

    const range = IDBKeyRange.bound(start, end),
          dataArr = [],
          req = store.openCursor(range);

    req.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        dataArr.push(cursor.value);
        cursor.continue();
      } else {
        resolve(dataArr);
      }
    };

    req.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * [addOneData description]
 * @param {[type]} store [description]
 * @param {[type]} data  [description]
 */
function addOneData(store, data) {
  return new Promise((resolve, reject) => {

    if (!isStoreInstance(store)) {
      reject();
    }

    const add_data_req = store.add(data);

    add_data_req.onsuccess = (event) => {
      //event.target.result is the count of the data
      resolve(event.target.result);
    };
    add_data_req.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * update a data accoring to the primary key
 * you can use putOneData to add a data, when the primary is the same, then putOneData will update the old data
 */
function putOneData(store, data) {
  return new Promise((resolve, reject) => {

    if (!isStoreInstance(store)) {
      reject();
    }

    const put_data_req = store.put(data);
    put_data_req.onsuccess = (event) => {
      resolve(event.target.result);
    };
    put_data_req.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * 按主键删除数据
 */
function deleteDataByPrimaKey(store, primaryKeyValue) {
  if (isStoreInstance(store)) {
    store.delete(primaryKeyValue);
    return true;
  } else {
    return false;
  }
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

export {
  getAllData,
  getDataByIndex,
  getRangeDataByPrimaryKey,
  addOneData,
  putOneData,
  deleteDataByPrimaKey
};
