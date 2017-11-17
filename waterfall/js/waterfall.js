
window.onload = function(){
	waterfall('main','pin');
	var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};
    window.onscroll=function(){
    	if(checkscrollside()){
    		var oParent = document.getElementById("main");
    		for(var i = 0,len = dataInt.data.length;i < len;i ++){
    			var oPin = document.createElement("div");
    			oPin.className = "pin";
    			oParent.appendChild(oPin);
    			var oBox = document.createElement("div");
    			oBox.className = "box";
    			oPin.appendChild(oBox);
    			var oImg = document.createElement("img");
    			oImg.src = "../images/"+dataInt.data[i].src;
    			oBox.appendChild(oImg);
    		}
    		waterfall('main','pin');
    	}
    };
};


function waterfall(parent,pin){
	var oParent = document.getElementById(parent);
	var apin = getClassObj(oParent,pin);
	var ipinW = apin[0].offsetWidth;
	var num = Math.floor(document.documentElement.clientWidth/ipinW);
	oParent.style.cssText = "width:"+ipinW*num+"px;margin: 0 auto;";

	var pinHArr = [];
	for(var i =0,len=apin.length;i<len;i++){
		var pinH = apin[i].offsetHeight;
		if(i<num){
			pinHArr[i] = pinH;	
		} else {
			var minH = Math.min.apply(null,pinHArr);
			var minHIndex = getminHIndex(pinHArr,minH);
			apin[i].style.position = "absolute";
			apin[i].style.top = minH + "px";
			apin[i].style.left = apin[minHIndex].offsetLeft+"px";
			pinHArr[minHIndex]+= apin[i].offsetHeight;
		}
	}
}



//通过父级和子元素的class类 获取该同类子元素的数组
function getClassObj (parent,className){
	var obj=parent.getElementsByTagName('*');
	var pinS =[];
	for(var i =0,len=obj.length;i<len;i++){
		if(obj[i].className==className){
			pinS.push(obj[i]);
		}
	}
	return pinS;
}

//获取 pin高度 最小值的索引index
function getminHIndex(arr,minH){
	for (var i in arr){
		if(arr[i]==minH){
			return i;
		}
	}
}

//检测是否具备加载数据块的条件
function checkscrollside(){
	var oParent = document.getElementById("main");
	var apin = getClassObj(oParent,"pin");
    var lastpinH = apin[apin.length-1].offsetTop+Math.floor(apin[apin.length-1].offsetHeight/2);
    var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
    var documentH = document.documentElement.clientHeight;
    return (lastpinH<scrollTop+documentH)?true:false;
}



