// ==UserScript==
// @name        Bottomless Browsing
// @namespace   http://userscripts.org
// @description Pad the bottom of the page with tildes if it is longer than one page to allow seamlessly paging down, much the way the vi editor does. Plays well with AutoPager.
// @include     *
// @version     1.2
// ==/UserScript==

// Check for the existence of the body before trying to append anything to it.
if (typeof document.body == 'object') {
  createEmptyPaddingDiv()

  // Global variable to limit the number of times that padding is added to the end of the page.
  var MaximumPadding = 1;

  // Check if we need to add space every time the user scrolls.
  window.addEventListener("scroll", ScrollingDetected, false);
  // https://stackoverflow.com/questions/2991382/how-do-i-add-and-remove-an-event-listener-using-a-function-with-parameters
  
  // Default to padding if the page is longer than one screenful,
  // since we won't have a chance to catch the PgDn event in time
  // if the page is between 1 and 2 screenfuls long.
  if (totalVerticalPixels() > pixelsPerPgDn()) {
    addPadding()
  }

  // Unfortunately, we can't just automatically pad the page if it is longer than one viewport,
  // because AutoPager and sites with infinite scroll would be broken.
}

function ScrollingDetected() {
  // Check if the number of remaining pixels are less than the next PgDn would use.
  // If so, we need to add some padding to the page.
  if (pixelsBelow() < pixelsPerPgDn() && MaximumPadding > 0) {
    // Decrement the scroll limit so we don't keep on adding more and more space ad infinitem.
    addPadding()
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
    MaximumPadding--;
}

function totalVerticalPixels() {
  // total number of scrollable pixels.
  return document.body.scrollHeight;
}
// http://james.padolsey.com/javascript/get-document-height-cross-browser/

function pixelsAbove() {
  // https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
  return window.pageYOffset || document.documentElement.scrollTop;
}
// https://stackoverflow.com/questions/4106538/difference-between-offsetheight-and-clientheight
// http://code.google.com/p/chromium/issues/detail?id=2891

function pixelsBelow() {
  // remaining pixels =
  //     total height          - height above viewport - height of viewport
  return totalVerticalPixels() - pixelsAbove()         - pixelsPerPgDn();
}

function pixelsPerPgDn() {
  // Right now, this is pretty simple to calculate,
  // but we might need to change the definition later.
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
   // Approximate the number of pixels high a line is.
   var temp = document.createElement(element.nodeName);
   temp.setAttribute("style","margin:0px;padding:0px;font-family:"+element.style.fontFamily+";font-size:"+element.style.fontSize);
   temp.innerHTML = "test";
   temp = element.parentNode.appendChild(temp);
   var ret = temp.clientHeight;
   temp.parentNode.removeChild(temp);
   return ret;
}
// http://stackoverflow.com/questions/4392868/javascript-find-divs-line-height-not-css-property-but-actual-line-height
