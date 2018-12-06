import showError from './showError'
import * as db from './db'
import * as data from './data'
import * as store from './store'

if (!window.indexedDB) {
  showError('Your browser doesnt support indexedDB.')
}

export default {
  ...db,
  ...data,
  ...store
}
