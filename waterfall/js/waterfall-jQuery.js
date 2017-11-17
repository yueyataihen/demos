$(window).on("load",function(){
	waterfall();
	var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};
	$(window).on("scroll",function(){
		if(checkscrollside()){
			$.each(dataInt.data,function(key,value){
				var $oPin = $("<div>").addClass("pin").appendTo($("#main"));
				var $oBox = $("<div>").addClass("box").appendTo($oPin);
				$("<img>").attr("src","../images/"+$(value).attr("src")).appendTo($oBox);
				waterfall();
			});
		}
	});
});
function waterfall(){
	var $apin = $("#main>div");
	var iPinW = $apin.eq(0).width();
	var num = Math.floor($(window).width()/iPinW);
	$("#main").css({
		"width": iPinW*num,
		"margin":"0 auto"
	});
	var pinHArr =[];
	$apin.each(function(index,value){
		var pinH = $apin.eq(index).height();
		if(index<num){
			pinHArr[index]=pinH;
		}
		else {
			var minH = Math.min.apply(null,pinHArr);
			var minHIndex = $.inArray(minH,pinHArr);
			$(value).css({
				"position": "absolute",
				"top": minH,
				"left": $apin.eq(minHIndex).position().left
			});
			pinHArr[minHIndex] += $apin.eq(index).height();
		}
	});
}
function checkscrollside(){
	ue:false;var $apin = $( "#main>div" );
	var lastPinH = $apin.last().offset().top+Math.floor($apin.last().height()/2);
	console.log(lastPinH);
	var scrollTop = $(window).scrollTop();
	var clientHeight = $(window).height();
	return (lastPinH<(scrollTop+clientHeight))
}