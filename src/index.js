import * as db from './db'
import * as data from './data'
import * as store from './store'
import { showErrorMsg } from './util'

if (!self.indexedDB) {
  showErrorMsg('Your browser doesnt support indexedDB.')
}

export default {
  ...db,
  ...data,
  ...store
}
