/*----------------------- begin of grid -------------------------*/
function _GenGridTable(cfg)
{
	var html="";
	if( cfg.FixHeight > 0 || cfg.FixWidth > 0 )
	{
		html += "<div style=\"overflow:scroll;";
		if( cfg.FixHeight > 0 ) html += "height:"+cfg.FixHeight+"px;";
		if( cfg.FixWidth > 0 ) html += "width:"+cfg.FixWidth+"px;";
		html += "\">";
	}
	html += "<table class=\"table table-bordered table-striped table-hover table-condensed\" ><thead><tr>";
	var iColCount = cfg.columns.length;
	var sKey="";//关键字列
	for(var i=1;i<iColCount;i++)
	{
		var col = cfg.columns[i];
		if( col.Visible)
		{
			var s="<th><div style=\"width:"+col.Width+"px\">";
			if( col.IsOperator)
				s += "<input type=\"checkbox\" id=\"chk_"+cfg.Name+"\" onclick=\"javascript:gridcheckall_"+cfg.Name+"();\" >";
			else
				s += col.Caption;
			s += "</div></th>";
			html += s;
		}
		if( col.IsKey ) sKey = col.Field;
	}
	html += "</tr></thead>";
	html += "<tbody>";
	var iCount = cfg.data.length;
	for(var j=0;j<iCount;j++)
	{
		var data = cfg.data[j];
		var str="<tr>";
		for(var i=0;i<iColCount;i++)
		{
			var col = cfg.columns[i];
			if( col.Visible )
			{
				if( col.IsOperator )
				{
					str += "<td>";
					if( cfg.CanSelect )
					{
						str += "<input style=\"margin-right:4px\" type=\"checkbox\" name=\"chk_"+cfg.Name+j+"\"  value=\""+data[sKey]+"\" />";
					}
					if( cfg.CanEdit )
					{
						var surl=cfg.EditUrl;
						if( surl.lastIndexOf('?') < 0 ) surl += "?";
						else surl += "&";
						surl += sKey+"="+data[sKey]+cfg.userparam;
						str += "<a href=\""+surl+"\">";
						if(0+cfg.BsVer == 2 )
							str += "<i class=\"icon-edit\"></i>";
						else
							str += "<span class=\"glyphicon glyphicon-edit\"></span>";
					
						str += "</a>";
					}
					if( cfg.CanDelete )
					{
						//var surl=cfg.url+"?__sid__="+cfg.SID+"&__event__=On_"+cfg.Name+"Delete&key="+data[sKey];
						str += "<a href='#' style=\"margin-left:4px\" onclick=\"javascript:before_griddel"+cfg.Name+"('"+data[sKey]+"');\">";
						if(0+cfg.BsVer == 2 )
							str += "<i class=\"icon-remove\"></i>";
						else
							str += "<span class=\"glyphicon glyphicon-remove\"></span>";
						
						str += "</a>";
					}
					
					str += "</td>";
				}
				else if( col.IsSerial )
				{
					str += "<td>" + (j+1) + "</td>";
				}
				else
				{
					str += "<td>";
					if( col.CanView )
					{
						var surl="";
						if( col.StaticUrl )
						{
							surl += col.ViewUrl+"_"+data[sKey]+".html";
						}
						else
						{
							surl += col.ViewUrl;
							if( surl.lastIndexOf("?") < 0 ) surl += "?";
							else surl += "&";
							surl += sKey+"="+data[sKey];
						}
						
						str += "<a href=\""+surl+"\">";
					}
					str += data[col.Field];
					if( col.CanView )
					{
						str += "</a>";
					}
					str += "</td>";
				}
			}
		}
		str += "</tr>";
		html += str;
	}
	html += "</tbody>";
	html += "</table>";
	if( cfg.FixHeight > 0 || cfg.FixWidth > 0 ) html += "</div>";

	return html;
}
function _GenGridPager(cfg)
{
	var _CurPage = 0+cfg.CurPage;
	if( _CurPage < 1 ) _CurPage = 1;

	var pages=[];
	if( cfg.TotalPage <= cfg.MaxPage )
	{
		for(var i=1;i<=cfg.TotalPage;i++)
		{
			pages.push(i);
		}
	}
	else
	{
			//    |....left....|--------------ar-------------------|....right....|
			//                          |=====mi====|   
			//                              p
			//    |....left....|====mi====|----------------ar------|....right....|
			//    |....left....|----------------ar------|====mi====|....right....|
			//左边显示2个，第三个是...，右边显示...及最后2个
			//效果举例：
			//    <  1  2  ...  30 31 32 33 34 35 ...  89 90 >
			var mi = cfg.MaxPage - 6;
			var p = cfg.CurPage;

			//计算mi的起点 
			var iStart=0;
			if( p <= 3 )
				iStart = 4;
			else
			{
				if( p >= cfg.TotalPage - 2 - mi/2 )
					iStart = cfg.TotalPage - 2- mi;
				else
					iStart = p - Math.floor(mi / 2);
			}
			pages.push(1);
			pages.push(2);
			if( iStart == 4 )
				pages.push(3);
			else
				pages.push(0);
			

			for(var i=0;i<mi;i++)
				pages.push(iStart+i);
			

			if( iStart + mi == cfg.TotalPage - 2 )
				pages.push( cfg.TotalPage-2);
			else
				pages.push(0);
			

			pages.push( cfg.TotalPage - 1 );
			pages.push( cfg.TotalPage );
	}

	var lefturl="";
	var righturl = "";

	var _MaxPage = 0+cfg.MaxPage;
	var _TotalPage = 0+cfg.TotalPage;

	var deltaLeft = _CurPage - _MaxPage;
	if( deltaLeft <= 0 )
		deltaLeft = 1;
	
	var deltaRight = _CurPage + _MaxPage;
	if( deltaRight >= _TotalPage )
		deltaRight = _TotalPage;
	

	lefturl = cfg.url;
	lefturl += "?"+cfg.CurPageName+"="+deltaLeft+cfg.userparam;

	righturl = cfg.url;
	righturl += "?" + cfg.CurPageName + "="+deltaRight+cfg.userparam;


	var html="";
	if(0+cfg.BsVer == 2 )
		html += "<div class=\"pagination\"><ul>" ;
	else
		html += "<ul class=\"pagination\">" ;
	html +=
			  "<li><a  href=\""+lefturl+"\">&laquo;</a></li>";
	var iPage;
	var iPageCount = 0+pages.length;
	//log.Infor("iPageCount="+iPageCount);
	for(iPage=0;iPage<iPageCount;iPage++)
	{
		var index = pages[iPage];
		html += "<li class=\"";
		if( index == 0 )
			html += "disabled";
		else
		{
			if( index == _CurPage )
				html += "active";
		}
		html += "\" style=\"display:inline\" ><a ";
		if( index != 0 )
		{
			html += " href=\""+cfg.url;
			html += "?" + cfg.CurPageName +"="+index+cfg.userparam+"\"";
		}
		
		html += ">";
		if( index == 0 )
			html += "...";
		else
			html += ""+index;
		html += "</a></li>";
	}

	html += " <li><a  href=\""+righturl+"\">&raquo;</a></li>";
	html += "</ul>";
	if(0+cfg.BsVer == 2 )
		html += "</div>";
	

	return html;
}
function _GenGridDelHint(cfg)
{
	var html="";
	var surl=cfg.url+"&__event__=On_"+cfg.Name+"Delete&key=";
	if(0+cfg.BsVer == 2 )
		html += 
		"<div class=\"modal hide fade\" id=\"dlg_" + cfg.Name +"\">" +
			  "<div class=\"modal-header\">" +
			    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
			    "<input type=\"hidden\" id=\"delkey_"+cfg.Name+"\"/>" +
			    "<h3>确认</h3>"+
			  "</div>"+
			  "<div class=\"modal-body\">"+
			    "<p>"+ cfg.DelHint+"</p>"+
			  "</div>"+
			  "<div class=\"modal-footer\">"+
			    "<a href=\"#\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">取消</a>"+
			    "<a href=\"#\" class=\"btn btn-primary\" onclick=\"javascript:griddel"+cfg.Name+"($(\'#delkey_"+cfg.Name+"\').val());\" >确定</a>"+
			  "</div>"+
			"</div>"
			;

	else
		html += 
			"<div class=\"modal fade\" style=\"z-index:100001\" id=\"dlg_" + cfg.Name +"\">" +
			"<div class=\"modal-dialog\">"+
			"<div class=\"modal-content\">"+
				  "<div class=\"modal-header\">" +
			"<button type=\"button\" class=\"close\" data-dismiss=\"modal\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>"+
		"<h4 class=\"modal-title\">询问</h4>"+
			"<input type=\"hidden\" id=\"delkey_"+cfg.Name+"\"/>" +
				  "</div>"+
				  "<div class=\"modal-body\">"+
				    "<p>"+ cfg.DelHint+"</p>"+
				  "</div>"+
				  "<div class=\"modal-footer\">"+
					"<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消</button>"+
					"<button type=\"button\" class=\"btn btn-primary\" onclick=\"javascript:griddel"+cfg.Name+"($(\'#delkey_"+cfg.Name+"\').val());\">确定</button>"+			    
				  "</div>"+
				"</div>"+
			"</div>"+
			"</div>"
				;

	return html;
}

function RenderGrid(id,cfg,curPage)
{
	var sCode="";
	//sCode += _GenGridDelHint(cfg);
	$(document.body).append(_GenGridDelHint(cfg));
	sCode += "<div class=\"ui attached message\">";
	if( cfg.Caption != "" )
	{
		sCode += "<div class=\"header\">" + cfg.Caption + "</div>";
	}
	sCode += _GenGridTable(cfg);
	if( cfg.UsePager )
	{
		sCode += "<div class=\"ui bottom attached info message\">";
		sCode += _GenGridPager(cfg);
		sCode += "</div>";
	}
	sCode += "</div>\r\n";


	$('#'+id).replaceWith(sCode);
}


/*----------------------- end of grid -------------------------*/