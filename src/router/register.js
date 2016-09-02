var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var TEST_DATABASE = "douban";
var TEST_TABLE = "user";
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
router.get('/register',function(req,res){
	
	var cbName = req.url.split("callback=")[1].split("?")[0];//得到回调函数的名称
	var data1 = req.url.split("callback=")[1].split("?")[1];//得到注册数据
	var jsonp = params(data1);
	var name = jsonp.name;
	var pwd = jsonp.pwd;
	var img = jsonp.img;
	var email = String(jsonp.email);
	var tel = jsonp.tel;
	//console.log(jsonp)
	
	//遍历数据库，判断用户是否已存在；
	client.query("select * from user",function(err,result){
		//console.log(typeof result)
		var obj = {};
		result.forEach(function(v){
			console.log(v)
			if(v.name == name){
				obj.code = 0; 
				return ;
			}else{
    			obj.code = 1;
    			return ;
			}

		})
		if(obj.code == 1){
			client.query("insert into user (name,pwd,img,email,tel) values ('"+name+"','"+pwd+"','"+img+"','"+email+"',"+tel+")");
		}

		callback = cbName+"("+JSON.stringify(obj)+")";//调用回调函数
    	res.end(callback);//响应请求
	})
	
    
})


module.exports = router;

