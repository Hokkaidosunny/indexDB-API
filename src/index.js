import showError from './showError.js'
import * as db from './db.js'
import * as data from './data.js'
import * as store from './store.js'

if (!window.indexedDB) {
  showError('Your browser doesnt support indexedDB.')
}

export default {
  ...db,
  ...data,
  ...store
}
