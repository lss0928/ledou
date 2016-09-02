angular.module('app').service('apiService',function($rootScope , $http , $location){
	this.getData = function(url , data , method){
		method = method.toUpperCase();
		
		var str = "";
		var arr = [];
		//遍历data,转化为key = val格式;
		for(i in data){
			str = i+"="+ data[i];
			arr.push(str);
		}
		data = arr.join('&');
		//判断请求方式
		if(method == "GET"){
			return $http.get(url +"?"+ data);
		}
		else if(method == "JSONP"){

			return $http.jsonp(url +"?"+ data);
		}
		else{
			return $http.post(url +"?"+ data);
		}
	}
})
