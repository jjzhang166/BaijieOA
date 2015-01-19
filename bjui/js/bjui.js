function HTMLEncode(text){
	text = text.replace(/&/g, "&amp;") ;
	text = text.replace(/"/g, "&quot;") ;
	text = text.replace(/</g, "&lt;") ;
	text = text.replace(/>/g, "&gt;") ;
	text = text.replace(/\ /g,"&nbsp;");
	text = text.replace(/\n/g,"<br>");
	text = text.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
	return text;
}

function StopEvent()
{
	if(window.event) {
		event.cancelBubble = true;//IE
		event.returnValue =false;
	}else {
		event.stopPropagation();// 其它浏览器下阻止冒泡
	}
	event.returnValue =false;
	return false;
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function bj_alert(sTitle,sText){
	$("#g_alert_title").html(sTitle);
	$("#g_alert_hint").html(sText);

	$('#g_alert').modal("show");
}
//for pagecall
function adjust_frame(sFrameID){
	try
	{
		parent.document.all(sFrameID).style.height=document.body.scrollHeight; 
		parent.document.all(sFrameID).style.width=document.body.scrollWidth; 
	}
	catch (ex)
	{
	}
	
}
//for pagecall
function SetOutput(sName,sValue){
	var oFunc = new Function("sValue","parent.SetOutput" + sName+"(sValue);");
	oFunc(sValue);
}
//for pagecall
function CommitCall(sFuncName){
	var parentFunc = new Function("parent.CommitCall" + sFuncName+"();");
	parentFunc();
}
//for pagecall
function CancelCall(sFuncName){
	var parentFunc = new Function("parent.CancelCall" + sFuncName+"();");
	parentFunc();
}