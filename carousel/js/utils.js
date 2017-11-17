var utils = (function (){
	var flag = "getComputedStyle" in window;
	//使用惰性思想来封装常用的方法库，flag这个变量不销毁，存储的是判断当前的浏览器是否兼容getComputedStyle，兼容的话是标准浏览器，flag=false
    //表示当前浏览是IE6~8
    //children:获取curEle下所有的元素子节点（兼容所有的浏览器），如果传递了tagName可以在获取的几何中进行二次筛选，也把指定标签名获取到。
    function children (curEle,tagName){
	    	var ary = [];
		if (/MISE(6|7|8)/i.test(navigator.userAgent)) {
            var nodeList = oDiv.childNodes;	
		    for (var i=0,len=nodeList.length;i<len;i++){
			var curNode = nodeList[i];
			    if(curNode.nodeType===1){
                    ary[ary.length]=curNode;
			    }
	       	}
	       	nodeList = null;
		}
		else {
            ary = Array.prototype.slice.call(curEle.children);
		}
		if (typeof tagName==="string") {
			for (var k=0;k<ary.length;k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase()!== tagName.toLowerCase()){	
                	ary.splice(k,1);
                	k--;
                }
			}
		}
		return ary;
	}
	//获取上一个哥哥元素节点
    function prev (curEle) {
		if(flag){
			return curEle.previousElementSibling;
		}
		var pre = curEle.previousSibling;
		while(pre&&pre.nodeType!==1){
			pre = pre.previousSibling;
			return pre;
		}
	}
    //获取下一个弟弟元素节点
    function next (curEle) {
		if(flag){
			return curEle.nextElementSibling;
		}
		var nex = curEle.nextSibling;
		while(nex&&nex.nodeType!==1){
			nex = nex.nextSibling;
			return nex;
		}
	}
    //获取所有的哥哥元素节点
    function prevAll (curEle) {
		var ary = [];
		var pre = this.prev(curEle);
		while (pre){
			ary.unshift(pre);
			pre = this.prev(pre);
		}
		return ary;
	}
	//获取所有的弟弟元素节点nextAll
    function nextAll (curEle) {
		var ary = [];
		var nex = this.next(curEle);
		while (nex){
			ary.push(nex);
			nex = this.next(nex);
		}
		return ary;
	}
	//获取相邻的两个元素节点sibling
	function sibling(curEle){
		var pre = this.prev(curEle);
		var nex = this.next(curEle);
		var ary= [];
		pre?ary.push(pre):null;
		nex?ary.push(nex):null;
		return ary;
	}
	//获取所有的哥哥弟弟元素节点siblings
	function siblings(curEle){
		return this.prevAll(curEle).concat(this.nextAll(curEle));
	}
	//获取当前元素的索引index
    function index(curEle){
    	return this.prevAll(curEle).length;
    }
    //获取第一个元素子节点firstChild
    function firstChild(curEle){
    	var chs = this.children(curEle);
    	//console.log(chs);
    	return chs.length>0?chs[0]:null;
    }
    //获取最后一个元素子节点lastChild
    function lastChild(curEle){
    	var chs = this.children(curEle);
    	return chs.length>0?chs[chs.length-1]:null;
    }
    //append:向指定的容器末尾追加新元素
	function append (newEle,container){
		container.appendChild(newEle);
	}
	//prepend:向指定的容器末尾追加新元素,即把新的元素添加到容器中第一个子元素节点的前面,如果一个元素子节点都没有就放到末尾
	function prepend (newEle,container){
		var fir = utils.firstChild(container);
		if (fir) {
			container.insertBefore(newEle,fir);
		}
		container.appendChild(newEle);
	}
	//insertBefore:把新元素追加到指定元素前面
	function insertBefore(newEle,oldEle) {
		oldEle.parentNode.insertBefore(newEle,oldEle);
	}
	//insertAfter:把新元素追加到旧元素后面
	//相当于追加到旧元素弟弟元素的前面,如果当前元素是最后一个，把新的元素放在最末尾即可
	function insertAfter(newEle,oldEle){
		var nex = utils.next(oldEle);
		if (nex) {
			oldEle.parentNode.insertBefore(newEle,nex);
			return;
		}
		oldEle.parentNode.appendChild(newEle);
	}
	//hasClass:验证当前元素是否包含className这个样式名
	function hasClass (curEle,className) {
		var reg = new RegExp("(^| +)"+className+"( +|$)");
		return reg.test(curEle.className);
	}
	//addClass:给元素增加样式类名
	function addClass(curEle,className){
		//为了防止传递进来的字符串包含多个类名，将其按照一到多个空格拆分成数组的每一项
		var ary = className.split(/ +/g);
		for (var i=0,len=ary.length;i<len;i++) {
			var curName = ary[i];
			if(!this.hasClass (curEle,curName)){
			curEle.className += " "+curName;
		}
		}	
	}
	//removeClass:给元素移除类名
	function removeClass(curEle,className){
		//为了防止传递进来的字符串包含多个类名，将其按照一到多个空格拆分成数组的每一项
		var ary = className.split(/ +/g);
		for (var i=0,len=ary.length;i<len;i++) {
			var curName = ary[i];
			if(this.hasClass (curEle,curName)){
				var reg = new RegExp("(^| +)"+curName+"( +|$)","g");
				curEle.className = curEle.className.replace(reg," ");
		}
		}	
	}
	 //getElementsByClass:通过样式类名获取一组集合
	function getElementsByClass (strClass,context){
    	context = context||document;
    	//把传递进来的样式类名首尾空格先去掉，然后在中间按照空格拆分成数组的每一项
    	if (flag) {
    		return  Array.prototype.slice.call(context.getElementsByClassName(strClass));
    	}
    	var ary = [];
    	var strClassAry = strClass.replace(/(^ +| +$)/g,"").split(/ +/g);
    	var nodeList = context.getElementsByTagName("*");
    	for (var i = 0,len=nodeList.length;i<len;i++) {
    		var curNode = nodeList[i];
    		var isOK = true;
    		for(var k = 0; k < strClassAry.length; k++){
    			var reg = new RegExp("(^ +)"+strClassAry[k]+"( +$)");
    			if (!reg.test(curNode.className)){
    				isOK = false;
    				break;
    			}
    		}
    		if(isOK) {
    		    ary.push(curNode);
    		}	
    	}
    	return ary;
    }
    //getCSS:获取样式值
	function getCss(attr){
    var val = null,reg = null;
    if("getComputedStyle" in window){
      val=window.getComputedStyle(this,null)[attr];
    } else {
    	if (attr==="opacity"){
    		val=curEle.currentStyle["filter"];
    		reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
    		val=reg.test(val)?reg.exec(val)[1]/100:1;
    	}
    	else {
        val=curEle.currentStyle[attr];
        }
    } 
    reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
    return reg.test(val)?parseFloat(val):val;
    }
    //setCSS:设置样式值
    function setCss (attr,value) {
	    if (attr==="float"){
			this["style"]["cssFloat"]=value;
			this["style"]["styleFloat"]=value;
			return;
		}
		if (attr==="opacity"){
			this["style"]["opacity"]=value;
			this["style"]["filter"]="alpha(opacity="+value*100+")";
			return;
		}
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
        	if (!isNaN(value)) {
        		value += "px";
        	}
        }
		this["style"][attr] = value;
	}

	//getGroupCss:给当前元素批量地设置样式
	function setGroupCss (options) {
		//遍历对象中的每一项，调取setCss方法一项项进行设置
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				setCss.call(this,key,options[key]);
			}			
		}
	}

	function css (curEle) {
		var argTwo = arguments[1];
		var ary = Array.prototype.slice.call(arguments,1);
		if (typeof argTwo==="string") {
			if (typeof arguments[2]==="undefined") {
				//return this.getCss(curEle,argTwo);
				return getCss.apply(curEle,ary);
			}
			setCss.apply(curEle,ary);
		}
		argTwo = argTwo || 0;
		if (argTwo.toString()==="[object Object]") {
		    setGroupCss.apply(curEle,ary);
		}
	}
    
    //offset:实现获取页面中任意一个元素，距离body的偏移（包含左偏移和上偏移)
	function offset(curEle){
        var totalLeft=null;
        var totalTop=null;
        par=curEle.offsetParent;
        //首先将自身进行累加
        totalLeft+=curEle.offsetLeft;
        totalTop+=curEle.offsetTop;
        //只要没有找到body,我们就把父级参照物的边框和偏移量进行累加
        while(par){
            totalLeft+=par.offsetLeft;
            totalTop+=par.offsetTop;
            totalLeft+=par.clientLeft;
            totalTop+=par.clientTop;
            par=par.offsetParent;
            return{left:totalLeft,top:totalTop};
        }
    }
    

    //win:有关操作浏览器盒子模型的方法，如果只传递attr没有传递value,默认意思是获取；如果两个参数都传递了，意思是设置。
    function win(attr,value){
        if(typeof value==="undefined"){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=value;
        document.body[attr]=value; 
                  
    }

    //JSONParse:把JSON格式的字符串转化成SON格式的对象
    function JSONParse(str) {
    	var val = null;
    	try {
    		val = JSON.parse(str);
    	}
    	catch (e) {
    		val = eval("(" + str + ")");
    	}
    	return val;
    }

    //listToArray:实现将类数组转换为数组
    function listToArray(likeArray) {
    	var ary = [];
    	for (var i=0;i<likeArray.length;i++) {
    		try {
    		ary = Array.prototype.splice.call(likeArray);
    	    }
    	    catch(e) {
    		ary[ary.length]=likeArray[i];
    	    }
    	} 	
    	return ary;
    }
    


    //把外界需要的方法暴露给utils
 	return {
	    children: children,
	    prev: prev,
	    next: next,
	    prevAll: prevAll,
	    nextAll: nextAll,
	    sibling: sibling,
	    siblings: siblings,
	    index: index,
	    firstChild: firstChild,
	    lastChild: lastChild,
	    append: append,
	    prepend: prepend,
	    insertBefore: insertBefore,
	    insertAfter: insertAfter,
	    hasClass: hasClass,
	    addClass: addClass,
	    removeClass: removeClass,
	    getElementsByClass: getElementsByClass,
	    css: css,
	    offset: offset,
	    win: win,
	    JSONParse: JSONParse,
	    listToArray: listToArray,
	   










	}
})();