<?php
	if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
		file_put_contents('../../index.html', stripslashes($_POST['indexhtml']));
		file_put_contents('../css/style.css', stripslashes($_POST['stylecss']));
	}
	if(! is_writable('../../index.html')) printf('index.html file is not writable<br>');
	if(! is_writable('../css/style.css')) printf('style.css file is not writable<br>');
	
?>
<!doctype html>
<html>
<head>
	<meta charset=utf-8>
	<title>Content Generator</title>
	<style>
		body {
			font-family: 'PT Sans', Arial, sans-serif;
			font-size: 18px;
			max-width: 1200px;
			margin: 0 auto;
		}
		textarea {
			width: 80%;
			height: 400px;
			margin: 0 auto;
		}
		#savebutton {
			width: 160px;
			height: 60px;
			background: #51c4d4;
			color: #fff;
			font-size: 20px;
			border: none;
			cursor: pointer;
		}
		h3 {
			font-weight: normal;
		}
	</style>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
</head>
<body>



<form action="" method="post">
	<h3>The contents below are generated based on <strong>settings.json</strong> and <strong>images.json</strong> files.<br><br>Click the <strong>"Save files"</strong> button to automatically save the contents to the indicated files.<h3>
	
	<input type="submit" value="Save files" id="savebutton">
	
	<h2>INDEX.HTML</h2>
	<textarea id="indexhtml" name="indexhtml"></textarea>

	<h2>STYLE.CSS</h2>
	<textarea id="stylecss" name="stylecss"></textarea>

</form>

