import { timeStamp } from './util'
import { getDB, openDB } from './db'

/**
 * create a new store in an existed db
 */
async function createStore(
  dbName,
  storeName,
  { keyOptions = {}, indexes = [] },
  version = timeStamp()
) {
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
async function getStore(dbName, storeName) {
  const curDB = await getDB(dbName)

  return new Promise((resolve, reject) => {
    if (curDB.objectStoreNames.contains(storeName)) {
      // you should create transaction before do anything to store
      const transaction = curDB.transaction(storeName, 'readwrite')

      const store = transaction.objectStore(storeName)

      resolve(store)
    } else {
      reject(new Error('no this store'))
    }
  })
}

/**
 * deleteStore
 * @param {string} dbName
 * @param {string} storeName
 * @param {*} version
 */
async function deleteStore(dbName, storeName, version = timeStamp()) {
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
async function getStoreCount(dbName, storeName) {
  const store = await getStore(dbName, storeName)

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
async function clearStore(dbName, storeName) {
  const store = await getStore(dbName, storeName)

  if (store) {
    store.clear()

    return true
  }
}

export { getStore, createStore, getStoreCount, deleteStore, clearStore }
