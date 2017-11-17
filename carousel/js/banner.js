(function(){
	var banner = document.getElementById("banner");
	var bannerInner = utils.firstChild(banner);
	var bannerTip = utils.children(banner,"ul")[0];
	var imgList = bannerInner.getElementsByTagName("img"); 
	var oLis = bannerTip.getElementsByTagName("li");
	var bannerLeft = utils.children(banner,"a")[0];
	var bannerRight = utils.children(banner,"a")[1];

	//1、实现数据绑定：Ajax请求数据
	var jsonData = null,count = null;
	~function (){
		var xhr = new XMLHttpRequest;
		xhr.open("get","json/banner.txt?_="+Math.random(),false);
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)){
				jsonData = utils.JSONParse(xhr.responseText);			
			}
		};
		xhr.send(null);
		console.log(jsonData);
	}();
    //2、按照字符串拼接的方式绑定数据
	~function(){
		//绑定的是轮播图区域的数据
		var str ="";
		if (jsonData){
			for(var i = 0,len=jsonData.length;i < len; i++) {
				var curData = jsonData[i];
				str +='<div><img src="" trueImg="'+curData["img"]+'"/></div>';
			}
			str +='<div><img src="" trueImg="'+jsonData[0]["img"]+'"/></div>';
		}
		bannerInner.innerHTML = str;
		count = jsonData.length+1;
		utils.css(bannerInner,"width",count*790);

		//绑定的是焦点区域的数据
		var str ="";
		if (jsonData){
			for(var i = 0,len=jsonData.length;i < len; i++) {
				var curData = jsonData[i];
				i===0?str += '<li class="bg"></li>': str +='<li></li>';
				bannerTip.innerHTML = str;			
			}
		}
	}();
	//3、实现图片的延迟加载
	window.setTimeout(lazyImg,500);
	function lazyImg(){
		for(var i = 0,len=imgList.length; i < len; i++){
			~function(i){
				var curImg = imgList[i];
			    var oImg = new Image;
			    oImg.src = curImg.getAttribute("trueImg");
			    oImg.onload = function () {
				    curImg.src = this.src;
				    curImg.style.display = "block";
				    oImg = null;
				    Animate(curImg, {opacity:1}, 300);			    
			    }
			}(i);			
		}
	}
	//4、实现自动轮播
	var step = 0;//记录步长，即当前是哪一张图片
	var interval = 3000;
	var autoTimer = window.setInterval(autoMove,interval);
	function autoMove () {
		//console.log(step);
		if (step >= (count-1)){
			step = 0;
			//console.log(step);
			utils.css(bannerInner,"left",0);
			// return;
		}
		step++;
		Animate(bannerInner,{left:-step*790},500);
		changeTip();
	}

    //5、实现焦点对齐
    function changeTip () {
    	var tempStep = step >= oLis.length ? 0 : step; 
    	//console.log(tempStep);
    	//console.log(step);
    	for (var i = 0,len = oLis.length; i < len; i++) {
    		var curLi = oLis[i];
    		i === tempStep ? utils.addClass(curLi,"bg"): utils.removeClass(curLi,"bg");
    	}
    }
    //6、停止和开启自动轮播
    banner.onmouseover = function () {
    	window.clearInterval(autoTimer);
    	bannerLeft.style.display = bannerRight.style.display = "block";
    };
    banner.onmouseout = function () {
    	autoTimer = window.setInterval(autoMove,interval);
    	bannerLeft.style.display = bannerRight.style.display = "none";
    }
    //7、点击焦点实现轮播图切换
    ~function () {
    	for (var i = 0,len = oLis.length; i < len; i++) {
    		var curLi = oLis[i];
    		curLi.index = i;
    		curLi.onclick = function () {
    			step = this.index;
    			changeTip();
    			Animate(bannerInner,{left:-step*790},500);
    		}
    	}
    }();
    //8、实现左右切换
    bannerRight.onclick = autoMove;
    bannerLeft.onclick = function () {
    	if (step <= 0){
			step = count-1;
			utils.css(bannerInner,"left",-step*790);
			return;
		}
    	step--;
    	changeTip();
        Animate(bannerInner,{left:-step*790},500);
    }

})();