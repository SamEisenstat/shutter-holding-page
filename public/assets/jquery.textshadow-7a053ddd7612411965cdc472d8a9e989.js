/*
 * jQuery textShadow plugin
 * Version 1.1 (26/02/2010)
 * @requires jQuery v1.2+
 *
 * Copyright (c) 2008 - 2010 Kilian Valkhof (kilianvalkhof.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
(function(e){e.fn.textShadow=function(t){return this.each(function(){var n=e(this);n.removeTextShadow();var r=n.css("text-shadow").split(" "),i=parseInt(r[3],10),s="<span class='jQshad'>"+n.html()+"</span>",o={left:parseInt(n.css("padding-left"),10),top:parseInt(n.css("padding-top"),10)},u={color:r[0],radius:i,xoffset:parseInt(r[1],10)-1+(o.left-i)+"px",yoffset:parseInt(r[2],10)-1+(o.top-i)+"px",opacity:50},a=e.extend(u,t);a.color=a.color.length==4?a.color.replace(/#([0-9A-f])([0-9A-f])([0-9A-f])/i,"#$1$1$2$2$3$3"):a.color;var f="progid:DXImageTransform.Microsoft.Glow(Color="+a.color+",Strength="+a.radius/6+") progid:DXImageTransform.Microsoft.Blur(pixelradius="+a.radius+", enabled='true') progid:DXImageTransform.Microsoft.Alpha(opacity="+a.opacity+")";e.browser.msie&&a!=""&&(n.css({position:"relative",zoom:"1"}).append(s),n.children("span.jQshad").css({position:"absolute","z-index":"-1",zoom:"1",left:a.xoffset,top:a.yoffset,color:a.color,filter:f,"-ms-filter":f}))})},e.fn.removeTextShadow=function(){return this.each(function(){e(this).children("span.jQshad").remove()})}})(jQuery);