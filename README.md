<!-- 自行脑补英文翻译 -->
doc：

新建一个db： 
var myDB = new Index('adc'); 
'abc'-->DB名字

打开这个db： 
myDB.openDB({
	success:function(){},  -->成功打开回调
	error:function(){}		-->打开失败回调
});

新建一个对象库并打开这个db：
myDB.createStore_openDB(storeOptions,callback);
storeOptions={-->对象库配置项
	name:'student',-->对象库名字
	keyOptions:{
		keyPath:'id',//主键
		autoIncrement:false,//是否自增长
	},
	index:[  //索引项
		{ indexName:'stu_id',indexKey:'id',indexOptions:{ unqiue:false,mulitEntry:false } },
		{ indexName:'stu_name',indexKey:'name',indexOptions:{ unqiue:false,mulitEntry:false } },
	]
}
callback={-->回调
	success:function(){},  -->成功打开回调
	error:function(){}		-->打开失败回调
}

添加数据：
myDB.addData(storeName,data,[callback]);
storeName-->对象库名字
data-->object||array 添加的数据
callback={-->回调 [可选]
	success:function(){},  -->成功打开回调
	error:function(){}		-->打开失败回调
}

按key获取数据：
myDB.getDataByKey(storeName,value,callback);
storeName-->对象库名字
value -->要搜索的key的值
callback=function(data){ } data-->结果

按key删除数据
myDB.deleteDataByKey(storeName,value);
storeName-->对象库名字
value -->要搜索的key的值

用key获取指定对象库的范围数据:
myDB.getRangeDataByKey(storeName,start,end,callback);
storeName-->对象库名字
start-->key的起始值
end-->key的结束值
callback=function(data){ }  data-->array

获取所有数据
myDB.getAllData(storeName,callback)
storeName-->对象库名字
callback=function(data){ }  data-->array

清空对象库
myDB.clearStore (storeName); storeName-->对象库名字

删除对象库
myDB.deleteStore (storeName); storeName-->对象库名字

关闭这个db：
myDB.closeDB();

删除db：
deleteDB(name); name='abc' -->db名字

....未完待续