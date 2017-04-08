/**
 * 获取指定对象库的所有数据
 */
function getAllData(store) {

  return new Promise((resolve, reject) => {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
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
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * 按indexName获取数据
 */
function getDataByIndex(store, indexName, value) {
  return new Promise((resolve, reject) => {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

    const index = store.index(indexName);
    const req = index.get(value);

    req.onsuccess = (event) => {
      resolve(event.target.result);
    };

    req.onerror = (event) => {
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * 用主键获取指定对象库的范围数据
 */
function getRangeDataByPrimaryKey(store, start, end) {
  return new Promise((resolve, reject) => {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
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
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * add a data
 */
function addOneData(store, data) {
  return new Promise((resolve, reject) => {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

    const add_data_req = store.add(data);

    add_data_req.onsuccess = (event) => {
      resolve(event.target.result);
    };
    add_data_req.onerror = (event) => {
      reject(new Error(event.target.error.message));
    };
  });
}

/**
 * modify a data
 */
function putOneData(store, data) {
  return new Promise((resolve, reject) => {

    if (!(store instanceof IDBObjectStore)) {
      reject(new Error('store parameter should be an instance of IDBObjectStore'));
    }

    const put_data_req = store.put(data);
    put_data_req.onsuccess = (event) => {
      resolve(event.target.result);
    };
    put_data_req.onerror = (event) => {
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

export {
  getAllData,
  getDataByIndex,
  getRangeDataByPrimaryKey,
  addOneData,
  putOneData,
  deleteDataByKey
};
