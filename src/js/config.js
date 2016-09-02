//配置路由
angular.module('app').config(config);

function config($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/home/active');//初始页面
	$stateProvider
		.state('index',{
			url:'/index',
			templateUrl:'index.html'
		})
		.state('home',{//首页 活动页
			url:'/home',
			templateUrl:'./views/home.html'
		})
		.state('home.active',{
			url:'/active',
			templateUrl:'./views/active.html'
		})
		.state('home.movie',{//电影
			url:'/movie',
			templateUrl:'./views/movie.html'
		})
		.state('home.cinema',{//影院
			url:'/cinema',
			templateUrl:'./views/cinema.html'
		})
		
		.state('home.mine',{//我的
			url:'/mine',
			templateUrl:'./views/mine.html'
		})
		.state('home.active_detail',{//活动详情
			url:'/active_detail?idx&mine_active_id',
			templateUrl:'./views/active_detail.html'
		})
		.state('home.movie_detail',{//电影详情
			url:'/movie_detail?movieId',
			templateUrl:'./views/movie_detail.html'
		})
		.state('home.mine_active',{//我的活动
			url:'/mine_active',
			templateUrl:'./views/mine_active.html'
		})
		.state('home.mine_movie',{//我的电影
			url:'/mine_movie',
			templateUrl:'./views/mine_movie.html'
		})
		.state('home.login',{//登录
			url:'/login',
			templateUrl:'./views/login.html'
		})
		.state('home.register',{//注册
			url:'/register',
			templateUrl:'./views/register.html'
		})
		.state('home.map',{//地图
			url:'/map?cinemaId&cinemaName',
			templateUrl:'./views/map.html'
		})
		

}
