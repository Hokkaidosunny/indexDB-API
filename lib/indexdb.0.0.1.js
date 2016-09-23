/*对各个浏览器统一定义indexdb*/
window.indexedDB = window.indexedDB||window.webkitIndexedDB||window.mozIndexedDB||window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction||window.webkitIDBTransaction||window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange;
window.IDBCursor = window.IDBCursor||window.webkitIDBCursor||window.msIDBCursor;

/*新建数据库*/
function IndexDB(name){
	this.name=name;
	this.db=null;
}
/*删除数据库*/
function deleteDB(name){
    indexedDB.deleteDatabase(name);
}

IndexDB.prototype={
	constructor:this,
	/*连接数据库*/
	openDB : function(callback,storeOptions){
		var _that=this;
		var version = new Date().getTime();//更新版本号，比旧版本号大，不然无法创建对象库
		var dbConnect = indexedDB.open(_that.name,version);

		dbConnect.onsuccess=function(e){
			_that.db = e.target.result;
			if(callback){
				if(callback.success) callback.success();
			}
			console.log('success');
		};
		dbConnect.onerror=function(){
			if(callback){
				if(callback.error) callback.error();
			}
			console.log('error');
		};
		/*版本更新用于创建对象仓库*/
		dbConnect.onupgradeneeded=function(e){
			_that.db = e.target.result;
			if(typeof(storeOptions)!='undefined'){
				if(!_that.db.objectStoreNames.contains(storeOptions.name)){//是否已存在该对象库

					var store=_that.db.createObjectStore(storeOptions.name,storeOptions.keyOptions);//创建对象库

					for(var i in storeOptions.index){//创建索引
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
	},
	/*关闭数据库*/
	closeDB : function(){
	    this.db.close();
	},
	/*创建对象库*/
	createStore_openDB : function(storeOptions,callback){
		if(this.db!=null)	this.db.closeDB();
		var default_storeOptions={
			name:'',
			keyOptions:{},
			index:[]
		};
		storeOptions=this.extend(default_storeOptions,storeOptions);
		this.openDB(callback,storeOptions);
	},
	/*获取对象仓库*/
	getStore : function(storeName){
		var tx = this.db.transaction(storeName,'readwrite');
		var store = tx.objectStore(storeName);
		return store;
	},
	/*获取对象仓库数据量*/
	getStoreCount : function(storeName,callback){
		var store = this.getStore(storeName);
		var req = store.count();
		req.onsuccess = function(){
			callback(this.result);
		};
	},
	/*添加数据*/
	addData : function(storeName,arr,callback){
		var store = this.getStore(storeName);
		function add(data){
			var req = store.add(data);
            req.onsuccess = function(e){
				if(callback){
					if(callback.success) callback.success();
				} 
			}
			req.onerror = function(e){
				if(callback){
					if(callback.error) callback.error();
				}
			}
		}
		if(arr.hasOwnProperty('length')){//如果是数组
			for(var i=0;i<arr.length;i++){
	           add(arr[i]); 
	        }
		}else{//如果是对象
			add(arr);
		}
	},
	/*修改数据*/
	putData : function(storeName,arr,callback){
		var store = this.getStore(storeName);
		function put(data){
			var req = store.put(data);
            req.onsuccess = function(e){
				if(callback){
					if(callback.success) callback.success();
				} 
			}
			req.onerror = function(e){
				if(callback){
					if(callback.error) callback.error();
				}
				console.log('error:check your keyPath')
			}
		}
		if(arr.hasOwnProperty('length')){//如果是数组
			for(var i=0;i<arr.length;i++){
	           put(arr[i]); 
	        }
		}else{//如果是对象
			put(arr);
		}
	},
	/*按主键获取数据*/
	getDataByKey : function(storeName,value,callback){
		var store = this.getStore(storeName); 
        var req = store.get(value); 
        req.onsuccess=function(e){ 
            callback(e.target.result);  
        };
	},
	/*按主键删除数据*/
	deleteDataByKey : function(storeName,value){
        var store = this.getStore(storeName); 
        store.delete(value); 
    },
    /*按indexName获取数据*/
    getDataByIndex : function(storeName,indexName,value,callback){
        var store = this.getStore(storeName);
        var index = store.index(indexName);
        index.get(value).onsuccess=function(e){
            callback(e.target.result);
        }
    },
    /*获取指定对象库的所有数据*/
    getAllData : function(storeName,callback){
        var store = this.getStore(storeName);
        var req=store.openCursor();
        var dataArr=[];
        req.onsuccess=function(e){
            var cursor=e.target.result;
            if(cursor){
            	dataArr.push(cursor.value);
                cursor.continue();
            }else{
            	callback(dataArr);
            }
        };
    },
    /*用主键获取指定对象库的范围数据*/
    getRangeDataByKey : function(storeName,start,end,callback){
    	var store = this.getStore(storeName);
    	var range = IDBKeyRange.bound(start,end);
    	var dataArr=[];
        var req=store.openCursor(range);
        req.onsuccess=function(e){
            var cursor=e.target.result;
            if(cursor){
            	dataArr.push(cursor.value);
                cursor.continue();
            }else{
            	callback(dataArr);
            }
        };
    },
    /*用index获取指定对象库的范围数据*/
    getRangeDataByIndex : function(storeName,indexName,start,end,callback){
    	var store = this.getStore(storeName);//store
    	var index = store.index(indexName);//index
    	var range = IDBKeyRange.bound(start,end);//范围
    	var dataArr=[];
        var req=index.openCursor(range);
        req.onsuccess=function(e){
            var cursor=e.target.result;
            if(cursor){
            	dataArr.push(cursor.value);
                cursor.continue();
            }else{
            	callback(dataArr);
            }
        };
    },
	/*清空对象库*/
	clearStore : function(storeName){
		var store = this.getStore(storeName);
		store.clear();
	},
	/*删除对象库*/
	deleteStore : function(storeName){
		this.db.deleteObjectStore(storeName); 
	},
	/*继承*/
	extend : function(obj1,obj2){
		if(typeof(obj1)=='object' && typeof(obj2)=='object'){
			for(var i in obj2){
				obj1[i] = obj2[i];
			}
		}
		return obj1;
	}
};