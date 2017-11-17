//http://tool.css-js.com/
~function(){
	var Effect = {
		Linear:function(t,d,b,c){
			return (t/d)*c+b;
		}
	};
	//move:实现多方向的运动动画 ,curEle当前要操作运动的元素，target当前动画的目标位置，duration当前动画运动的总时间
	function move (curEle,target,duration,callBack){
		//每一次执行之前，首先把当前元素正在运行的动画结束掉
		window.clearInterval(curEle.timer);
		//根据target获取每一个方向的起始值begin和总距离change
		var begin = {},change = {};
		for(var key in target){
			if(target.hasOwnProperty(key)){
				begin[key]=utils.css(curEle,key);
				change[key]=target[key]-begin[key];
			}
		}
		//实现多方向的动画
		var time= 0;
		curEle.timer=window.setInterval(function(){
			time +=10;
			//到达目标，结束动画，让当前元素的样式等于目标样式值
			if(time >= duration){
				utils.css(curEle,target);
				window.clearInterval(curEle.timer);
				//typeof callBack === "function" ? callBack(curEle) : null;
				callBack && callBack.call(curEle);
                return;
			}
			//没到达目标，分别获取每一个方向的当前位置，给当前元素设置即可
			for(var key in target){
			    if(target.hasOwnProperty(key)){
				   var curPos = Effect.Linear(time,duration,begin[key],change[key]);
				   utils.css(curEle,key,curPos);
			    }
		    }
		},10);
	}
    window.Animate = move;
}();