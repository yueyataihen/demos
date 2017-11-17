


    var banner = document.getElementById("banner");
	var bannerInner = utils.firstChild(banner),
	    bannerTip = utils.children(banner,"ul")[0],
	    bannerLink = utils.children(banner,"a"),
	    bannerLeft = bannerLink[0],
	    bannerRight = bannerLink[1];
	var divList = bannerInner.getElementsByTagName("div"),
	    imgList = bannerInner.getElementsByTagName("img"), 
	    oLis = bannerTip.getElementsByTagName("li");
	
//1、实现数据绑定：Ajax请求数据
	var jsonData = null;
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
		var str ="",str2 = "";
		if (jsonData){
			for(var i = 0,len=jsonData.length;i < len; i++) {
				var curData = jsonData[i];
				str +='<div><img src="" trueImg="'+curData["img"]+'"/></div>';
				i===0?str2 += '<li class="bg"></li>': str2 +='<li></li>';
			}
			//str +='<div><img src="" trueImg="'+jsonData[0]["img"]+'"/></div>';	
		}	
		bannerInner.innerHTML = str;
		bannerTip.innerHTML = str2;        
	}();
	//3、图片延迟加载
	window.setTimeout(lazyImg,200);
	function lazyImg () {
		for (var i = 0,len = imgList.length; i < len; i++ ) {
			~function (i){
				var curImg = imgList[i];
				var oImg = new Image;
				oImg.src = curImg.getAttribute("trueImg");   
				oImg.onload = function () {
					curImg.src = this.src;
					curImg.style.display = "block";
					//只对第一张做处理：z-index=1,opacity=1
					if (i===0) {
						var curDiv = curImg.parentNode;
						curDiv.style.zIndex = 1;
						Animate(curDiv,{opacity:1},300);
					}
					oImg = null;
			    }
			}(i);	
		}
	}
	//4、实现自动轮播
	var interval = 3000,autoTimer = null,step = 0;
	var autoTimer = setInterval(autoMove,interval);
	function autoMove (){
		if (step === (jsonData.length-1)){
            step = -1;
		}
		step++;
		setBanner();
	}
	//实现轮播图切换效果的代码：
	//让step索引对应的那个DIV的zIndex=1,其余的DIV透明度为0
	//让当前的透明度从0变成1，当动画结束，让其他DIV的透明度的值变为0

	//实现焦点对齐
	function setBanner(){
		//实现轮播图切换效果的代码：
		for(var i = 0,len = divList.length; i < len; i++) {
			var curDiv = divList[i];
			if (i===step){
				utils.css(curDiv,"zIndex",1);
                Animate(curDiv,{opacity:1},200,function(){
                	var curDivSib = utils.siblings(this);
                	for (var k = 0,len = curDivSib.length; k < len; k++){
                		utils.css(curDivSib[k],"opacity",0);
                	}
                });
				continue;
			}
			utils.css(curDiv,"zIndex",0);
		}
		//实现焦点对齐
		for (var i = 0,len = oLis.length; i < len; i++) {
			var curLi = oLis[i];
			i===step?utils.addClass(curLi,"bg"):utils.removeClass(curLi,"bg");
		}

	}
    //5、实现鼠标悬停停止自动轮播和在离开的时候再开启自动轮播的效果
    banner.onmouseover = function () {
    	window.clearInterval(autoTimer);
    	bannerLeft.style.display = bannerRight.style.display = "block";
    };
    banner.onmouseout = function () {
    	autoTimer = window.setInterval(autoMove,interval);
    	bannerLeft.style.display = bannerRight.style.display = "none";
    }
    //6、点击焦点实现轮播图切换
    ~function () {
    	for (var i = 0,len = oLis.length; i < len; i++) {
    		var curLi = oLis[i];
    		curLi.index = i;
    		curLi.onclick = function () {
    			step = this.index;
    			setBanner();		
    		}
    	}
    }();
    //7、实现左右切换
    bannerRight.onclick = autoMove;
    bannerLeft.onclick = function () {
    	if (step <= 0){
			step = jsonData.length;
		}
    	step--;
    	setBanner();
    }


























