import promise from 'es6-promise';
promise.polyfill();

class IndexDB{

  /**
   * get all the db names
   */
  getDBNames(){
    return new Promise((resolve, reject) => {
      const get_dbNames_req = indexedDB.webkitGetDatabaseNames();

      get_dbNames_req.onsuccess = (event) => {
        const dbNames = Array.prototype.slice.call(event.target.result);
        resolve(dbNames);
      };

      get_dbNames_req.onerror = (event) => {
        reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
      }
    });
  }

  /**
   * create a new db
   */
  createDB(dbName, version = new Date().getTime()){
    return new Promise((resolve, reject) => {
      this.getDBNames().then((dbNames) => {
        if (dbNames.indexOf(dbName) >= 0) {
          throw new Error(`db ${dbName} has existed`);
        }

        const dbConnect = indexedDB.open(dbName, version);
        dbConnect.onsuccess = (event) => {
          resolve(event.target.result);
        };
        dbConnect.onerror = (event) => {
          reject(event.target.errorCode);
        };
      }).catch((error) => {
        reject(error);
      })
    });
  }

  /**
   * open an existed db
   */
  openDB(dbName, version = new Date().getTime()) {
    return new Promise((resolve, reject) => {
      this.getDBNames().then((dbNames) => {
        if (dbNames.indexOf(dbName) >= 0) {
          const dbConnect = indexedDB.open(dbName, version);

          dbConnect.onsuccess = (event) => {
            resolve(event.target.result);
          };
          dbConnect.onerror = (event) => {
            reject(event);
          };
        } else {
          throw new Error(`db ${dbName} doesn't existes`);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * create a new store in an existed db
   */
  createStore({
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
      this.getDBNames().then((dbNames) => {
        if (dbNames.indexOf(dbName) >= 0) {
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
          }
        } else {
          throw new Error(`db ${dbName} doesn't existes`);
        }
      }).catch((error) => {
        reject(error);
      });
    });
	}

  getStore(db, storeName) {
    if (db.objectStoreNames.contains(storeName)) {
      const tx = db.transaction(storeName, 'readwrite');
      return tx.objectStore(storeName);
    } else {
      console.error(`store ${storeName} doesn't existes`);
    }
	}

  /**
   *获取对象仓库数据量
   */
	getStoreCount(db, storeName) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(db, storeName);
      const store_count_req = store.count();

      store_count_req.onsuccess = (event) => {
        resolve(event.target.result);
      };

      store_count_req.onerror = (event) => {
        reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
      }
    });
	}

  /**
   * 获取指定对象库的所有数据
   */
  getAllData(store) {
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
  getDataByIndex(store, indexName, value) {
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
  getRangeDataByKey(store, start, end) {
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
  addOneData(store, data) {
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
  putOneData(store, data) {
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

  clearStore(store) {
		store.clear();
	}

  deleteStore(db, storeName) {
    if (db.objectStoreNames.contains(storeName)) {
      db.deleteObjectStore(storeName);
    } else {
      console.error(`store ${storeName} doesn't existes`);
    }
	}

  /**
   * 按主键删除数据
   */
	deleteDataByKey(store, value) {
    store.delete(value);
  }
}

export default IndexDB;