

//http://code.google.com/p/chromium/issues/detail?id=2891
function documentScrollTop() {
  return (document.documentElement.scrollTop + document.body.scrollTop
  == document.documentElement.scrollTop) ?
  document.documentElement.scrollTop : document.body.scrollTop;
}
//http://stackoverflow.com/questions/871399/cross-browser-method-for-detecting-the-scrolltop-of-the-browser-window
function getScrollTop(){
    if(typeof pageYOffset!= 'undefined'){
        //most browsers
        return pageYOffset;
    }
    else{
        var B= document.body; //IE 'quirks'
        var D= document.documentElement; //IE with doctype
        D= (D.clientHeight)? D: B;
        return D.scrollTop;
    }
}
//http://stackoverflow.com/questions/1766861/find-the-exact-height-and-width-of-the-viewport-in-a-cross-browser-way-no-proto
function getViewportHeight() {
  var viewPortHeight;
  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  if (typeof window.innerHeight != 'undefined') {
    viewPortHeight = window.innerHeight;
  }
  // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
  else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientHeight!= 'undefined' 
        && document.documentElement.clientHeight!= 0) {
    viewPortHeight = document.documentElement.clientHeight;
  }
  else {
  // older versions of IE
    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
  }
  return viewPortHeight;
}
function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function pixelsBelow() {
  return getDocHeight() - getScrollTop() - getViewportHeight();//total height - height above viewport - height of viewport
}

function pixelsPerPgDn() {
  return Math.max(window.innerHeight,document.documentElement.clientHeight);//total height - height above viewport - height of viewport
}

function linesPerPgDn() {
  pagePadderDiv = document.getElementById('pagePadder');
  //var CSSlineHeight = pagePadderDiv.style.lineHeight;
  if (getLineHeight(pagePadderDiv) > 10) {
    return Math.ceil(pixelsPerPgDn() / getLineHeight(pagePadderDiv));
  }
  else { //estimate at least 10 lines per page down
    //alert("Line height oddly low, should be higher than 10:"+getLineHeight(pagePadderDiv));
    return 10;
  }
}

//http://stackoverflow.com/questions/4392868/javascript-find-divs-line-height-not-css-property-but-actual-line-height
function getLineHeight(element){
   var temp = document.createElement(element.nodeName);
   temp.setAttribute("style","margin:0px;padding:0px;font-family:"+element.style.fontFamily+";font-size:"+element.style.fontSize);
   temp.innerHTML = "test";
   temp = element.parentNode.appendChild(temp);
   var ret = temp.clientHeight;
   temp.parentNode.removeChild(temp);
   return ret;
}

function windowVals() {
  var windowVars = new Array();
  windowVars['pixelsBelow'] = pixelsBelow();
  windowVars['pixelsPerPgDn'] = pixelsPerPgDn();
  windowVars['getDocHeight'] = getDocHeight();
  windowVars['scrollHeight - clientHeight'] = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  windowVars['innerHeight'] = window.innerHeight;
  windowVars['clientHeight'] = document.documentElement.clientHeight;
  windowVars['scrollMaxY'] = window.scrollMaxY;
  windowVars['scrollHeight'] = document.documentElement.scrollHeight;
  windowVars['offsetHeight'] = document.documentElement.offsetHeight;
  windowVars['scrollTop'] = document.documentElement.scrollTop;
  windowVars['documentScrollTop()'] = documentScrollTop();
  windowVars['linesPerPgDn()'] = linesPerPgDn();
  windowVars['pixelsBelow() < pixelsPerPgDn()'] = pixelsBelow() < pixelsPerPgDn();
  windowVars['getDocHeight() > pixelsPerPgDn()'] = getDocHeight() > pixelsPerPgDn();
  varString = '';
  for (var myvar in windowVars)
    varString += myvar + "=" + windowVars[myvar] + "\n";
  return varString;
}

alert(windowVals());
