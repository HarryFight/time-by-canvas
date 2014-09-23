var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var MARGIN_TOP = 60;//距离画布上
var MARGIN_LEFT = 30;//距离画布左

var RADIUS = 7;
var DIGIT_WIDTH =(7+1)*2*(RADIUS+1);//每个数字所占的宽度（数组长度为7）
var COLON_WIDTH = (4+1)*2*(RADIUS+1);//冒号宽度

var endTime = new Date(2014,7,4,12,12,12,12);//截止日期
var curShowTimeSeconds = 0;

var balls = [];
var colors = ["#70B5FF","#FFF64A","#A8FF75","#FF7070","#F5FF70","#407AB8","#835FFF","#BA54FF","#FF4EC3","#FF443E"];

window.onload = function() {

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext("2d");

    //设定画布大小
	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurShowTimeSeconds();

    //1秒20帧绘制
    setInterval(function () {
        render(context);
        update();
    },50);

};

function update() {
    var nextShowTimeSeconds = getCurShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds/3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
    var nextSeconds = nextShowTimeSeconds%60;

    var curHours = parseInt(curShowTimeSeconds/3600);
    var curMinutes = parseInt((curShowTimeSeconds - nextHours*3600)/60);
    var curSeconds = curShowTimeSeconds%60;

    //判断时间是否发生了变化
    if(nextSeconds != curSeconds){
        //判断时间每一位的变化，并执行相应渲染
        if(parseInt(nextHours/10) != parseInt(curHours/10)){
            addBall(MARGIN_LEFT,MARGIN_TOP,parseInt(curHours/10));
        }
        if(parseInt(nextHours%10 != parseInt(nextHours%10))){
            addBall(MARGIN_LEFT+DIGIT_WIDTH,MARGIN_TOP,parseInt(curHours%10))
        }

        if(parseInt(nextMinutes/10) != parseInt(curMinutes/10)){
            addBall(MARGIN_LEFT+2*DIGIT_WIDTH+COLON_WIDTH,MARGIN_TOP,parseInt(curMinutes/10));
        }
        if(parseInt(nextMinutes%10 != parseInt(nextMinutes%10))){
            addBall(MARGIN_LEFT+3*DIGIT_WIDTH+COLON_WIDTH,MARGIN_TOP,parseInt(curMinutes%10))
        }

        if(parseInt(nextSeconds/10) != parseInt(curSeconds/10)){
            addBall(MARGIN_LEFT+4*DIGIT_WIDTH+2*COLON_WIDTH,MARGIN_TOP,parseInt(curSeconds/10));
        }
        if(parseInt(nextSeconds%10) != parseInt(curSeconds%10)){
            addBall(MARGIN_LEFT+5*DIGIT_WIDTH+2*COLON_WIDTH,MARGIN_TOP,parseInt(curSeconds%10))
        }
        //更新是时间值
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    //更新小球运动参数
    updateBalls();
}
/**
 * 渲染操作
 * @param cxt
 */
function render (cxt) {
	// body...
	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
//	var seconds = parseInt(curShowTimeSeconds - hours*3600 - minutes*60);
    var seconds = curShowTimeSeconds%60;

    //清除指定区域画布画布
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
    renderDigit(MARGIN_LEFT+DIGIT_WIDTH,MARGIN_TOP,parseInt(hours%10),cxt);
    renderDigit(MARGIN_LEFT+2*DIGIT_WIDTH,MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT+2*DIGIT_WIDTH+COLON_WIDTH,MARGIN_TOP,parseInt(minutes/10),cxt);
    renderDigit(MARGIN_LEFT+3*DIGIT_WIDTH+COLON_WIDTH,MARGIN_TOP,parseInt(minutes%10),cxt);
    renderDigit(MARGIN_LEFT+4*DIGIT_WIDTH+COLON_WIDTH,MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT+4*DIGIT_WIDTH+2*COLON_WIDTH,MARGIN_TOP,parseInt(seconds/10),cxt);
    renderDigit(MARGIN_LEFT+5*DIGIT_WIDTH+2*COLON_WIDTH,MARGIN_TOP,parseInt(seconds%10),cxt);

    //遍历绘制小球
    for(var i = 0;i < balls.length;i++){
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI );
        cxt.closePath();

        cxt.fill();
    }
}

/**
 * 绘制对应 数字或者符号
 * @param x
 * @param y
 * @param num
 * @param cxt
 */
function renderDigit (x,y,num,cxt) {
	// body...
	cxt.fillStyle = "blue";

	//绘制对应的点阵
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j] == 1){
                var cX = x+j*2*(RADIUS+1)+(RADIUS+1);
                var cY = y+i*2*(RADIUS+1)+(RADIUS+1);
				cxt.beginPath();
				cxt.arc( cX , cY , RADIUS , 0 , 2*Math.PI );
				cxt.closePath();

				cxt.fill();
			}
		}
	}
}
/**
 * 生成小球
 * @param x
 * @param y
 * @param num
 */
function addBall(x,y,num){
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] == 1){
                var aBall = {
                    x: x+j*2*(RADIUS+1)+(RADIUS+1),
                    y: y+i*2*(RADIUS+1)+(RADIUS+1),
                    g: 2.5 + Math.random(),
                    vx: 4*Math.pow(-1,Math.ceil(Math.random()*1000)),
                    vy:-1*Math.ceil(Math.random()*5),
                    color: colors[Math.floor(Math.random()*colors.length)]
                };
                balls.push(aBall);
            }
        }
    }
}
/**
 * 更新小球运动参数
 */
function updateBalls(){
    //从后往前，便于删除小球
    for(var i = balls.length-1; i >= 0;i--) {
        balls[i].x +=  balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        //x碰撞检测
        if(balls[i].x + RADIUS<0 || balls[i].x - RADIUS>WINDOW_WIDTH){
            balls.splice(i,1);
            continue;
        }
        //y碰撞检测
        if(balls[i].y + RADIUS > WINDOW_HEIGHT){
            balls[i].vy *= -0.75;
        }
    }
}
/**
 * 返回现在所剩秒数
 * @returns {number}
 */
function getCurShowTimeSeconds(){
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret/1000);

    return ret >= 0 ? ret : 0;
}