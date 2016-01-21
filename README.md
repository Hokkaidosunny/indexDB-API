<!-- 自行脑补英文翻译 -->
doc：
<p>新建一个db：</p> 
<pre><code>
	var myDB = new Index('adc'); 
	'abc'-->DB名字
</code></pre>

打开这个db： 
<pre><code>
	myDB.openDB({
		success:function(){},  -->成功打开回调
		error:function(){}		-->打开失败回调
	});
</code></pre>

新建一个对象库并打开这个db：
<pre><code>
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
</code></pre>

添加数据：
<pre><code>
myDB.addData(storeName,data,[callback]);
storeName-->对象库名字
data-->object||array 添加的数据
callback={-->回调 [可选]
	success:function(){},  -->成功打开回调
	error:function(){}		-->打开失败回调
}
</code></pre>

按key获取数据：
<pre><code>
myDB.getDataByKey(storeName,value,callback);
storeName-->对象库名字
value -->要搜索的key的值
callback=function(data){ } data-->结果
</code></pre>

按key删除数据
<pre><code>
myDB.deleteDataByKey(storeName,value);
storeName-->对象库名字
value -->要搜索的key的值
</code></pre>

用key获取指定对象库的范围数据:
<pre><code>
myDB.getRangeDataByKey(storeName,start,end,callback);
storeName-->对象库名字
start-->key的起始值
end-->key的结束值
callback=function(data){ }  data-->array
</code></pre>

获取所有数据
<pre><code>
myDB.getAllData(storeName,callback)
storeName-->对象库名字
callback=function(data){ }  data-->array
</code></pre>

清空对象库
<pre><code>
myDB.clearStore (storeName); storeName-->对象库名字
</code></pre>

删除对象库
<pre><code>
myDB.deleteStore (storeName); storeName-->对象库名字
</code></pre>

关闭这个db：
<pre><code>
myDB.closeDB();
</code></pre>

删除db：
<pre><code>
deleteDB(name); name='abc' -->db名字
</code></pre>

....未完待续
