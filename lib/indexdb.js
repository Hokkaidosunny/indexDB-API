import assign from 'object-assign';

class IndexDB{

  constructor() {
    this.name = name;
  	this.db = null;
  }

  createStore_openDB(storeOptions, cb) {
		if (this.db !== null) {
      this.db.closeDB();
    }
		let default_storeOptions = {
			name:'',
			keyOptions:{},
			index:[]
		};
		storeOptions = assign(default_storeOptions, storeOptions);
		this.openDB(storeOptions, cb);
	}

  openDB(storeOptions, cb) {
		const version = new Date().getTime(),//更新版本号，比旧版本号大，不然无法创建对象库
		  dbConnect = indexedDB.open(this.name, version);

		dbConnect.onsuccess = (event) => {
			this.db = event.target.result;
			if (cb && cb.success) {
        cb.success();
      }
		};

		dbConnect.onerror = () => {
      if (cb && cb.error) {
        cb.error();
      }
		};

    /**
     * 版本更新用于创建对象仓库
     */
		dbConnect.onupgradeneeded = (event) => {
			this.db = evente.target.result;
			if (storeOptions) {
				if (!this.db.objectStoreNames.contains(storeOptions.name)) {  //是否已存在该对象库
					const store = this.db.createObjectStore(storeOptions.name, storeOptions.keyOptions); //创建对象库
					for (let i in storeOptions.index) {  //创建索引
						store.createIndex(
							storeOptions.index[i].indexName,
							storeOptions.index[i].indexKey,
							storeOptions.index[i].indexOptions
						);
					}
					console.log('created objectStore '+storeOptions.name);
				}else{
					console.log(storeOptions.name+' existed');
				}
			}
	    console.log('DB version changed to '+version);
	  };
  }

  closeDB() {
	  this.db.close();
	}

  /**
   * 获取对象仓库
   */
	getStore(storeName) {
		const tx = this.db.transaction(storeName, 'readwrite');
		return tx.objectStore(storeName);
	}

  /**
   *获取对象仓库数据量
   */
	getStoreCount(storeName, cb) {
		const store = this.getStore(storeName);
		const req = store.count();
		req.onsuccess = () => {
			cb(this.result);
		};
	}

  /**
   * 添加数据
   */
	addData(storeName, data, cb){
		const store = this.getStore(storeName);

		function add(data) {
			const req = store.add(data);
      req.onsuccess = (event) => {
				if (cb && cb.success) {
					cb.success();
				}
			}
			req.onerror = (event) => {
				if (cb && cb.error) {
					cb.error();
				}
			}
		}

		if (Array.isArray(data)) {  //如果是数组
			for (let i=0; i<data.length; i++) {
        add(data[i]);
      }
		} else {  //如果是对象
			add(data);
		}
	}

  /**
   * 修改数据
   */
	putData(storeName, data, cb) {
		const store = this.getStore(storeName);

		function put(data){
			const req = store.put(data);
      req.onsuccess = (event) => {
				if (cb && cb.success){
					cb.success();
				}
			}
			req.onerror = (event) => {
				if (cb && cb.error){
					cb.error();
				}
			}
		}

		if (Array.isArray(data)) {
			for (let i=0; i<data.length; i++) {
        put(data[i]);
      }
		} else {
			put(data);
		}
	}

  /**
   * 按主键删除数据
   */
	deleteDataByKey(storeName, value) {
    const store = this.getStore(storeName);
    store.delete(value);
  }

  /**
   * 按indexName获取数据
   */
  getDataByIndex(storeName, indexName, value, cb) {
    const store = this.getStore(storeName);
    const index = store.index(indexName);
    index.get(value).onsuccess = (event) => {
      cb(event.target.result);
    }
  }

  /**
   * 获取指定对象库的所有数据
   */
  getAllData(storeName, cb) {
    const store = this.getStore(storeName),
      req = store.openCursor(),
      dataArr = [];
    req.onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        dataArr.push(cursor.value);
        cursor.continue();
      } else {
        cb(dataArr);
      }
    };
  }

  /**
   * 用主键获取指定对象库的范围数据
   */
  getRangeDataByKey(storeName, start, end, cb) {
    const store = this.getStore(storeName),
      range = IDBKeyRange.bound(start,end),
      dataArr = [],
      req = store.openCursor(range);

    req.onsuccess = (event) => {
      let cursor = event.target.result;
      if(cursor){
        dataArr.push(cursor.value);
        cursor.continue();
      }else{
        cb(dataArr);
      }
    };
  }

  /**
   * 清空对象库
   */
	clearStore(storeName) {
		const store = this.getStore(storeName);
		store.clear();
	}

	/**
	 * 删除对象库
	 */
	deleteStore(storeName) {
		this.db.deleteObjectStore(storeName);
	}
}
