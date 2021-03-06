//1、通过JQuery获取选择器或者筛选的方法获取到的jQuery对象集合是不存在DOM映射机制的，之前获取到的集合，之后在页面中的HTML结构改变
//集合中的内容不会自动跟着改变（JS获取的元素集合有DOM映射机制）

$(function(){
	var $banner = $("#bannerFir");
	var $bannerInner = $banner.children(".inner"),$bannerTip = $banner.children("ul");
	var $bannerLeft = $banner.children(".bannerLeft"),$bannerRight = $banner.children(".bannerRight");
	var $imgList = null,$divList = null,$oLis = null;

	//1、Ajax 读取数据
	var jsonData = null;
	$.ajax({
		url:"../json/banner.txt?_"+Math.random(),
		type:"get",
		dataType:"json",
		async:false,//当前的请求是同步的
		success:function(data){
           jsonData = data;
		}
	});
	console.log(jsonData);
	//2、实现数据的绑定
	bindData();
	function bindData(){
		var str = "", str2 = "";
		$.each(jsonData,function(index,item){
			str +="<div><img src='' trueImg='"+item["img"]+"'/></div>";
			index === 0 ? str2 += "<li class='bg'></li>" : str2 += "<li></li>" ;
		});
		$bannerInner.html(str);
		$bannerTip.html(str2);
        //绑定完成数据之后获取需要的集合
		$imgList = $bannerInner.find("img");
		$divList = $bannerInner.children("div");
		$oLis = $bannerTip.children("li");

	}
    //3、实现图片的延迟加载
    window.setTimeout(lazyImg,500);
    function lazyImg () {
    	$imgList.each(function(index,item){
    	  var _this = this;
          var oImg = new Image;
          oImg.src = $(this).attr("trueImg");//$(this)<==>$(item)
          oImg.onload = function (){
          	$(_this).prop("src",this.src).css("display","block");
          }
          //oImg = null;
    	});
    	$divList.eq(0).css("zIndex",1).animate({opacity: 1},300);
    }
    //封装一个轮播图切换的效果

    function changeBanner () {
    	var $curDiv = $divList.eq(step);
    	$curDiv.css("zIndex",1).siblings().css("zIndex",0);
    	$curDiv.animate({opacity: 1},300,function(){
    		$(this).siblings().css("opacity",0);
    	});
    	var $curLi = $oLis.eq(step);
    	$curLi.addClass("bg").siblings().removeClass("bg");
    }
    //4、实现自动轮播
    var interval = 3000,step = 0,autoTimer = null;
    var autoTimer = setInterval(autoMove,interval);
    function autoMove(){
        if (step === (jsonData.length-1)){
        	step = -1;
        }
    	step++;
    	changeBanner();
    }
    //5、控制左右按钮的显示隐藏和自动轮播的开始和结束
    $banner.on("mouseover",function(){
    	window.clearInterval(autoTimer);
    	$bannerLeft.css("display","block");
    	$bannerRight.css("display","block");

    }).on("mouseout",function(){
    	// autoTimer = window.setInterval(autoMove,interval);
    	autoTimer = window.setInterval(autoMove, interval);
    	$bannerLeft.css("display","none");
    	$bannerRight.css("display","none");
    });

    //6、实现焦点切换
    $oLis.on("click",function (){
    	step = $(this).index();
    	changeBanner();
    });

    // //7、左右切换
    $bannerRight.on("click",autoMove);
    $bannerLeft.on("click",function(){
    	if (step === 0){
    		step = jsonData.length;
    	}
    	step--;
    	changeBanner();
    });

});