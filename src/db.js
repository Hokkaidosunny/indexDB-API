import { timeStamp } from './util'

/**
 * DB pool
 */
const DBs = {}

/**
 * create/open a new DB
 * @param {*} dbName
 * @param {*} version
 */
function openDB(dbName, listener = {}, version = timeStamp()) {
  const { onupgradeneeded } = listener

  closeDB(dbName)

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, version)

    req.onsuccess = event => {
      DBs[dbName] = event.target.result //save the opened db

      resolve(event.target.result)
    }

    req.onupgradeneeded = onupgradeneeded

    req.onerror = reject
  })
}

/**
 * close a DB
 * @param {*} dbName
 */
function closeDB(dbName) {
  const curDB = DBs[dbName]

  if (curDB) {
    curDB.close()
    delete DBs[dbName]
  }
}

/**
 * delete a DB
 * @param {string} dbName
 */
function deleteDB(dbName) {
  closeDB(dbName)

  return new Promise((resolve, reject) => {
    const dbConnect = indexedDB.deleteDatabase(dbName)

    dbConnect.onsuccess = resolve

    dbConnect.onerror = reject
  })
}

/**
 * get DB from DBs
 * @param {string} dbName
 */
function getDB(dbName) {
  const curDB = DBs[dbName]

  if (curDB) {
    return curDB
  } else {
    throw new Error(`please open ${dbName} DB first`)
  }
}

export { DBs, openDB, closeDB, getDB, deleteDB }
