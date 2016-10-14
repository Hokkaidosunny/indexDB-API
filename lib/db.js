const DBs = {};

function getDBNames() {
  return new Promise((resolve, reject) => {
    const get_dbNames_req = window.indexedDB.webkitGetDatabaseNames();

    get_dbNames_req.onsuccess = (event) => {
      const dbNames = Array.prototype.slice.call(event.target.result);
      resolve(dbNames);
    };

    get_dbNames_req.onerror = (event) => {
      reject(new Error(`error, db errorCode: ${event.target.errorCode}`));
    };
  });
}

/**
 * create a new db
 */
function createDB(dbName, version = new Date().getTime()) {
  return new Promise((resolve, reject) => {
    getDBNames().then((dbNames) => {
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
    });
  });
}

/**
 * open an existed db
 */
function getDB(dbName, version = new Date().getTime()) {
  return new Promise((resolve, reject) => {
    getDBNames().then((dbNames) => {
      if (dbNames.indexOf(dbName) >= 0) {

        //delete the db in the DBs
        for (let key in DBs) {
          if (key == dbName) {
            DBs[dbName].close();
            delete DBs[dbName];
          }
        }

        const dbConnect = indexedDB.open(dbName, version);

        dbConnect.onsuccess = (event) => {
          DBs[dbName] = event.target.result;
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

export {
  DBs,
  getDBNames,
  createDB,
  getDB
};
