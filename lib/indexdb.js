/**
 * get object values
 * @return {Array}
 */
function _objectValues(obj){
  if ((obj instanceof Object) && (typeof obj.length === 'undefined')) {
    let values = [];
    for (let key in obj) {
      values.push(obj[key]);
    }
    return values;
  } else {
    console.error(`${obj} expected to be an Object`);
    return false;
  }
}

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
}

export default IndexDB;
