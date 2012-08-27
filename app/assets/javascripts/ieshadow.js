/*
*  text-shadow for MSIE
*  Copyright (c) 2011-2012 Kazz
*  http://asamuzak.jp
*  Dual licensed under MIT or GPL
*  http://asamuzak.jp/license
*/

var isMSIE = /*@cc_on!@*/false;
var ieVersion = (function(reg) { return isMSIE && navigator.userAgent.match(reg) ? RegExp.$1 * 1 : null; })(/MSIE\s([0-9]+[\.0-9]*)/);
var cNum = (function(n) { return function() { return n++; }})(0);

function textShadowForMSIE(eObj) {
  var ieShadowSettings = function() {
    if(isMSIE) {
      var arr = [];
      if(eObj) {
        arr[arr.length] = eObj;
        return arr;
      }
      else {
        arr = [
          // Write your text-shadow settings here, like below.
          { sel : 'h2', shadow : '0px 1px 0px #FFFFFF' },
          { sel : 'h3', shadow : '0px 1px 2px #222222' },
          { sel : 'h3.notify', shadow : '0px 1px 0em #FFFFFF' },
          { sel : 'h4', shadow: '0px 1px 2px #202020' }

        ];
        for(var sReg = /text\-shadow\s*:\s*([0-9a-zA-Z\s\-\+\*\&#\.\(\)%\,\!\"\\'\>\<\\]+);?/, aTag = document.getElementsByTagName('*'), oId = cNum(), i = 0, l = aTag.length; i < l; i++) {
          if(aTag[i].style != null && aTag[i].style.cssText.match(sReg)) {
            aTag[i].id == '' && (aTag[i].id = 'objId' + oId, oId++);
            arr[arr.length] = { sel : '#' + aTag[i].id, shadow : RegExp.$1 };
          }
        }
        return cssShadowValues().concat(arr);
      }
    }
    else {
      return null;
    }
  };
  /*  general functions  */
  var getCompStyle = function(elm, pseudo) {
    return (isMSIE && (ieVersion < 9 || document.documentMode < 9)) ? elm.currentStyle : pseudo != null ? document.defaultView.getComputedStyle(elm, pseudo) : document.defaultView.getComputedStyle(elm, '');
  };
  var getAncestObj = function(pElm) {
    var arr = [];
    if(pElm = pElm.parentNode) {
      for(arr[arr.length] = pElm; pElm.nodeName.toLowerCase() != 'html';) {
        (pElm = pElm.parentNode) && (arr[arr.length] = pElm);
      }
    }
    return arr;
  };
  var revArr = function(arr) {
    for(var rArr = [], i = 0, l = arr.length; i < l; i++) {
      rArr.unshift(arr[i]);
    }
    return rArr;
  };
  var convUnitToPx = function(sUnit, obj) {
    var getUnitRatio = function(sUnit) {
      var elm, val, dId = cNum(), dBox = document.createElement('div'), dBody = document.getElementsByTagName('body')[0];
      dBox.id = 'dummyDiv' + dId;  dId++;
      dBox.style.width = sUnit;
      dBox.style.height = 0;
      dBox.style.visibility = 'hidden';
      dBody.appendChild(dBox);
      elm = document.getElementById(dBox.id);
      val = Math.abs(elm.getBoundingClientRect().right - elm.getBoundingClientRect().left);
      dBody.removeChild(elm);
      return val;
    };
    if(sUnit.match(/^0(em|ex|px|cm|mm|in|pt|pc)?$/)) {
      return 0;
    }
    else if(sUnit.match(/^(\-?[0-9\.]+)px$/)) {
      return RegExp.$1 * 1;
    }
    else if(sUnit.match(/^(\-?[0-9\.]+)(cm|mm|in|pt|pc)$/)) {
      return RegExp.$1 * 1 >= 0 ? getUnitRatio(sUnit) : getUnitRatio((RegExp.$1 * -1) + RegExp.$2) * -1;
    }
    else if(sUnit.match(/^(\-?[0-9\.]+)(em|ex)$/)) {
      var val = RegExp.$1 * 1 >= 0 ? (getUnitRatio(sUnit) / getUnitRatio('1em')) : (getUnitRatio(sUnit) / getUnitRatio('1em') * -1), arr = getAncestObj(obj), dRoot = document.getElementsByTagName('html')[0], fSize = [];
      arr.unshift(obj);  arr[arr.length] = dRoot;
      for(var i = 0, l = arr.length; i < l; i++) {
        fSize[fSize.length] = getCompStyle(arr[i]).fontSize;
      }
      for(i = 0, l = fSize.length; i < l; i++) {
        if(fSize[i].match(/^([0-9\.]+)%$/)) {
          val *= (RegExp.$1 / 100);
        }
        else if(fSize[i].match(/^[0-9\.]+(em|ex)$/)) {
          val *= (getUnitRatio(fSize[i]) / getUnitRatio('1em'));
        }
        else if(fSize[i].match(/^smaller$/)) {
          val /= 1.2;
        }
        else if(fSize[i].match(/^larger$/)) {
          val *= 1.2;
        }
        else {
          fSize[i].match(/^([0-9\.]+)(px|cm|mm|in|pt|pc)$/) ? val *= getUnitRatio(fSize[i]) :
          fSize[i].match(/^xx\-small$/) ? val *= getUnitRatio(getCompStyle(dRoot).fontSize) / 1.728 :
          fSize[i].match(/^x\-small$/) ? val *= getUnitRatio(getCompStyle(dRoot).fontSize) / 1.44 :
          fSize[i].match(/^small$/) ? val *= getUnitRatio(getCompStyle(dRoot).fontSize) / 1.2 :
          fSize[i].match(/^medium$/) ? val *= getUnitRatio(getCompStyle(dRoot).fontSize) :
          fSize[i].match(/^large$/) ? val *= getUnitRatio(getCompStyle(dRoot).fontSize) * 1.2 :
          fSize[i].match(/^x\-large$/) ? val *= getUnitRatio(getCompStyle(dRoot).fontSize) * 1.44 :
          fSize[i].match(/^xx\-large$/) ? val *= getUnitRatio(getCompStyle(dRoot).fontSize) * 1.728 :
          fSize[i].match(/^([0-9\.]+)([a-z]+)/) && (val *= getUnitRatio(fSize[i]));
          break;
        }
      }
      return Math.round(val);
    }
  };
  var convPercentTo256 = function(cProf) {
    if(cProf.match(/(rgba?)\(\s*([0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?)\s*(,\s*[01]?[\.0-9]*)?\s*\)/)) {
      for(var cType = RegExp.$1, arr = RegExp.$2.split(/,/), aCh = (RegExp.$3 || ''), rgbArr = [], i = 0, l = arr.length; i < l; i++) {
        arr[i].match(/([0-9\.]+)%/) && (arr[i] = Math.round(RegExp.$1 * 255 / 100));
        rgbArr[rgbArr.length] = arr[i];
      }
      return cType + '(' + rgbArr.join(',') + aCh + ')';
    }
  };
  var removeDupFunc = function(fStr) {
    for(var arr = fStr.replace(/\s+/, '').split(/;/), fArr = [], bool, i = 0, l = arr.length; i < l; i++) {
      bool = true;
      for(var j = i; j < l; j++) {
        i != j && arr[i] == arr[j] && (bool = false);
      }
      bool && arr[i] != '' && (fArr[fArr.length] = arr[i]);
    }
    return fArr.join(';') + ';';
  };
  /*  end general functions  */
  var getCssValues = function(prop) {
    var sReg = prop.match(/(\-)/) ? prop.replace(RegExp.$1, '\\\-') : prop;
    sReg += '\\s*:\\s*([0-9a-zA-Z\\s\\-\\+\\*\\\&#\\.\\(\\)%\\,\\!\\"\\\'\\>\\<\\\\]+);?';
    var getCssRules = function(sSheet) {
      for(var arr = [], sRules = sSheet.cssRules || sSheet.rules, i = 0, l = sRules.length; i < l; i++) {
        if(sRules[i].type) {
          sRules[i].type == 3 && (arr = arr.concat(getCssRules(sRules[i].styleSheet)));
          if(sRules[i].type == 4) {
            /*
            *  matchMedia() polyfill - test whether a CSS media type or media query applies
            *  authors: Scott Jehl, Paul Irish, Nicholas Zakas
            *  Copyright (c) 2011 Scott, Paul and Nicholas.
            *  Dual MIT/BSD license
            *  Original Source matchMedia.js https://github.com/paulirish/matchMedia.js
            *  Revised by Kazz http://asamuzak.jp
            */
            window.matchMedia = window.matchMedia || (function() {
              return function(q) {
                var bool,
                  dHead = document.getElementsByTagName('head')[0],
                  dBody = document.getElementsByTagName('body')[0],
                  dStyle = document.createElement('style'),
                  dDiv = document.createElement('div'),
                  dId = cNum();
                dDiv.id = 'dDiv' + dId;  dId++;
                dDiv.style.cssText = 'margin:0;border:0;padding:0;height:0;visibility:hidden;';
                dHead.appendChild(dStyle);
                dBody.appendChild(dDiv);
                dStyle.setAttribute('media', q);
                dStyle.innerHTML = '#' + dDiv.id + '{ width:42px; }';
                bool = dDiv.offsetWidth == 42;
                dBody.removeChild(dDiv);
                dHead.removeChild(dStyle);
                return { matches: bool, media: q };
              };
            })();
            /*  end matchMedia.js  */
            window.matchMedia(sRules[i].media.mediaText).matches && (arr = arr.concat(getCssRules(sRules[i])));
          }
          sRules[i].type == 1 && sRules[i].style.cssText.match(sReg) && (arr[arr.length] = { sel : sRules[i].selectorText, prop : prop, val : sRules[i].style.getPropertyPriority(prop) ? RegExp.$1 + ' !important' : RegExp.$1 });
          sRules[i].type == 1 && sRules[i].selectorText.match(pseudoReg) && (pArr[pArr.length] = { sel : sRules[i].selectorText, cText : sRules[i].style.cssText });
          if(sRules[i].type == 1 && sRules[i].selectorText.match(dynPseudoReg)) {
            sRules[i].style.cssText.match(sReg) && (dArr[dArr.length] = { sel : sRules[i].selectorText, cText : sRules[i].style.getPropertyPriority(prop) ? RegExp.$1 + ' !important' : RegExp.$1 });
          }
        }
        else {
          var sText = sRules[i].style.cssText || sRules[i].cssText;
          if(sText) {
            sText.match(sReg) && !sRules[i].selectorText.match(pseudoReg) && (arr[arr.length] = { sel : sRules[i].selectorText, prop : prop, val : RegExp.$1 });
            sRules[i].selectorText.match(pseudoReg) && (pArr[pArr.length] = { sel : sRules[i].selectorText, cText : sText });
            if(sRules[i].selectorText.match(dynPseudoReg)) {
              sText.match(sReg) && (dArr[dArr.length] = { sel : sRules[i].selectorText, cText : RegExp.$1 });
            }
          }
        }
      }
      return arr;
    };
    if(document.styleSheets) {
      for(var arr = [], sArr = document.styleSheets, i = 0, l = sArr.length; i < l; i++) {
        if(isMSIE && (ieVersion < 9 || document.documentMode < 9) && sArr[i].imports) {
          for(var iArr = sArr[i].imports, j = 0, k = iArr.length; j < k; j++) {
            iArr[j] != undefined && (arr = arr.concat(getCssRules(iArr[j])));
          }
        }
        arr = arr.concat(getCssRules(sArr[i]));
      }
    }
    for(var aTag = document.getElementsByTagName('*'), oId = cNum(), i = 0, l = aTag.length; i < l; i++) {
      if(aTag[i].style != null && aTag[i].style.cssText.match(sReg)) {
        aTag[i].id == '' && (aTag[i].id = 'objId' + oId, oId++);
        arr[arr.length] = { sel : '#' + aTag[i].id, prop : prop, val : RegExp.$1.match(/important/) ? RegExp.$1 : RegExp.$1 + ' !important' };
      }
    }
    return arr;
  };
  var cssShadowValues = function() {
    for(var arr = [], sArr = getCssValues('text-shadow'), revReg = /^(#[0-9a-fA-F]{3,6})\s+([0-9a-zA-Z\s\-\.\(\)%\,\!]+)$/, i = 0, l = sArr.length; i < l; i++) {
      arr[arr.length] = { sel : sArr[i].sel, shadow : sArr[i].val.match(revReg) ? RegExp.$2 + ' ' + RegExp.$1 : sArr[i].val };
    }
    return arr;
  };
  var setShadow = function(tObj) {
    var setShadowNodeColor = function(elm) {
      for(var arr = elm.childNodes, i = 0, l = arr.length; i < l; i++) {
        if(arr[i].nodeType == 1) {
          !arr[i].hasChildNodes() ? arr[i].style.visibility = 'hidden' : (arr[i].style.color = elm.style.color, setShadowNodeColor(arr[i]));
        }
      }
    };
    var hideAncestShadow = function(oElm, pElm) {
      for(var arr = pElm.childNodes, i = 0, l = arr.length; i < l; i++) {
        if(arr[i].hasChildNodes()) {
          arr[i].nodeName.toLowerCase() == oElm.tagName.toLowerCase() && arr[i].firstChild.nodeValue == oElm.firstChild.nodeValue ? arr[i].style.visibility = 'hidden' : hideAncestShadow(oElm, arr[i]);
        }
      }
    };
    var boolShadowChild = function(elm) {
      for(var bool = true, arr = getAncestObj(elm), i = 0, l = arr.length; i < l; i++) {
        if(arr[i].tagName.toLowerCase() == 'span' && arr[i].className.match(/dummyShadow/)) {
          bool = false;
          break;
        }
      }
      return bool;
    };
    if(tObj.shadow != 'invalid') {
      for(var nArr = tObj.elm.childNodes, bool = false, i = 0; i < nArr.length; i++) {
        if(nArr[i].nodeName.toLowerCase() == 'span' && nArr[i].className.match(/dummyShadow/)) {
          if(nArr[i].className.match(/hasImp/)) {
            bool = true;
          }
          else {
            tObj.elm.removeChild(nArr[i]);
            --i;
          }
        }
      }
      if(bool == false || tObj.hasImp == true) {
        for(var aBg, arr = getAncestObj(tObj.elm), i = 0, l = arr.length; i < l; i++) {
          aBg == null && (getCompStyle(arr[i]).backgroundColor != 'transparent' || getCompStyle(arr[i]).backgroundImage != 'none') && (aBg = arr[i]);
          for(var cArr = arr[i].childNodes, j = 0, k = cArr.length; j < k; j++) {
            cArr[j].nodeType == 1 && cArr[j].nodeName.toLowerCase() == 'span' && cArr[j].className.match(/dummyShadow/) && hideAncestShadow(tObj.elm, document.getElementById(cArr[j].id));
          }
        }
        tObj.shadow != 'none' && tObj.shadow.length > 1 && (getCompStyle(tObj.elm).backgroundColor != 'transparent' || getCompStyle(tObj.elm).backgroundImage != 'none') && (tObj.shadow = revArr(tObj.shadow));
        if(tObj.shadow == 'none') {
          for(var arr = tObj.elm.parentNode.childNodes, i = 0, l = arr.length; i < l; i++) {
            if(arr[i].nodeName.toLowerCase() == 'span' && arr[i].className == 'dummyShadow') {
              getCompStyle(tObj.elm).display == 'inline-block' && (tObj.elm.style.display = 'inline');
              getCompStyle(tObj.elm).position == 'relative' && (tObj.elm.style.position = 'static');
              break;
            }
          }
          if(!eObj && tObj.elm.getAttribute('data-dynpseudo') != null) {
            var dAttr = tObj.elm.getAttribute('data-dynpseudo');
            if(dAttr.match(/(\|;\|default.+)$/)) {
              dAttr = dAttr.replace(RegExp.$1, '');
            }
            dAttr += ('|;|' + escape('default' + '||none' + (tObj.hasImp ? ' !important' : '')));
            tObj.elm.setAttribute('data-dynpseudo', dAttr);
          }
        }
        if(tObj.shadow != 'none' && nArr.length != 0 && boolShadowChild(tObj.elm)) {
          for(var clNode = tObj.elm.cloneNode(true), arr = clNode.childNodes, i = 0, l = arr.length; i < l; i++) {
            arr[i] != null && arr[i].hasChildNodes() && arr[i].nodeName.toLowerCase() == 'span' && arr[i].className.match(/dummyShadow/) && clNode.removeChild(arr[i]);
          }
          var sNode = clNode.innerHTML;
          ieVersion == 9 && (sNode = sNode.replace(/\n/, ' '));
          ieVersion == 8 && (tObj.elm.innerHTML = tObj.elm.innerHTML);
          for(i = 0, l = tObj.shadow.length; i < l; i++) {
            var pxRad = convUnitToPx(tObj.shadow[i].z, tObj.elm);
            var xPos = convUnitToPx(tObj.shadow[i].x, tObj.elm) - pxRad + convUnitToPx(getCompStyle(tObj.elm).paddingLeft, tObj.elm);
            getCompStyle(tObj.elm).textAlign == 'center' && (xPos -= ((convUnitToPx(getCompStyle(tObj.elm).paddingLeft, tObj.elm) + convUnitToPx(getCompStyle(tObj.elm).paddingRight, tObj.elm)) / 2));
            var yPos = convUnitToPx(tObj.shadow[i].y, tObj.elm) - pxRad + convUnitToPx(getCompStyle(tObj.elm).paddingTop, tObj.elm);
            if(ieVersion == 7 && pxRad == 0) {
              xPos >= 0 && (xPos -= 1);
              yPos >= 0 && (yPos -= 1);
            }
            var sColor = tObj.shadow[i].cProf || getCompStyle(tObj.elm).color;
            var sOpacity = 0.6;  // デフォルトの透過度
            tObj.shadow[i].cProf != null && tObj.shadow[i].cProf.match(/rgba\(\s*([0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+)\s*,\s*([01]?[\.0-9]*)\)/) && (sColor = 'rgb(' + RegExp.$1 + ')', sOpacity = (RegExp.$2 * 1));
            var sBox = document.createElement('span');
            sBox.id = 'dummyShadow' + sId;  sId++;
            sBox.className = (tObj.hasImp == true) ? 'dummyShadow hasImp' : 'dummyShadow';
            sBox.style.display = 'block';
            sBox.style.position = 'absolute';
            sBox.style.left = xPos + 'px';
            sBox.style.top = yPos + 'px';
            sBox.style.width = '100%';
            sBox.style.color = sColor;
            sBox.style.filter = 'progid:DXImageTransform.Microsoft.Blur(PixelRadius=' + pxRad + ', MakeShadow=false, ShadowOpacity=' + sOpacity + ')';
            sBox.style.zIndex = -(i + 1);
            sBox.innerHTML = sNode;
            if(getCompStyle(tObj.elm).display == 'inline') {
              tObj.elm.style.display = 'inline-block';
            }
            if(!(getCompStyle(tObj.elm).position == 'absolute' || getCompStyle(tObj.elm).position == 'fixed')) {
              tObj.elm.style.position = 'relative';
              ieVersion == 7 && (tObj.elm.style.top = getCompStyle(tObj.elm).paddingTop);
            }
            if(getCompStyle(tObj.elm).backgroundColor != 'transparent' || getCompStyle(tObj.elm).backgroundImage != 'none') {
              getCompStyle(tObj.elm).zIndex != ('auto' || null) ? (sBox.style.zIndex = tObj.elm.style.zIndex) : (tObj.elm.style.zIndex = sBox.style.zIndex = -1);
              ieVersion == 7 && (tObj.elm.style.zIndex = 1, sBox.style.zIndex = -1);
            }
            if(aBg && aBg.tagName.toLowerCase() != 'body') {
              tObj.elm.style.zIndex = 1; sBox.style.zIndex = -1;
            }
            ieVersion == 7 && getCompStyle(tObj.elm).lineHeight.match(/^([0-9\.]+)(em|ex|px|cm|mm|in|pt|pc|%)?$/) && (tObj.elm.style.minHeight = !RegExp.$2 ? convUnitToPx(RegExp.$1 + 'em', tObj.elm) : RegExp.$2 == '%' ? convUnitToPx((RegExp.$1 / 100) + 'em', tObj.elm) : convUnitToPx(RegExp.$1 + RegExp.$2, tObj.elm));
            if(tObj.elm.getAttribute('data-pseudo') != null) {
              var cloneCSS = unescape(tObj.elm.getAttribute('data-pseudo')).split('|;|');
              for(var j = 0, k = cloneCSS.length; j < k; j++) {
                if(cloneCSS[j].split('||')[0].match(/(::?(before|after))/)) {
                  var cSel = '#' + sBox.id + RegExp.$1;
                  var cText = (cloneCSS[j].split('||')[1].replace(/;$/, '') + ';').replace(/background(\-[a-z]+?)?\s*:\s*.+?;/ig, '').replace(/color\s*:\s*.+?;/i, '');
                  cText.match(/border/i) && (cText += 'border-color : transparent !important; border-image : none !important;');
                  cText.match(/content\s*:\s*url\(/i) && (cText += 'visibility : hidden !important;');
                  sheet.addCSS(cSel, cText);
                }
              }
            }
            if(!eObj && tObj.elm.getAttribute('data-dynpseudo') != null) {
              var dAttr = tObj.elm.getAttribute('data-dynpseudo');
              if(dAttr.match(/(\|;\|default.+)$/)) {
                dAttr = dAttr.replace(RegExp.$1, '');
              }
              dAttr += ('|;|' + escape('default' + '||' + convUnitToPx(tObj.shadow[i].x, tObj.elm) + 'px ' + convUnitToPx(tObj.shadow[i].y, tObj.elm) + 'px ' + pxRad + 'px ' + (tObj.shadow[i].cProf != null && tObj.shadow[i].cProf.match(/rgba/) ? tObj.shadow[i].cProf : sColor)));
              tObj.elm.setAttribute('data-dynpseudo', dAttr);
            }
            tObj.elm.appendChild(sBox);
            setShadowNodeColor(document.getElementById(sBox.id));
          }
        }
      }
    }
  };
  var getTargetObj = function(sObj) {
    var arr = document.querySelectorAll(sObj.sel);
    if(arr.length > 0) {
      for(var i = 0, l = arr.length; i < l; i++) {
        if(!arr[i].getAttribute('data-pseudo') || (arr[i].getAttribute('data-pseudo') && !unescape(arr[i].getAttribute('data-pseudo')).match(/::?first\-(letter|line)/))) {
          sObj.elm = arr[i];
          setShadow(sObj);
        }
      }
    }
  };
  var getShadowValue = function(shadow) {
    if(shadow.match(/none/)) {
      return 'none';
    }
    else {
      for(var val = [], arr = shadow.match(/((rgba?\(\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*(,\s*[01]?[\.0-9]*\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)\s)?(\-?[0-9\.]+(em|ex|px|cm|mm|in|pt|pc)?\s*){2,3}(rgba?\(\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*(,\s*[01]?[\.0-9]*\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)?/g), i = 0, l = arr.length; i < l; i++) {
        val[i] = { x : '0', y : '0', z : '0', cProf : null };
        var uArr = arr[i].match(/\-?[0-9\.]+(em|ex|px|cm|mm|in|pt|pc)?\s+\-?[0-9\.]+(em|ex|px|cm|mm|in|pt|pc)?(\s+[0-9\.]+(em|ex|px|cm|mm|in|pt|pc)?)?/);
        if(uArr = uArr[0].split(/\s+/), uArr[0].match(/^(\-?[0-9\.]+(em|ex|px|cm|mm|in|pt|pc)?)$/) && uArr[1].match(/^(\-?[0-9\.]+(em|ex|px|cm|mm|in|pt|pc)?)$/)) {
          uArr.length >= 2 && (val[i].x = uArr[0], val[i].y = uArr[1]);
          uArr.length == 3 && uArr[2].match(/^([0-9\.]+(em|ex|px|cm|mm|in|pt|pc)?)$/) && (val[i].z = uArr[2]);
          arr[i].match(/%/) && (arr[i] = convPercentTo256(arr[i]));
          arr[i].match(/^(rgba?\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*(,\s*[01]?[\.0-9]*\s*)?\)|[a-zA-Z]+)/) ? (val[i].cProf = RegExp.$1) :
          arr[i].match(/\s(rgba?\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*(,\s*[01]?[\.0-9]*\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)$/) && (val[i].cProf = RegExp.$1);
        }
        else {
          val = 'invalid';
          break;
        }
      }
      return val;
    }
  };
  var setDataAttr = function(obj, dataAttr, objReg) {
    var setDynAttr = function(obj, attr) {
      var tAttr = obj.getAttribute(attr) ? obj.getAttribute(attr).replace(/;$/, '') + ';triggerDynPseudoShadow(event, this);' : 'triggerDynPseudoShadow(event, this);';
      tAttr && obj.setAttribute(attr, removeDupFunc(tAttr));
    };
    for(var arr = obj.sel.split(','), i = 0, l = arr.length; i < l; i++) {
      arr[i] = arr[i].replace(/^\s+/, '').replace(/\s+$/, '');
      if(arr[i].match(objReg)) {
        for(var qArr = document.querySelectorAll(arr[i].replace(RegExp.$1, '')), j = 0, k = qArr.length; j < k; j++) {
          var dAttr = qArr[j].getAttribute(dataAttr) || '';
          dAttr != '' && dAttr.match(/(\|;\|default.+)$/) && (dAttr = dAttr.replace(RegExp.$1, ''));
          dAttr = dAttr != '' ? dAttr + '|;|' + escape(arr[i] + '||' + obj.cText) : escape(arr[i] + '||' + obj.cText);
          if(unescape(dAttr).match(/:(focus|hover|active)/)) {
            qArr[j].id == '' && (qArr[j].id = 'dynId' + gId, gId++);
            dAttr += ('|;|' + escape('default||none'));
            unescape(dAttr).match(/:focus/) && (setDynAttr(qArr[j], 'onfocus'), setDynAttr(qArr[j], 'onblur'));
            unescape(dAttr).match(/:hover/) && (setDynAttr(qArr[j], 'onmouseover'), setDynAttr(qArr[j], 'onmouseout'));
            unescape(dAttr).match(/:active/) && (setDynAttr(qArr[j], 'onmousedown'), setDynAttr(qArr[j], 'onmouseup'), setDynAttr(qArr[j], 'onkeydown'), setDynAttr(qArr[j], 'onkeyup'));
          }
          qArr[j].setAttribute(dataAttr, dAttr);
        }
      }
    }
  };
  var cascadeSel = function(arr) {
    for(var sArr = [], bool, i = 0, l = arr.length; i < l; i++) {
      bool = true;
      for(var j = i; j < l; j++) {
        i != j && arr[i].sel == arr[j].sel && !arr[i].shadow.match(/important/) && (bool = false);
      }
      bool && (sArr[sArr.length] = arr[i]);
    }
    return sArr;
  };
  var filterEnabled = function() {
    try {
      if(document.documentElement.filters) {
        var elm, bool, dId = cNum(), dBox = document.createElement('div'), dBody = document.getElementsByTagName('body')[0];
        dBox.id = 'dummyDiv' + dId;  dId++;
        dBox.style.width = 0;
        dBox.style.height = 0;
        dBox.style.visibility = 'hidden';
        dBox.style.filter = 'progid:DXImageTransform.Microsoft.Blur()';
        dBody.appendChild(dBox);
        elm = document.getElementById(dBox.id);
        try {
          bool = elm.filters.item('DXImageTransform.Microsoft.Blur').Enabled;
        }
        catch(e) {
          bool = false;
        }
        dBody.removeChild(elm);
        return bool;
      }
      else {
        return false;
      }
    }
    catch(e) {
      return false;
    }
  };
  if(filterEnabled()) {
    var pArr = [], pseudoReg = /(::?(before|after|first\-(letter|line)))/, dArr = [], dynPseudoReg = /((:(focus|hover|active))+)/, arr = cascadeSel(ieShadowSettings()), gId = cNum();
    for(var i = 0, l = pArr.length; i < l; i++) {
      setDataAttr(pArr[i], 'data-pseudo', pseudoReg);
    }
    for(var i = 0, l = dArr.length; i < l; i++) {
      setDataAttr(dArr[i], 'data-dynpseudo', dynPseudoReg);
    }
    if(!eObj) {
      var style = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(style);
      var sheet = style.sheet || style.styleSheet;
      sheet.addCSS = function(sel, cText) {
        if(cText.match(/text\-shadow\s*:\s*((.+?)+?(!\s*important)?);/)) {
          var cProf = RegExp.$1;
          cProf = cProf.match(/^(rgba?\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*(,\s*[01]?[\.0-9]*\s*)?\)|[a-zA-Z]+)/) ? RegExp.$1 : (cProf.match(/\s(rgba?\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*(,\s*[01]?[\.0-9]*\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)$/) && RegExp.$1);
          cProf.match(/^(rgba?\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*(,\s*[01]?[\.0-9]*\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)(\s*!\s!important)?$/) && (cText += 'color : ' + cProf + ';');
        }
        sel.match(pseudoReg) && sheet.insertRule ? sheet.insertRule(sel + '{' + cText + '}', sheet.cssRules.length) : sheet.addRule && sheet.addRule(sel, cText, sheet.rules.length);
      };
    }
    for(var sId = cNum(), i = 0, l = arr.length; i < l; i++) {
      for(var sSel = arr[i].sel.split(/,/), sReg = /^\s*([a-zA-Z0-9#\.:_\-\s>\+~]+)\s*$/, j = 0, k = sSel.length; j < k; j++) {
        sSel[j].match(sReg) && (sSel[j] = RegExp.$1);
        var sObj = { sel : sSel[j], shadow : getShadowValue(arr[i].shadow), hasImp : arr[i].shadow.match(/\s*\!\s*important/) ? true : false };
        getTargetObj(sObj);
      }
    }
  }
}

function triggerDynPseudoShadow(evt, obj) {
  if(isMSIE) {
    for(var evt = (evt || window.event), x = evt.clientX, y = evt.clientY, cRect = obj.getBoundingClientRect(), isHover = (cRect.left <= x && cRect.right >= x && cRect.top <= y && cRect.bottom >= y), isActive = (obj == document.activeElement), hasImp = false, dynCSS = [], dynAttr = unescape(obj.getAttribute('data-dynpseudo')).split('|;|'), i = 0, l = dynAttr.length; i < l; i++) {
      if(dynAttr[i].split('||')[0].match(/(((:(focus|hover|active))+)|default)/)) {
        dynCSS[dynCSS.length] = { dyn : RegExp.$1.replace(/^:/, '').split(':').sort().join('_'), shadow : dynAttr[i].split('||')[1] };
        RegExp.$1 == 'default' && dynAttr[i].match(/important/) && (hasImp = true);
      }
    }
    var fireTrigger = function(arr) {
      for(var bool = false, i = 0, l = arr.length; i < l; i++) {
        for(var j = 0, k = dynCSS.length; j < k; j++) {
          if(arr[i] == dynCSS[j].dyn) {
            textShadowForMSIE({ sel : '#' + obj.id, shadow : dynCSS[j].shadow});
            bool = true;
            break;
          }
        }
        if(bool) {
          break;
        }
      }
    };
    if(!hasImp) {
      evt.type == 'mouseover' && (isActive ? fireTrigger(['focus_hover', 'hover']) : fireTrigger(['hover']));
      evt.type == 'mouseout' && (isActive ? fireTrigger(['focus', 'default']) : fireTrigger(['default']));
      evt.type == 'mousedown' && (isActive ? fireTrigger(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus']) : fireTrigger(['active_hover', 'active', 'hover']));
      evt.type == 'mouseup' && (isHover ? fireTrigger(['focus_hover', 'hover', 'focus']) : fireTrigger(['focus']));
      evt.type == 'keydown' && (isHover ? fireTrigger(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus']) : fireTrigger(['active_focus', 'active', 'focus']));
      evt.type == 'keyup' && (isHover ? fireTrigger(['focus_hover', 'hover', 'focus']) : fireTrigger(['focus']));
      evt.type == 'focus' && (isHover ? fireTrigger(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus']) : fireTrigger(['focus']));
      evt.type == 'blur' && fireTrigger(['default']);
    }
  }
}

function addEvent(obj, type, listener) {
  type == 'DOMContentLoaded' ? obj.addEventListener ? obj.addEventListener(type, listener, false) :
  window.attachEvent ? function() {
    /*
    *  doScroll polyfill originally devised by Diego Perini.
    *  IEContentLoaded - An alternative for DOMContenloaded on Internet Explorer
    *  http://javascript.nwbox.com/IEContentLoaded/
    *  Author: Diego Perini (diego.perini at gmail.com) NWBOX S.r.l.
    *  License: GPL
    *  Copyright (C) 2007 Diego Perini & NWBOX S.r.l.
    *  http://javascript.nwbox.com/IEContentLoaded/GNU_GPL.txt
    */
    try {
      document.documentElement.doScroll('left');
    }
    catch(e) {
      setTimeout(arguments.callee, 1);
      return;
    }
    /*  end doScroll polyfill  */
    listener.call(obj, window.event);
  }() :
  window.onload = function(e) { listener.call(window, e || window.event) } :
  obj.addEventListener ? obj.addEventListener(type, listener, false) :
  obj.attachEvent ? obj.attachEvent('on' + type, function() { listener.call(obj, window.event) }) :
  obj['on' + type] = function(e) { listener.call(obj, e || window.event) };
}

/*  quasi querySelectorAll for MSIE7  */
(function() {
  document.querySelectorAll = document.querySelectorAll || (function() {
    var cNum = (function(n) { return function() { return n++; }})(0);
    return function(sel) {
      var distinctSelector = function(obj) {
        var i, l, xObj = { elm : '*', id : [], eClass : [], pseudo : [], attr : [], rDom : [] };
        obj = obj.match(/(([a-zA-Z\*]{1}[a-zA-Z0-9]*)|(#[a-zA-Z_]{1}[a-zA-Z0-9_\-]*)|(\.[a-zA-Z_]{1}[a-zA-Z0-9_\-]*)|(::?([a-z]{1}[a-z0-9\(\)\-]*))|(\[[a-zA-Z]{2,}.+?\]){1,})+/g);
        obj[obj.length - 1].match(/^([a-zA-Z\*]{1}[a-zA-Z0-9]*)/) && (xObj.elm = RegExp.$1);
        obj[obj.length - 1].match(/#[a-zA-Z_]{1}[a-zA-Z0-9_\-]*/) && (xObj.id = obj[obj.length - 1].match(/#[a-zA-Z_]{1}[a-zA-Z0-9_\-]*/g));
        for(i = 0, l = xObj.id.length; i < l; i++) {
          xObj.id[i] = xObj.id[i].replace(/#/, '');
        }
        obj[obj.length - 1].match(/\.[a-zA-Z_]{1}[a-zA-Z0-9_\-]*/) && (xObj.eClass = obj[obj.length - 1].match(/\.[a-zA-Z_]{1}[a-zA-Z0-9_\-]*/g));
        for(i = 0, l = xObj.eClass.length; i < l; i++) {
          xObj.eClass[i] = xObj.eClass[i].replace(/\./, '');
        }
        obj[obj.length - 1].match(/::?[a-z]{1}[a-z0-9\(\)\-]*/) && (xObj.pseudo = obj[obj.length - 1].match(/::?[a-z]{1}[a-z0-9\(\)\-]*/g));
        for(i = 0, l = xObj.pseudo.length; i < l; i++) {
          xObj.pseudo[i] = xObj.pseudo[i].replace(/::?/, '');
        }
        obj[obj.length - 1].match(/\[([a-zA-Z]{2,}.+)\]/) && (xObj.attr = xObj.attr.concat(RegExp.$1.split('][')));
        for(i = 0, l = xObj.attr.length; i < l; i++) {
          xObj.attr[i] = xObj.attr[i].replace(/^\[|\]$/g, '');
        }
        if(xObj.id.length == 0) {
          for(var arr = document.getElementsByTagName(xObj.elm), i = 0, l = arr.length; i < l; i++) {
            if(xObj.eClass.length > 0) {
              for(var bool, j = 0, k = xObj.eClass.length; j < k; j++) {
                bool = false;
                if(arr[i].className != null) {
                  arr[i].className.match(xObj.eClass[j]) && (bool = true);
                }
                if(bool == false) { break; }
              }
              bool && (xObj.id[xObj.id.length] = arr[i].id);
            }
            else {
              xObj.id[xObj.id.length] = arr[i].id;
            }
          }
        }
        if(obj.length > 1) {
          for(i = 0, l = obj.length - 1; i < l; i++) {
            sel.match(RegExp(obj[i] + '(.+?)' + obj[i + 1])) && (xObj.rDom[xObj.rDom.length] = { elm : obj[i], type : RegExp.$1 == ' ' ? 'descend' : RegExp.$1.match(/\>/) ? 'child' : RegExp.$1.match(/\+/) ? 'adjacent' : RegExp.$1.match(/\~/) ? 'general' : null });
          }
        }
        return xObj;
      };
      var getObj = function(xObj) {
        var compareObj = function(elm, rElm, type) {
          var getPrevSibling = function(pElm) {
            return pElm.nodeType == 1 ? pElm : (pElm = pElm.previousSibling, pElm != null ? getPrevSibling(pElm) : null);
          };
          var getGeneralObj = function(pElm) {
            var arr = [];
            for((pElm = pElm.previousSibling) && pElm.nodeType == 1 && (arr[arr.length] = pElm); pElm != null;) {
              (pElm = pElm.previousSibling) && pElm.nodeType == 1 && (arr[arr.length] = pElm);
            }
            return arr;
          };
          var getAncestObj = function(pElm) {
            var arr = [];
            if(pElm = pElm.parentNode) {
              for(arr[arr.length] = pElm; pElm.nodeName.toLowerCase() != "body";) {
                (pElm = pElm.parentNode) && (arr[arr.length] = pElm);
              }
            }
            return arr;
          };
          var bool = false;
          if(type == 'child' || type == 'descend') {
            var pElm = elm.parentNode;
            if(rElm.id == pElm.id) {
              bool = true;
            }
            else if(type == 'descend') {
              for(var arr = getAncestObj(elm.parentNode), i = 0, l = arr.length; i < l; i++) {
                if(rElm.id == arr[i].id) {
                  bool = true; break;
                }
              }
            }
          }
          else if(type == 'adjacent' || type == 'general') {
            if(elm.previousSibling != null) {
              var pElm = getPrevSibling(elm.previousSibling);
              if(rElm.id == pElm.id) {
                bool = true;
              }
              else if(type == 'general' && pElm.previousSibling != null) {
                for(var arr = getGeneralObj(pElm), i = 0, l = arr.length; i < l; i++) {
                  if(rElm.id == arr[i].id) {
                    bool = true; break;
                  }
                }
              }
            }
          }
          return bool;
        };
        var checkPseudo = function(elm, pArr, rElm) {
          var bool = false;
          if(pArr.length == 0) {
            bool = true;
          }
          else {
            for(var i = 0, l = pArr.length; i < l; i++) {
              if(!rElm) {
                if(elm.tagName.toLowerCase() == 'a' && pArr[i] == 'link') {
                  bool = true; break;
                }
              }
              else if(rElm && rElm.childNodes) {
                if(pArr[i] == 'first-child' && rElm.childNodes[0] == elm) {
                  bool = true; break;
                }
              }
            }
          }
          return bool;
        };
        var checkAttr = function(elm, aArr) {
          var bool = true;
          if(aArr.length > 0) {
            for(var aReg = /^([a-zA-Z]+|data\-.+)([\~\|\^\$\*]?=?)["']?([a-zA-Z0-9_\-]+)["']?$/, arr = [], i = 0, l = aArr.length; i < l; i++) {
              var obj = { attr : '', type : null, val : '' };
              aArr[i].match(aReg) && (RegExp.$1 && (obj.attr = RegExp.$1), RegExp.$2 == '' && RegExp.$3 && (obj.attr = RegExp.$1 + RegExp.$3), RegExp.$2 != '' && RegExp.$3 && (obj.type = RegExp.$2, obj.val = RegExp.$3));
              if(elm.getAttributeNode(obj.attr)) {
                bool = false;
                if(elm.getAttributeNode(obj.attr).nodeValue != (null || '')) {
                  if(obj.type == null && obj.val == '') {
                    bool = true;
                  }
                  else {
                    for(var attArr = elm.getAttributeNode(obj.attr).nodeValue.split(' '), j = 0, k = attArr.length; j < k; j++) {
                      if((obj.type == '=' || obj.type == '|=') && obj.val == attArr[j]) {
                        bool = true; break;
                      }
                      else if(obj.type == '~=' && obj.val == attArr[j]) {
                        bool = true; break;
                      }
                      else if(obj.type == '|=' && attArr[j].match('^' + obj.val + '\-')) {
                        bool = true; break;
                      }
                      else if(obj.type == '^=' && attArr[j].match('^' + obj.val)) {
                        bool = true; break;
                      }
                      else if(obj.type == '$=' && attArr[j].match(obj.val + '$')) {
                        bool = true; break;
                      }
                      else if(obj.type == '*=' && attArr[j].match(obj.val)) {
                        bool = true; break;
                      }
                      else {
                        bool = false;
                      }
                    }
                  }
                }
                if(bool == false) { break; }
              }
              else {
                bool = false; break;
              }
            }
          }
          return bool;
        };
        var arr = [];
        if(xObj.id.length > 0) {
          for(var i = 0, l = xObj.id.length; i < l; i++) {
            var elm = document.getElementById(xObj.id[i]);
            if(elm) {
              if(xObj.rDom.length == 0) {
                checkPseudo(elm, xObj.pseudo, false) && checkAttr(elm, xObj.attr) && (arr[arr.length] = elm);
              }
              else if(xObj.rDom.length == 1) {
                var rObj = distinctSelector(xObj.rDom[0].elm);
                if(rObj.id.length > 0) {
                  for(var type = xObj.rDom[0].type, j = 0, k = rObj.id.length; j < k; j++) {
                    var rElm = document.getElementById(rObj.id[j]);
                    rElm && compareObj(elm, rElm, type) && checkPseudo(elm, xObj.pseudo, rElm) && checkAttr(elm, xObj.attr) && (arr[arr.length] = elm);
                  }
                }
              }
              else if(xObj.rDom.length > 1) {
                for(var j = 0, k = xObj.rDom.length - 1; j < k; j++) {
                  var rObj = distinctSelector(xObj.rDom[j + 1].elm);
                  if(rObj.id.length > 0) {
                    rObj = getObj({ elm : rObj.elm, id : rObj.id, eClass : rObj.eClass, pseudo : rObj.pseudo, attr : rObj.attr, rDom : [{ elm : xObj.rDom[j].elm, type : xObj.rDom[j].type }] });
                    var rType = xObj.rDom[j + 1].type;
                    if(rType) {
                      for(var m = 0, n = rObj.length; m < n; m++) {
                        (j == k - 1) && compareObj(elm, rObj[m], rType) && checkPseudo(elm, xObj.pseudo, rObj[m]) && checkAttr(elm, xObj.attr) && (arr[arr.length] = elm);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return arr;
      };
      var qArr = [];
      try {
        for(var aTag = document.getElementsByTagName('*'), oId = cNum(), i = 0, l = aTag.length; i < l; i++) {
          aTag[i].id == '' && (aTag[i].id = 'tmpId' + oId, oId++);
        }
        qArr = qArr.concat(getObj(distinctSelector(sel)));
        for(i = 0, l = aTag.length; i < l; i++) {
          aTag[i].id.match(/tmpId[0-9]+/) && (aTag[i].id = '');
        }
      }
      catch(e) {
      }
      return qArr;
    };
  })();
  document.querySelector = document.querySelector || (function() {
    return function(sel) {
      return document.querySelectorAll(sel).length > 0 ? document.querySelectorAll(sel)[0] : null;
    }
  })();
})();

addEvent(document, 'DOMContentLoaded', function() {
//addEvent(window, 'load', function() {
  ieVersion >= 7 && ieVersion <= 9 && textShadowForMSIE();
});

/*  Sample to change shadow(s) at interactive events (eg: onclick)  */
addEvent(window, 'load', function() {
  var eObj = { sel : '#someId', shadow : 'green 2px 2px 2px !important' /* new shadow here */ };
  var elm = document.getElementById(eObj.sel.replace('#', ''));
  elm && addEvent(elm, 'click', function() {
    if(ieVersion >= 7 && ieVersion <= 9) {
      textShadowForMSIE(eObj);
    }
    else if(ieVersion > 9 || !isMSIE) {
      eObj.shadow.match(/(\s*\!\s*important)/) ?
      elm.style.setProperty('text-shadow', eObj.shadow.replace(RegExp.$1, ''), 'important') :
      elm.style.setProperty('text-shadow', eObj.shadow, '');
    }
  });
});
