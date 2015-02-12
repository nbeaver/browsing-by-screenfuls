// ==UserScript==
// @name        Bottomless Browsing
// @namespace   http://userscripts.org
// @description Pad the bottom of the page with tildes if it is longer than one page to allow seamlessly paging down, much the way the vi editor does. Plays well with AutoPager.
// @include     *
// @version     1.1
// ==/UserScript==

// TODO: remove the stuff that is IE-specific,
// since Greasemonkey only works on Chrome and Firefox anyway.

// Check for the existence of the body before trying to append anything to it.
if (typeof document.body !== 'undefined') {
  createEmptyPaddingDiv()

  // Global variable to limit the number of times that padding is added to the end of the page.
  var MaximumPadding = 2;

  // Check if we need to add space every time the user scrolls.
  window.addEventListener("scroll", ScrollingDetected, false);
  // https://stackoverflow.com/questions/2991382/how-do-i-add-and-remove-an-event-listener-using-a-function-with-parameters
  
  // Default to padding if the page is longer than one screenful,
  // since we won't have a chance to catch the PgDn event in time
  // if the page is between 1 and 2 screenfuls long.
  if (pixelsBelow() < pixelsPerPgDn() && getDocHeight() > pixelsPerPgDn()) {
    addPadding()
  }
}

function ScrollingDetected() {
  // Check if the number of remaining pixels are less than the next PgDn would use.
  // If so, we need to add some padding to the page.
  if (pixelsBelow() < pixelsPerPgDn() && MaximumPadding > 0) {
    // Decrement the scroll limit so we don't keep on adding more and more space ad infinitem.
    addPadding()
    MaximumPadding--;
  }
}

// Creates the div that will hold the extra padding at the end of the page.
function createEmptyPaddingDiv() {
  var newDiv = document.createElement("div");
  newDiv.setAttribute("id", "pagePadder");
  
  // Remove the style so that the div actually goes at the bottom of the page
  // instead of floating alongside everything else.
  newDiv.setAttribute("style", "clear: both");
  document.body.appendChild(newDiv);
  // https://stackoverflow.com/questions/7759837/put-divs-below-floatleft-divs
}

function addPadding() {
    // Append ten lines of tildes.
    padding = Array(linesPerPgDn()).join("~<br>");
    pagePadderDiv = document.getElementById('pagePadder');
    pagePadderDiv.innerHTML += padding;
}

function documentScrollTop() {
  if (document.documentElement.scrollTop + document.body.scrollTop == document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
  }
  else {
    return document.body.scrollTop;
  }
}
// http://code.google.com/p/chromium/issues/detail?id=2891

function getScrollTop(){
    if (typeof pageYOffset !== 'undefined') {
        //most browsers
        return pageYOffset;
    }
    else {
        var B = document.body; //IE 'quirks'
        var D = document.documentElement; //IE with doctype
        D = (D.clientHeight)? D: B;
        return D.scrollTop;
    }
}
//http://stackoverflow.com/questions/871399/cross-browser-method-for-detecting-the-scrolltop-of-the-browser-window

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
// http://stackoverflow.com/questions/1766861/find-the-exact-height-and-width-of-the-viewport-in-a-cross-browser-way-no-proto

function documentHeight() {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
}

function pixelsBelow() {
  // remaining pixels = 
  //     total height     - height above viewport - height of viewport
  return documentHeight() - pageYOffset           - window.innerHeight;
}

function pixelsPerPgDn() {
  return window.innerHeight;
}

function linesPerPgDn() {
  pagePadderDiv = document.getElementById('pagePadder');
  //var CSSlineHeight = pagePadderDiv.style.lineHeight;
  if ( approxLineHeight(pagePadderDiv) > 10 && !isNaN(approxLineHeight(pagePadderDiv)) ) {
    return Math.ceil(pixelsPerPgDn() / approxLineHeight(pagePadderDiv));
  }
  else {
    //estimate at least 10 lines per page down
    return 10;
  }
}

function approxLineHeight(element){
   var temp = document.createElement(element.nodeName);
   temp.setAttribute("style","margin:0px;padding:0px;font-family:"+element.style.fontFamily+";font-size:"+element.style.fontSize);
   temp.innerHTML = "test";
   temp = element.parentNode.appendChild(temp);
   var ret = temp.clientHeight;
   temp.parentNode.removeChild(temp);
   return ret;
}
// http://stackoverflow.com/questions/4392868/javascript-find-divs-line-height-not-css-property-but-actual-line-height
