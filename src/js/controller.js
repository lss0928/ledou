angular.module('app')
.controller('homeCtrl',homeCtrl)//全局
.controller('activeCtrl',activeCtrl)//1活动页
.controller('activeDetailCtrl',activeDetailCtrl)//活动详情
.controller('movieCtrl',movieCtrl)//2电影
.controller('movieDetailCtrl',movieDetailCtrl)//2电影
.controller('cinemaCtrl',cinemaCtrl)//3影院
.controller('mineCtrl',mineCtrl)//4我的
.controller('mineActiveCtrl',mineActiveCtrl)
.controller('mineMovieCtrl',mineMovieCtrl)//4我的
.controller('loginCtrl',loginCtrl)//登录
.controller('registerCtrl',registerCtrl)//注册
.controller('mapCtrl',mapCtrl)//地图
//全局
function homeCtrl($scope,$rootScope,apiService,$http,$location,$state){
	//判断用户是否登录
	$scope.hasLogin = function(){
		//var $scope.userId = 
		
		return localStorage.getItem("douban_username") && localStorage.getItem("douban_userid") ? true :false;
	}
	console.log($scope.hasLogin())
	$scope.showCollect = function(){
		mine_active = [];
		var mine_active2 = [];
		if($scope.hasLogin()){//请求收藏列表
			apiService.getData('http://localhost:3000/show_collect?callback=JSON_CALLBACK',{userId:localStorage.getItem("douban_userid")},'jsonp')
				.success(function(res){
					var arr = [];
					res.forEach(function(obj){
						if(obj.user_id == localStorage.getItem("douban_userid")){
							
							arr.push(obj)
						}
					})
					//请求活动列表
					apiService.getData('data/activitylist.txt',{},'get')
						.success(function(data){	
														
							arr.forEach(function(v1){											
								data.events.forEach(function(v2){
									if(v1.mine_active_id == v2.id){
										mine_active.push(v2)
									}
								})
							})	
							console.log(mine_active)																												
						})
				})		
		}
	}
	$scope.showCollect();//获取我的活动收藏
	
	$scope.clickLogout = function(){ //点击注销按钮
		localStorage.removeItem('douban_username');
		localStorage.removeItem('douban_userid');
	}
	//点击返回按钮，跳转到path设置的页面
	$scope.clickBack = function(){
		//console.log($rootScope.path)
		$location.path($rootScope.path)
	}
	//显示和隐藏头部内容函数
	$scope.showHead = function(obj,pageAnimate){
		//console.log(obj)
		//初始化
		$rootScope.headTit = "活动";
		$rootScope.back = false;
		$rootScope.backLogin = false;
		$rootScope.mine = false;
		$rootScope.arrange = false;
		$rootScope.logout = false;
		$rootScope.collect = false;
		$scope.pageAnimate = "fadeInLeft"
		//重置
		for(i in obj){
			$rootScope[i] = obj[i];
		}
		$scope.pageAnimate = pageAnimate;
	}

	//console.log("homeCtrl")
	$scope.footer = [
						{'nav':'活动','sref':'home.active','addClass':true},
						{'nav':'电影','sref':'home.movie','addClass':false},
						{'nav':'影院','sref':'home.cinema','addClass':false},
						{'nav':'我的','sref':'home.mine','addClass':false}
		
					];
	$scope.footer[0].addClass = true;
	//点击页脚导航				
	$scope.clickFooter = function(){	
		for(i in $scope.footer){
			//console.log(i)
			$scope.footer[i].addClass = false;			
		}
		$scope.footer[this.$index].addClass = true;
	}
	//局部滚动
	
}
//活动页
function activeCtrl($scope,$rootScope,apiService,$http,$location){
	$scope.showHead({headTit:"活动"},"fadeInLeft");
	$scope.changeSref = function(path){
		$rootScope.path = path;
	}
	//请求活动列表
	apiService.getData('data/activitylist.txt',{},'get')
		.success(function(data){
			$scope.newsList = data.news;//最新活动
			$scope.activeList = data.events;//活动列表
			//console.log($scope.activeList)
		})
}
//活动详情
function activeDetailCtrl($scope,$rootScope,apiService,$http,$location){
	$scope.showHead({headTit:"罗马与巴洛克艺术",back:true,collect:true},"fadeInLeft")
	
	//根据title搜索对应的活动详细数据
	$scope.idx = $location.search().idx;
	$scope.mine_active_id = $location.search().mine_active_id;
	apiService.getData('data/activitylist.txt',{},"get")
		.success(function(data){
			$scope.activeDetail = data.events[$scope.idx];
			$rootScope.headTit = $scope.activeDetail.title;
			//分解content
			$scope.content = $scope.activeDetail.content.split('\r\n')
			
		})
	//点击收藏 收藏到活动列表
	//检测用户是否登录，若未登录，提示跳转至登录页
	//若登陆，插入到收藏列表


}
//电影
function movieCtrl($scope,$rootScope,apiService,$http){
	$scope.showHead({headTit:"电影",arrange:true},"fadeInLeft")
	
	$scope.changeSref = function(path){
		$rootScope.path = path;
		//console.log($rootScope.path)
	}
	//请求电影列表
	apiService.getData('data/movieList/movielist.txt',{},'get')
				.success(function(data){
					$scope.movieList = data.result;
					//console.log($scope.movieList)
				})
}
//电影详情
function movieDetailCtrl($scope,$rootScope,$location,apiService , $http){
	$scope.showHead({back:true,collect:true},"fadeInLeft")
	
	//根据movieId请求对应的电影数据
	$scope.movieId = $location.search().movieId;
	$scope.url = 'data/movieList/m'+$scope.movieId+'.txt'
	apiService.getData($scope.url,{},'get')
				.success(function(data){

					$scope.movieDetail = data.result;
					//console.log($scope.movieDetail)
					$rootScope.headTit = $scope.movieDetail.title;//设置标题
					$scope.rating = $scope.movieDetail.rating;
					$scope.rating_count = $scope.movieDetail.rating_count;
					$scope.genres = $scope.movieDetail.genres;
					$scope.runtime = $scope.movieDetail.runtime;
					$scope.language = $scope.movieDetail.language;
					$scope.film_locations = $scope.movieDetail.film_locations;
					$scope.actors = $scope.movieDetail.actors;
					$scope.plot_simple = $scope.movieDetail.plot_simple;
					$scope.poster = $scope.movieDetail.poster;
					$scope.release_date = $scope.movieDetail.release_date;
				})
	
}
//影院
function cinemaCtrl($scope,$rootScope,apiService,$http){
	$scope.showHead({headTit:"影院"},"fadeInLeft")
	
	//请求影院列表
	apiService.getData('data/cinemaList/cinemalist.txt',{},'get')
				.success(function(data){
					$scope.cinemaList = data.result.data;
					//console.log($scope.cinemaList)
				})
	$scope.changeSref = function(path){
		$rootScope.path = path;
		//console.log($rootScope.path)
	}
}
//我的
function mineCtrl($scope,$rootScope){
	$scope.showHead({headTit:"我的",logout:true},"fadeInLeft")
	
}
//我的活动
function mineActiveCtrl($scope,$rootScope){
	$scope.showHead({headTit:"我的活动",mine:true},"fadeInLeft")
	
}
//我的电影
function mineMovieCtrl($scope,$rootScope){
	$scope.showHead({headTit:"我的电影",mine:true},"fadeInLeft")
	
	
}
//登录
function loginCtrl($scope,$rootScope,apiService,$http,$location){
	$scope.showHead({headTit:"登录",mine:true},"fadeInLeft")
	
	$scope.loginSub = function(){
		//获取输入的用户名 密码

		/*if(! ($scope.username && $scope.pwd) ){
			alert("内容不能为空")
			return false;
		}*/
		var data = {'name':encodeURI($scope.username),'pwd':encodeURI($scope.pwd)}
		//跨域请求
		apiService.getData('http://localhost:3000/login?callback=JSON_CALLBACK',data,'jsonp')
					.success(function(res){
						//console.log(res)
						if(res.code == 1){//登陆成功
							alert("登陆成功"+$scope.username)
							$rootScope.userName = $scope.username;
							$rootScope.userId = res.userId;
							console.log($rootScope.userName,$rootScope.userId)
							localStorage.setItem('douban_username',$scope.username)//存入本地存储中
							localStorage.setItem('douban_userid',res.userId)//存入本地存储中
							$location.url('/active');//跳转到首页
							return;
						}else if(res.code == 0){
							alert("用户名或密码有误");
							return;
						}
					})
	}
}
//注册
function registerCtrl($scope,$rootScope,apiService,$http,$location,$state){
	$scope.showHead({headTit:"注册",backLogin:true},"fadeInLeft")
	
	//点击提交 ， 获取文本框中将数据，传递给后台
	$scope.register = function(){
		var name = $scope.username;
		var pwd1 = $scope.pwd1;
		var pwd2 = $scope.pwd2;
		var email = $scope.email;
		var tel = $scope.tel;
		//console.log(name ,pwd1 ,pwd2 ,email ,tel)
		//判断密码是否一致
		if(!(name && pwd1 && pwd2 && email && tel)){
			alert("内容不能为空")
		}else{
			if(pwd1!=pwd2){
				alert("两次输入密码不一致")
			}else if(confirm("你确定要提交吗？")){//提交
				var data = {'name':name,'pwd':pwd1,'img':'1','email':encodeURI(email),'tel':tel};
				apiService.getData('http://localhost:3000/register?callback=JSON_CALLBACK',data,'jsonp')
							.success(function(res){
								if(res.code == 1){
									//console.log(res)
									
									alert("注册成功")
									$state.go("home.login")
								}
								else if(res.code == 0){
									alert("用户名已存在")
								}
							})
			}
		}
	}
}
function mapCtrl($scope,$rootScope,$location){
	$scope.showHead({headTit:"地图",back:true},"fadeInLeft")

	var map = new BMap.Map('Map');       
	map.centerAndZoom('宁波',12);
	map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
	map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件
    map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开
  
    var localSearch = new BMap.LocalSearch(map);
        localSearch.enableAutoViewport(); //允许自动调节窗体大小

        map.clearOverlays();//清空原来的标注
        //var keyword = document.getElementById("text_").value;
        var keyword = $location.search().cinemaName;//接受地址栏的cenimaName
    	localSearch.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0);
        //console.log(poi)
        //document.getElementById("result_").value = poi.point.lng + "," + poi.point.lat;
        map.centerAndZoom(poi.point, 13);
        var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地址对应的经纬度
        map.addOverlay(marker);
    });
    localSearch.search(keyword);

}
