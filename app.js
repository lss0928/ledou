
var express = require('express');//引入express模块

var app = express();//创建express应用程序
	
//配置路由文件
var login = require('./src/router/login.js') ;
var register = require('./src/router/register.js') ;
var show_collect = require('./src/router/show_collect.js') ;

app.get('/login',login);
app.get('/register',register);
app.get('/show_collect',show_collect);

//设置监听端口
app.listen(3000,function(){//当监听完成后执行的回调函数
	console.log("监听3000")
});
	