<script>
;(function($){

$.getJSON('settings.json', function(settings) {
$.getJSON('images.json', function(images) {

var useLightbox = false;
	
var indexHTML ='<!DOCTYPE HTML>' +
'\n<html>'+
'\n<head>'+
	'\n\t<meta charset=utf-8>'+
	'\n\t<title>Coverflow<\/title>'+
	'\n\t<link rel="stylesheet" href="'+settings.Global.path+'css/style.css">'+
'\n<\/head>'+
'\n<body>'+
'\n<div id="coverflow">'+
'\n\t<div class="covers">'+
	'\n\t\t<ul>';

	$.each(images.Images, function() {
		indexHTML += 
			'\n\t\t<li><div class="imgdiv">'+
						'\n\t\t\t<a'+
						((this.link !=="" && this.link !== undefined && this.target !== "none")?' href="'+
							((this.link.substr(0,7) ==='http://' || this.link.substr(0,8) ==='https://')?'':settings.Global.path)+
							this.link+'"':'')+
						((this.target === "lightbox")?' data-gallery="gallery"':'')+
						((this.target ==="_blank" || this.target === "_self")?' target="'+this.target+'"':'')+
						((this.lightboxCaption !== "" && this.lightboxCaption)? ' data-cap="'+this.lightboxCaption+'"':'')+
						'>'+
							'\n\t\t\t\t<img src="'+
								((this.imageURL.substr(0,7)==='http://' || this.imageURL.substr(0,8)==='https://')?'':settings.Global.path)+
								this.imageURL +'" alt="">'+
						'\n\t\t\t</a>'+
				 '\n\t\t\t</div>'+
				 '\n\t\t\t<div class="text">\n\t\t\t\t'+
				 	 this.text+
				 '\n\t\t\t</div>'+
			'\n\t\t</li>';
		if (!useLightbox && this.target === "lightbox") useLightbox = true;
	});

	indexHTML +=	'\n\t\t</ul>'+
		'\n\t</div>'+
		((settings.Controller.controller) ? '\n\t<div class="Controller"></div>': '')+
		((settings.Scrollbar.scrollbar) ? '\n\t<div class="ScrollBar"></div>' : '')+
	'\n</div>'+

'\n\n<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"><\/script>'+
'\n<script src="'+settings.Global.path+'js/coverflow.min.js"><\/script>'+
'\n<script> $coverflow = $("#coverflow").coverflow({"path":"'+settings.Global.path+'"}); <\/script>'+

'\n\n<\/body>'+
'\n<\/html>';

$('#indexhtml').text(indexHTML);

var	startID = Math.round(images.Images.length/2),
	ulX = (settings.Global.coverflowWidth/2-settings.Global.imageWidth/2-((startID-1)*settings.Global.imageSpacing));

/////////////////////////
/////// STYLE.CSS ///////
/////////////////////////

var styleCSS =
	'#coverflow {\n\t'+
		'max-width: '+ settings.Global.coverflowWidth +'px;\n\t'+
		'height: '+ settings.Global.coverflowHeight +'px;\n\t'+
		((settings.Global.backgroundColor !== '')?'background: '+settings.Global.backgroundColor +';\n\t':'')+
		'position: relative;\n\t'+
		'margin: 0 auto;\n\t'+
		'-moz-user-select: none;\n\t'+
		'-webkit-user-select: none;\n\t'+
		'-ms-user-select: none;\n\t'+
		'user-select: none;'+
		( (settings.Global.bindMouseWheel == true) ? '\n\toverflow: hidden;' :''	) +
		( (settings.Global.bindArrowKeys == true) ? '\n\toutline: solid 0px;' :'' ) +
	'\n}\n\n'+

	'.covers {\n\twidth: 100%;\n\theight: 100%;\n\tmargin: 0 auto;\n\toverflow: hidden;\n\tposition: absolute;\n}\n\n'+

	'#coverflow ul {\n\t'+
		'top: '+ (settings.Global.imageHeight*(settings.Global.frontImageScaleRatio/100 - 1)/2) +'px;\n\t'+
		'width: 5000px;\n\t'+
		'margin: 0;\n\t'+
		'padding: 0;\n\t'+
		'position: absolute;\n\t'+
		'-webkit-transition: -webkit-transform '+ settings.Global.transitionDuration/1000 +'s '+settings.Global.transitionFunction+';\n\t'+
		'transition: transform '+ settings.Global.transitionDuration/1000 +'s '+settings.Global.transitionFunction+';\n\t'+
		'-webkit-transform: translate3d('+ ulX +'px, 0, 0);\n\t'+
		'transform: translate3d('+ ulX +'px, 0, 0);\n'+
	'}\n\n'+

	'#coverflow li {\n\t'+
		'width: '+settings.Global.imageSpacing+'px;\n\t'+
		'list-style: none;\n\t'+
		'float: left;\n\t'+
		'-webkit-transition: margin '+settings.Global.transitionDuration/1000+'s '+settings.Global.transitionFunction+', -webkit-transform '+settings.Global.transitionDuration/1000+'s '+settings.Global.transitionFunction+';\n\t'+
		'transition: margin '+settings.Global.transitionDuration/1000+'s '+settings.Global.transitionFunction+', transform '+settings.Global.transitionDuration/1000+'s '+settings.Global.transitionFunction+';\n\t'+
		'position: relative;\n\t'+
		'pointer-events: none;\n\t'+
	'}\n\n'+

	'#coverflow .imgdiv {\n\t'+
		'width: '+settings.Global.imageWidth+'px;\n\t'+
		'-webkit-transition: -webkit-transform '+settings.Global.transitionDuration/1000+'s '+settings.Global.transitionFunction+';\n\t'+
		'transition: transform '+settings.Global.transitionDuration/1000+'s '+settings.Global.transitionFunction+';\n\t'+
		'pointer-events: auto;\n\t'+
		'position: relative;\n\t'+
		'display: block;\n\t'+
		(
			(settings.Shadow.imageShadows == true)
			? 'box-shadow: '+ settings.Shadow.shadowSize +'px 5px 15px -10px rgba(0,0,0,'+ settings.Shadow.shadowOpacity/100 +'),'
				+ ' -'+ settings.Shadow.shadowSize +'px 5px 15px -10px rgba(0,0,0,'+ settings.Shadow.shadowOpacity/100 +');\n'
			: ""
		)

	+'}\n\n'+

	'#coverflow .imgdiv img {\n\t'+
		'width: '+ settings.Global.imageWidth +'px;\n\t'+
		'display: block;\n'+
	'}\n\n'+

	(
		(settings.Reflection.reflection == true)
		? '#coverflow .refl {\n\t'+
			'display: block;\n\t'+
			'position: absolute;\n\t'+
			'top: 100%;\n\t'+
			'-webkit-transform: scaleY(-1);\n\t'+
			'transform: scaleY(-1);\n\t'+
			'opacity: '+settings.Reflection.reflectionOpacity/100+';\n'+
		'}\n\n'+

		'#coverflow .refl img {\n\t'+
			'display: block;\n'+
		'}\n\n'+

		'#coverflow .refl::before {\n\t'+
			'content: "";\n\t'+
			'position: absolute;\n\t'+
			'width: 102%;\n\t'+
			'margin-left: -1%;\n\t'+
			'height: 100%;\n\t'+
			'box-shadow: inset '+ settings.Reflection.reflectionColor +' 0 '+ settings.Global.imageWidth*(100-settings.Reflection.reflectionSize)/100 +'px '+ settings.Reflection.reflectionSpread + 'px;\n'+
		'}\n\n'
		: '#coverflow .refl {\n\t'+
			'display: none;\n'+
		'}\n\n'
	)

	+'#coverflow .text {\n\t'+
		'position: absolute;\n\t'+
		(
			((settings.Text.fontPosition === 'bottom')?
				'bottom: '+(-settings.Global.imageHeight*(settings.Global.frontImageScaleRatio/100 -1)/2)+'px;\n\t'+
				'top: auto;\n\t':'')+
			((settings.Text.fontPosition === 'top')?
				'top: '+(-settings.Global.imageHeight*(settings.Global.frontImageScaleRatio/100 -1)/2)+'px;\n\t'+
				'bottom: auto;\n\t':'')+
			((settings.Text.fontPosition !== 'bottom' && settings.Text.fontPosition !== 'top')?
				'bottom: auto;\n\t'+
				'top: '+settings.Text.fontMarginTop+'px;\n\t':'')
		)+
		'-moz-box-sizing: border-box;\n\t'+
		'box-sizing: border-box;\n\t'+
		'-webkit-transition: opacity '+settings.Global.transitionDuration/1000+'s;\n\t'+
		'transition: opacity '+settings.Global.transitionDuration/1000+'s;\n\t'+
		'opacity: 0;\n\t'+
		'visibility: hidden;\n\t'+
		'pointer-events: auto;\n\t'+
		'background: '+settings.Text.fontBackColor+';\n\t'+
		(
			(settings.Text.fontWidth === 'auto')?
			'width: '+(settings.Global.imageWidth*settings.Global.frontImageScaleRatio/100)+'px;\n\t'+
			'margin-left: '+(-settings.Global.imageWidth*(settings.Global.frontImageScaleRatio/100 - 1)/2)+'px;\n\t'
			:
			'width: '+settings.Text.fontWidth+'px;\n\t'+
			'margin-left: '+((settings.Global.imageWidth-settings.Text.fontWidth)/2)+'px;\n\t'
		)+
		'color: '+settings.Text.fontColor+';\n\t'+
		'font-family: '+settings.Text.fontFamily+',Helvetica, sans-serif;\n\t'+
		'font-size: '+settings.Text.fontSize+'px;\n'+
	'}\n\n'+

	'#coverflow .text p {\n\t'+
		'margin: 5px;\n\t'+
		'position: relative;\n\t'+
		'text-align: center;\n'+
	'}\n\n'+


	'li:nth-child(-n+'+(startID-1)+') .imgdiv,\n'+
	'#coverflow ul li .leftItems {\n\t'+
		'-webkit-transform: perspective('+settings.Global.imagePerspective+'px) rotateY('+settings.Global.imageRotation+'deg);\n\t'+
		'transform: perspective('+settings.Global.imagePerspective+'px) rotateY('+settings.Global.imageRotation+'deg);\n'+
	'}\n\n'+

	'li:nth-child(n+'+(startID+1)+') .imgdiv,\n'+
	'#coverflow ul li .rightItems {\n\t'+
		'-webkit-transform: perspective('+settings.Global.imagePerspective+'px) rotateY(-'+settings.Global.imageRotation+'deg);\n\t'+
		'transform: perspective('+settings.Global.imagePerspective+'px) rotateY(-'+settings.Global.imageRotation+'deg);\n'+
	'}\n\n'+

	'li:nth-child('+startID+') .imgdiv,\n'+
	'#coverflow ul li .straight {\n\t'+
		'-webkit-transform: rotateY(0deg) scale('+settings.Global.frontImageScaleRatio/100+');\n\t'+
		'transform: rotateY(0deg) scale('+settings.Global.frontImageScaleRatio/100+');\n'+
	'}\n\n'+


	'#coverflow li:nth-child(-n+'+(startID-1)+'),\n'+
	'#coverflow ul li.leftLI {\n\t'+
		'-webkit-transform: translate3d(-'+settings.Global.frontImageSpacing+'px, 0, 0);\n\t'+
		'transform: translate3d(-'+settings.Global.frontImageSpacing+'px, 0, 0);\n'+
	'}\n\n'+

	'#coverflow li:nth-child(n+'+(startID+1)+'),\n'+
	'#coverflow ul li.rightLI {\n\t'+
		'-webkit-transform: translate3d('+settings.Global.frontImageSpacing+'px, 0, 0);\n\t'+
		'transform: translate3d('+settings.Global.frontImageSpacing+'px, 0, 0);\n'+
	'}\n\n'+

	'#coverflow ul .straightLI {\n\t'+
		'-webkit-transform: translate3d(0, 0, 0);\n\t'+
		'transform: translate3d(0, 0, 0);\n'+
	'}\n\n'+

	'.notransition {\n\t'+
		'-webkit-transition: none !important;\n\t'+
		'transition: none !important;\n'+
	'}\n\n'+


	'#coverflow .imgdiv a,\n'+
	'#coverflow .text {\n\t'+
		'cursor: pointer;\n'+
		(
			(settings.Global.mouseCursor === "grab")
			? '\t/*grab cursor available for all browsers except IE (we can use external .cur file but uses too much CPU)*/\n\t'+
			  'cursor: -webkit-grab;\n\t'+
			  'cursor: grab;\n'
			: ''
		)
	+'}\n\n' +

	'#coverflow .Preloader {\n\t'+
		'/*none - autoplay:false ; block - autoplay:true*/\n\t'+
		(
			(settings.Controller.autoPlay == true)
			? 'display: block;\n'
			: 'display: none;\n'
		)
	+'}\n\n'+

	'#coverflow .Lightbox {\n\t'+
		(
			(useLightbox) 
			? 'display: block;\n'
			: 'display: none;\n'
		)
	+'}';

/////////////////////////
///// CONTROLLER.CSS ////
/////////////////////////

if (settings.Controller.controller) {
	styleCSS += 
	'\n\n.Controller { z-index: 10000; position: absolute; left: 50%; margin-top: '+settings.Controller.controllerMarginTop+'px; }\n'+
	'#relativediv { position: relative; left: -50%; }\n'+
	'.Controller img { margin-right: 3px; position: relative; opacity: .6; cursor: pointer; }\n'+
	'.Controller img:hover { opacity: 1; }\n'+
	'#prev {'+ (settings.Controller.arrows?'-webkit-transform: scaleX(-1); transform: scaleX(-1);':'display: none')+'}\n'+
	(settings.Controller.arrows?'':'#next {display: none}\n')+
	'#play { position: relative; }\n'+
	'#pause-span { visibility: hidden; position: relative; }\n'+
	'#pause { position: absolute; right: 100%; }\n'+
	'.Preloader {\n\t'+
		'position: absolute;\n\t'+
		'width: 30px;\n\t'+
		'height: 30px;\n\t'+
		'margin-left: '+settings.Controller.preloaderMarginLeft+'%;\n\t'+
		'margin-top: '+settings.Controller.preloaderMarginTop+'%;\n\t'+
		'background-color: #aaa;\n\t'+
		'border: 3px solid #333;\n\t'+
		'-webkit-border-radius: 100%;\n\t'+
		'border-radius: 100%;\n\t'+
		'z-index: 9999;\n\t'+
		'opacity: 0;\n\t'+
		'visibility: hidden;\n\t'+
		'-webkit-transition: -webkit-transform '+settings.Controller.pauseDelay/1000+'s ease-in-out,\n\t\t'+
					'opacity '+settings.Controller.pauseDelay/1000+'s ease-in-out;\n\t'+
		'transition: transform '+settings.Controller.pauseDelay/1000+'s ease-in-out,\n\t\t'+
					'opacity '+settings.Controller.pauseDelay/1000+'s ease-in-out;\n'+
	'}\n'+
	'.modified { opacity: 1; -webkit-transform: scale(0); transform: scale(0); }';

};

/////////////////////////
//// SCROLLBAR.CSS //////
/////////////////////////

if(settings.Scrollbar.scrollbar) {
	styleCSS +=
	'\n\n.ScrollBar {\n\t'+
		'width: '+settings.Scrollbar.scrollbarWidth+'px;\n\t'+
		'height: '+settings.Scrollbar.scrollbarHeight+'px;\n\t'+
		'cursor: pointer;\n\t'+
		'position: absolute;\n\t'+
		'z-index: 10000;\n\t'+
		'margin-left: auto;\n\t'+
		'margin-right: auto;\n\t'+
		'left: 0;\n\t'+
		'right: 0;\n\t'+
		'margin-top:'+settings.Scrollbar.marginTop+'px;\n\t'+
		'overflow: hidden;\n'+
	'}\n\n'+

	'.ScrollBar .firstArrow,\n'+
	'.ScrollBar .lastArrow{\n\t'+
		'display: '+((settings.Scrollbar.arrows)?'block':'none')+';\n\t'+
		'width: '+settings.Scrollbar.scrollbarHeight+'px;\n\t'+
		'height: '+settings.Scrollbar.scrollbarHeight+'px;\n\t'+
		'background: '+settings.Scrollbar.thumbColor+';\n\t'+
		'float: left;\n\t'+
		'border-radius: '+settings.Scrollbar.borderRadius+'px;\n'+
	'}\n\n'+

	'.ScrollBar .firstTriangle,\n'+
	'.ScrollBar .lastTriangle {\n\t'+
		'margin-top: '+Math.round(settings.Scrollbar.scrollbarHeight/3)+'px;\n\t'+
		'margin-left: '+(settings.Scrollbar.scrollbarHeight*.35)+'px;\n\t'+
		'width: 0;\n\t'+
		'height: 0;\n\t'+
		'border-top: 4px solid transparent;\n\t'+  //here not?
		'border-bottom: 4px solid transparent;\n'+ //and here
	'}\n\n'+

	'.ScrollBar .firstTriangle { border-right: 5px solid #777; }\n'+
	'.ScrollBar .lastTriangle { border-left: 5px solid #777; }\n\n'+

	'.ScrollBar .dragArea {\n\t'+
		'width: '+
		((settings.Scrollbar.arrows)?settings.Scrollbar.scrollbarWidth - 2*settings.Scrollbar.scrollbarHeight
									: settings.Scrollbar.scrollbarWidth
		)
		+'px;\n\t'+
		'height: '+settings.Scrollbar.scrollbarHeight+'px;\n\t'+
		'background: '+settings.Scrollbar.scrollBackColor+';\n\t'+
		'float: left;\n\t'+
		'border-radius: '+settings.Scrollbar.borderRadius+'px;\n'+
	'}\n\n'+

	'.ScrollBar .tracker {\n\t'+
		'width: '+ ((settings.Scrollbar.thumbWidth === "auto")?0:settings.Scrollbar.thumbWidth) +'px;\n\t'+
		'height: '+(settings.Scrollbar.scrollbarHeight - 4)+'px;\n\t'+
		'background: '+settings.Scrollbar.thumbColor+';\n\t'+
		'margin: 2px;\n\t'+
		'border-radius: '+settings.Scrollbar.borderRadius+'px;\n\t'+
		'float: left;\n\t'+
		'left: 0;\n\t'+
		'z-index: 1000;\n\t'+
		'transition: left '+settings.Global.transitionDuration/1000+'s;\n'+
	'}';
};

$('#stylecss').html(styleCSS);

});

}).error(function() {$('body').html("<br><br>It seems that you're accessing this page from a local folder in your computer. Please run it from your web server.<br>The address you should have in your browser should be similar with<br><b><span style='text-decoration:underline'>http://</span>www.yourdomain.com/coverflow/config/index.html</b><br>instead of<br><b>"+document.URL+"</b>")} );


})(jQuery);
</script>
</body>
</html>