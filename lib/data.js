/**
 * 获取指定对象库的所有数据
 */
function getAllData(store) {
  return new Promise((resolve, reject) => {
    let req = store.openCursor(),
      dataArr = [];

    req.onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        dataArr.push(cursor.value);
        cursor.continue();
      } else {
        resolve(dataArr);
      }
    };

    req.onerror = (event) => {
      reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
    }
  });
}

/**
 * 按indexName获取数据
 */
function getDataByIndex(store, indexName, value) {
  return new Promise((resolve, reject) => {
    const index = store.index(indexName);
    let req = index.get(value);

    req.onsuccess = (event) => {
      resolve(event.target.result);
    }

    req.onerror = (event) => {
      reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
    }
  });
}

/**
 * 用主键获取指定对象库的范围数据
 */
function getRangeDataByKey(store, start, end) {
  return new Promise((resolve, reject) => {
    let range = IDBKeyRange.bound(start, end),
      dataArr = [],
      req = store.openCursor(range);

    req.onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        dataArr.push(cursor.value);
        cursor.continue();
      } else {
        resolve(dataArr);
      }
    };

    req.onerror = (event) => {
      reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
    }
  });
}

/**
 * add a data
 */
function addOneData(store, data) {
  return new Promise((resolve, reject) => {
    const add_data_req = store.add(data);

    add_data_req.onsuccess = (event) => {
      resolve(event.target.result);
    }
    add_data_req.onerror = (event) => {
      reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
    }
  });
}

/**
 * modify a data
 */
function putOneData(store, data) {
  return new Promise((resolve, reject) => {
    const add_data_req = store.put(data);

    put_data_req.onsuccess = (event) => {
      resolve(event.target.result);
    }
    put_data_req.onerror = (event) => {
      reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
    }
  });
}

/**
 * 按主键删除数据
 */
function deleteDataByKey(store, value) {
  store.delete(value);
}

export {
  getAllData,
  getDataByIndex,
  getRangeDataByKey,
  addOneData,
  putOneData,
  deleteDataByKey
}
