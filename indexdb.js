/*对各个浏览器统一定义indexdb*/
window.indexedDB = window.indexedDB||window.webkitIndexedDB||window.mozIndexedDB||window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction||window.webkitIDBTransaction||window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange;
window.IDBCursor = window.IDBCursor||window.webkitIDBCursor||window.msIDBCursor;

/*新建数据库*/
function myDB(name){
	this.name=name;
	this.db=null;
}
/*删除数据库*/
function deleteDB(name){
    indexedDB.deleteDatabase(name);
}

myDB.prototype={
	constructor:this,
	/*连接数据库*/
	openDB : function(opt,storeName,options){
		var _that=this;
		var version = new Date().getTime();
		var dbConnect = indexedDB.open(_that.name,version);
		dbConnect.onsuccess=function(e){
			_that.db = e.target.result;
			if(opt){
				if(opt.success) opt.success();
			}
			console.log('success');
		};
		dbConnect.onerror=function(){
			if(opt){
				if(opt.error) opt.error();
			}
			console.log('error');
		};
		/*版本更新用于创建对象仓库*/
		dbConnect.onupgradeneeded=function(e){
			_that.db = e.target.result;
			if(typeof(storeName)!='undefined'){
				if(!_that.db.objectStoreNames.contains(storeName)){
					_that.db.createObjectStore(storeName,options);
					console.log('created objectStore '+storeName);
				}else{
					console.log(storeName+' existed');
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
	openDB_store : function(storeName,options,opt){
		if(this.db!=null){
			this.db.closeDB();
		}
		var defaule_options={
			autoIncrement:true
		};
		if(typeof(opt)=='undefined'){
			this.openDB(options,storeName,defaule_options);
		}else{
			this.openDB(opt,storeName,options);
		}	
	},
	/*获取对象仓库*/
	getStore : function(storeName){
		var tx = this.db.transaction(storeName,'readwrite');
		var store = tx.objectStore(storeName);
		return store;
	},
	/*添加数据*/
	addData : function(storeName,arr,opt){
		var store = this.getStore(storeName);
		function add(data){
			var req = store.add(data);
            req.onsuccess = function(e){
				if(opt){
					if(opt.success) opt.success();
				} 
			}
			req.onerror = function(e){
				if(opt){
					if(opt.error) opt.error();
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
	putData : function(storeName,arr,opt){
		var store = this.getStore(storeName);
		function put(data){
			var req = store.put(data);
            req.onsuccess = function(e){
				if(opt){
					if(opt.success) opt.success();
				} 
			}
			req.onerror = function(e){
				if(opt){
					if(opt.error) opt.error();
				}
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
	/*清空对象库*/
	clearStore : function(storeName){
		var store = this.getStore(storeName);
		store.clear();
	}
	/*删除对象库*/
	deleteStore : function(storeName){
		this.db.deleteObjectStore(storeName); 
	}
}

var myDB1=new myDB('chatRecord');
/*myDB1.openDB({
	success:function(){
		var data={id:45,score:98};
		myDB1.addData('student',data);
	}
});*/
/*myDB1.openDB_store('abc',{
	success:function(){
		var data=[
			{id:'123',data:'234'},
			{id:'123',data:'234'},
			{id:'123',data:'234'},
			{id:'123',data:'234'},
		];
		myDB1.addData('abc',data);
		myDB1.addData('abc',{id:'dasfdas',o:'dsfafdsa'});
		myDB1.clearStore('abc');
	}
});*/

var myDB2=new myDB('yellow');
myDB2.openDB_store('kkk',{keyPath:'name'},{
	success:function(){
		var data={name:'123',hh:'1111111111111111'};
		myDB2.putData('kkk',data);
	}
});
