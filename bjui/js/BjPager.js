function _GenPager(cfg)
{
	var _CurPage = 0+cfg.CurPage;
	if( _CurPage < 1 ) _CurPage = 1;
	var _MaxPage = 0 + cfg.MaxPage;
	var _TotalPage = 0 + cfg.TotalPage;

	var pages=[];
	if( _TotalPage <= _MaxPage )
	{
		for(var i=1;i<=_TotalPage;i++)
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
			var mi = _MaxPage - 6;
			var p = _CurPage;

			//计算mi的起点 
			var iStart=0;
			if( p <= 3 )
				iStart = 4;
			else
			{
				if( p >= _TotalPage - 2 - mi/2 )
					iStart = _TotalPage - 2- mi;
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
			

			if( iStart + mi == _TotalPage - 2 )
				pages.push( _TotalPage - 2);
			else
				pages.push(0);
			

			pages.push( _TotalPage - 1 );
			pages.push( _TotalPage );
	}

	var lefturl="";
	var righturl = "";

	var deltaLeft = _CurPage - _MaxPage;
	if( deltaLeft <= 0 )
		deltaLeft = 1;
	
	var deltaRight = _CurPage + _MaxPage;
	if( deltaRight >= _TotalPage )
		deltaRight = _TotalPage;
	
	var url = cfg.Url;
	if( url.lastIndexOf('?') < 0 ) url += "?";
	else url += "&";

	lefturl = url;
	lefturl += cfg.CurPageName+"="+deltaLeft+"&"+cfg.userparam;

	righturl = url;
	righturl += cfg.CurPageName + "="+deltaRight+"&"+cfg.userparam;


	var html="";
	if( 0+cfg.BsVer == 2 )
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
		html += "\" ><a ";
		if( index != 0 )
		{
			html += " href=\""+url;
			html += cfg.CurPageName +"="+index+"&"+cfg.userparam+"\"";
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
	if( 0 + cfg.BsVer == 2 )
		html += "</div>";

	return html;
}

function RenderPager(id,cfg)
{
	$('#'+id).replaceWith(_GenPager(cfg));
}