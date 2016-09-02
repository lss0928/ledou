
angular.module('app')
.directive('userName',userName)
.directive('loopImg',loopImg)

function userName(){
	return {
		restrict:"AE",
		template:localStorage.getItem('douban_username')?localStorage.getItem('douban_username'):"<a ui-sref='home.login'>登录</a>",
		link:function(scope,ele){
			
		}
	}
}
function loopImg(){
	return {
		restrict:"AE",
		template:'',
		link:function(scope,ele){
			var loop = new Swiper('.loop',{
				direction:'horizontal',
				pagination:".icon",
				autoplay:3000,
				loop:true,
				autoplayDisableOninteraction:false,
				roundLengths:true,
				updateFormElements:true,
				observer:true
			})
		}
	}
}