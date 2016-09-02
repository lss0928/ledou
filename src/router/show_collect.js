var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var TEST_DATABASE = "douban";
var TEST_TABLE = "mine_collect";
var data = "";
var client = mysql.createConnection({//创建链接

	user:"root",
	password:""
})
function params(data){
	
	var arr = data.split("&");
	var json = {};
	for(i in arr){
		var k = arr[i].split("=")[0];
		var val = arr[i].split("=")[1];
		json[k] = decodeURI(val);
	}
	return json;
}
client.connect();
client.query('use ' + TEST_DATABASE);

router.get('/show_collect',function(req,res){
	console.log(req.url)
	var cbName = req.url.split("callback=")[1].split('?')[0];//得到回调函数的名称
	var data1 = req.url.split("callback=")[1].split("?")[1];//得到登录数据
	var jsonp = params(data1);
	client.query("select * from " + TEST_TABLE,function (err,result) {
		console.log(result)
		callback = cbName+"("+JSON.stringify(result)+")";//调用回调函数
	    res.end(callback);//响应请求
	})
	 
	   
})

//client.end()

module.exports = router;

