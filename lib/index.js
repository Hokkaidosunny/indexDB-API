import * as db from './db.js';
import * as data from './data.js';
import * as store from './store.js';

export default {
  ...db,
  ...data,
  ...store
}
