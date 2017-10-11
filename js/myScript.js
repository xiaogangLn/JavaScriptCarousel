// 当页面加载完成后将所以需要执行的函数添加到window的load事件上。这儿用的是dom0级事件的绑定，所以不能为window的load事件添加 多个事件处理程序，所以使用的方法是：先判断window.onload有没有绑定函数，如果绑定了，就将新的函数追加到尾部，如果没有绑定，就直接添加 给它。用attachEvent（）或者addEventListener（）可以为同一个元素的同一个事件绑定多个事件处理程序，可以不用下面这个方法。

function addLoadEvent(func){
    var oldLoad = window.onload;
    if(typeof oldLoad != 'function'){
        window.onload = func();
    }else{
        window.onload = function(){
            oldLoad();
            func();
        }
    }
}



//设置class为list的高度,因为图片的position为absolute所以.list元素的高度为零
//如果一个元素的父元素高度为0，那么设置这个元素的margin: auto 0; 不起作用
function setListHeight(){
    var list = document.getElementById('list');
    var imgItem = list.getElementsByTagName('img')[0];
    var height = imgItem.offsetHeight;
    var list = document.getElementById('list');
    list.style.height = height + 'px';
}

//设置li的层级，可以使用css设置
function setLiIndex(){
    var list = document.getElementById('list');
    var li = list.getElementsByTagName('li');
    var liLen = li.length;
    for(var i = 0;i<liLen;i++){
        li[i].style.zIndex = liLen-i;
    }
}
var index = 1;//index表示当前显示的页面,index是一个全局变量
var timer;// 定时器标识符，如果要清除定时器需要使用它

//事件的跨浏览器绑定的对象
var untilEvent = {
    addEvent:function(element,type,hander){
        if(element.addEventListener){
            element.addEventListener(type,hander,false);
        }else if(element.attachEvent){
            element.attachEvent('on'+type,hander);
        }else{
            element['on'+type] = hander;
        }
    },
    getEvent:function(event){
        return event?event:window.event;
    },
    getTarget:function(event){
        return event.target||event.srcElement;
    }

};
function btnClick(){
    var warp = document.getElementById('warp');
    untilEvent.addEvent(warp,'click',function(event){
        var event = untilEvent.getEvent(event);
        var target = untilEvent.getTarget(event);
        switch(target.id){
            case 'pre': if(index == 1){//如果当前显示的图片已经是第一张图片，当点击切换到"上一张"按钮，则将即将显示的图片设置为最后一张图片
                    index =3;
                }else{
                    --index;
                }
                anmitate();
                break;
            case 'next':if(index == 3){//如果当前显示的图片已经是最后图片，当点击切换到"下一张"按钮，则将即将显示的图片设置为第一张图片
                index = 1;
                }else{
                    ++index;
                }
                anmitate();
                break;
        }
    });
}
//减小图片透明度
function decline(cur,inverTime,inverOpacity){
    var opacityed = parseFloat(cur.style.opacity);
    if(opacityed > 0){
        cur.style.opacity = opacityed-inverOpacity;
        setTimeout(function(){
            decline(cur,inverTime,inverOpacity);
        },inverTime);
    }
}
//切换图片的函数
function anmitate(){
    var list = document.getElementById('list');
    var imgs = list.getElementsByTagName('img');
    var imgsLen = imgs.length;
    var whole = 300;//切换一张图片用的时间
    var inverTime = 5;//时间间隔
    var inverOpacity = 1/(whole/inverTime);
    for(var i = 0;i<imgsLen;i++){
        decline(imgs[i],inverTime,inverOpacity);
    }
    var go = function(){
        var opacityed = parseFloat(imgs[index - 1].style.opacity);
        if(opacityed < 1){
            imgs[index-1].style.opacity = opacityed + inverOpacity;
            setTimeout(go,inverTime);
        }
    };
    go();
}
//打开页面自动切换函数
function play() {
    timer = setTimeout(function () {
    if(index == 3){
            index = 1;
        }else{
            ++index;
        }
        anmitate();
         play();
         //
 }, 3000);
}
//停止切换函数,当鼠标移动到轮播上后取消自动切换，当鼠标从轮播上移开，又开始自动切换
function stop() {
    clearTimeout(timer);
}

//给最外层div添加鼠标移除和鼠标移入地事件处理程序
function getWarp(){
    var warp = document.getElementById('warp');
    untilEvent.addEvent(warp,"mouseout",play);
    untilEvent.addEvent(warp,"mouseover",stop);
}
//函数节流，当改变窗口大小时，图片的大小会变化，所以为了让控制按钮位于轮播垂直方向的中间，li的高度该随图片的大小做变化
function scrollEvent(){
    untilEvent.addEvent(window,"resize",function(){
        throttle(setListHeight);
    });
}
function throttle(method,context){
    clearTimeout(method.Tid);
    method.Tid = setTimeout(method,70);
}
addLoadEvent(scrollEvent);
addLoadEvent(setListHeight);
addLoadEvent(setLiIndex);
addLoadEvent(btnClick);
addLoadEvent(play);
addLoadEvent(getWarp);