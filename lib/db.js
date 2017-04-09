import showError from './showError.js';

//cache
const DBs = {};

/**
 * create a new db
 */
function createDB(dbName, version = new Date().getTime()) {
  return new Promise((resolve, reject) => {
    const dbConnect = window.indexedDB.open(dbName, version);
    dbConnect.onsuccess = (event) => {
      //save the opened db
      DBs[dbName] = event.target.result;
      resolve(event.target.result);
    };
    dbConnect.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}


/**
 * delete a existed db
 */
function deleteDB(dbName) {
  return new Promise((resolve, reject) => {
    const dbConnect = window.indexedDB.deleteDatabase(dbName);
    dbConnect.onsuccess = () => {
      resolve();
    };
    dbConnect.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

/**
 * open an existed db
 */
function getDB(dbName) {

  return new Promise((resolve, reject) => {
    //get db from cache
    if (DBs[dbName]) {
      resolve(DBs[dbName]);
      return;
    }

    //get db from connect
    createDB(dbName).then((db) => {
      resolve(db);
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * get all dbnames
 * @return {[type]} [description]
 */
function getDBNames() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB.webkitGetDatabaseNames) {
      showError('your browser doesn\'t support indexedDB.webkitGetDatabaseNames');
      resolve([]);
      return;
    }
    const get_dbNames_req = window.indexedDB.webkitGetDatabaseNames();

    get_dbNames_req.onsuccess = (event) => {
      const dbNames = Array.prototype.slice.call(event.target.result);
      resolve(dbNames);
    };

    get_dbNames_req.onerror = (event) => {
      showError(event.target.error.message);
      reject(event.target.error);
    };
  });
}

export {
  DBs,
  getDBNames,
  createDB,
  getDB,
  deleteDB
};
