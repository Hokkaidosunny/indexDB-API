import { timeStamp } from './util'
import { getDB, openDB } from './db'

/**
 * create a new store in an existed db
 */
async function createStore({
  dbName,
  storeName,
  version = timeStamp(),
  keyOptions = {},
  indexes = []
}) {
  if (!dbName || !storeName) {
    return false
  }

  let store

  await openDB(
    dbName,
    {
      onupgradeneeded: event => {
        const db = event.target.result

        if (db.objectStoreNames.contains(storeName)) {
          return
        }

        store = db.createObjectStore(storeName, keyOptions)

        // create index
        indexes.forEach(e =>
          store.createIndex(e.indexName, e.indexKey, e.indexOptions)
        )
      }
    },
    version
  )

  return store
}

/**
 * getStore
 * @param {string} dbName
 * @param {string} storeName
 */
function getStore(dbName, storeName) {
  if (!dbName || !storeName) {
    return false
  }

  const curDB = getDB(dbName)

  if (curDB.objectStoreNames.contains(storeName)) {
    // you should create transaction before do anything to store
    const transaction = curDB.transaction(storeName, 'readwrite')

    const store = transaction.objectStore(storeName)

    return store
  }
}

/**
 * deleteStore
 * @param {string} dbName
 * @param {string} storeName
 * @param {*} version
 */
async function deleteStore(dbName, storeName, version = timeStamp()) {
  if (!dbName || !storeName) {
    return false
  }

  await openDB(
    dbName,
    {
      onupgradeneeded: event => {
        const db = event.target.result

        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName)
        }
      }
    },
    version
  )

  return true
}

/**
 * getStoreCount
 * @param {*} dbName
 * @param {*} storeName
 */
function getStoreCount(dbName, storeName) {
  if (!dbName || !storeName) {
    return false
  }

  const store = getStore(dbName, storeName)

  return new Promise((resolve, reject) => {
    const req = store.count()

    req.onsuccess = event => {
      const count = event.target.result
      resolve(count)
    }

    req.onerror = reject
  })
}

/**
 * clearStore
 * @param {*} dbName
 * @param {*} storeName
 */
function clearStore(dbName, storeName) {
  const store = getStore(dbName, storeName)

  return store.clear()
}

export { getStore, createStore, getStoreCount, deleteStore, clearStore }
