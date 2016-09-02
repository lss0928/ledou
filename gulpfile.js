var fs = require('fs')
var gulp = require("gulp");
var connect = require("gulp-connect");
var respond = require("gulp-respond");
var sass = require("gulp-ruby-sass");
var ngAnnotate = require('gulp-ng-annotate');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector')

gulp.task("connect",function(){
	console.log("这是connect")
	connect.server({
		root:['./','bower_components'],
		port:8002,
		livereload:true,
		middleware:function(){
            return [
                
                function(req,res){  //请求  响应
                    var path = req.url.split('?')[0]; //请求的所有路径
                    
                    path = path == '/' ? '/build/newIndex.html' : path;//如果是/那就是首页找内容，如果有内容那就那就是他本身
                    //console.log(path)
                    // 获取运行时参数
                    // if (path.indexOf('index.html') > -1) {
                    //   params = getParams(req.url);
                    // }
                    url = 'src' + path;//最后都要将src/path;
                    					/*
												src /build/newIndex.html
												src /build/home.min.css
												src /build/images/6.jpg
												src /views/home.html
                    					*/
                   
                    if (!fs.existsSync(url)) {  //判断路径是否存在
                        url = 'bower_components' + path;
                      
                    }
                    //console.log(url)
                    return gulp.src(url).pipe(respond(res));
                }
            ]
        }
	})
})
gulp.task('clean',function(){
	return gulp.src('src/build')
				.pipe(clean());
})

//编译sass
gulp.task("sass",['clean'],function(){
	console.log("这是编译sass")
	/*gulp.src('src/css/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('src/css'));*/
	return sass('./src/css/*.scss')
		.on('error',sass.logError)
		.pipe(gulp.dest('./src/css'))
})
//压缩css
gulp.task('css',['sass'],function(){
	console.log("这是压缩css")
	return gulp.src([          
        "./src/css/animate.css",
        "./src/css/swiper.css",
        "./src/css/home.css"
        ])
        .pipe(minifyCss()) 
        .pipe(rename(function(path){
            path.basename += '.min'
            path.extname = '.css'
        }))
        .pipe(gulp.dest("./src/build/css"))
})
//压缩图片
gulp.task("img",['css'],function(){
	console.log("这是img")
	return gulp.src("./src/images/*")
		.pipe(imagemin({
			progressive:true,
			use:[pngquant()]//使用pngquant来压缩图片
		}))
		.pipe(gulp.dest('./src/build/images'))
})
//压缩js
gulp.task('build',['img'],function(){
	console.log('这是build')
	return gulp.src([
			/*'./src/js/app.js',
			"./src/js/config.js",
            "./src/js/controller.js",
            "./src/js/directive.js",
            "./src/js/service.js",*/
            "./src/js/*.js"
		])
		.pipe(ngAnnotate())
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(concat("js.js"))
        .pipe(rename(function(path){
            path.basename += '.min'
            path.extname = '.js'
        }))
        .pipe(rev())
        .pipe(gulp.dest('./src/build/js'))
        .pipe(rev.manifest())  //更新json
        .pipe(gulp.dest('./src/')) 
    
})

gulp.task('index',['build'],function(){
	console.log('这是index')
	return gulp.src('./src/index.html')
			.pipe(rename(function(path){
				path.basename = 'newIndex'
				path.extname = '.html'
			}))
			.pipe(minifyHtml())
			.pipe(gulp.dest('./src/build'))
})
gulp.task('rev',['index'],function(){
	console.log('这是rev')
	return gulp.src([
			'./src/rev-manifest.json',
			'./src/build/newIndex.html'
		])
		.pipe(revCollector())
		.pipe(gulp.dest('./src/build/'))
})
gulp.task('reloadHtml',['rev'],function(){
	console.log('这是reloadHtml')
	return gulp.src('./src/build/newIndex.html')
				.pipe(connect.reload())
})
//监听
var pathFile = [
	'./src/js/*.js',
	'./src/css/*.scss',
	'./src/*.html'
]
gulp.task('watch',function(){
	console.log('这是watch')
	gulp.watch(pathFile,['reloadHtml'])
	//gulp.watch('./src/css/home.scss',['reloadHtml'])
	
})
gulp.task("default",['reloadHtml','connect','watch'])
