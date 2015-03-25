// ==UserScript==
// @name        Bottomless Browsing
// @namespace   http://userscripts.org
// @description Pad the bottom of the page to allow seamlessly paging down, much the way the vi editor does. Plays well with AutoPager.
// @include http://*
// @include https://*
// @include file://*
// @exclude chrome://*
// @exclude https://mail.google.com/*
// @exclude https://www.google.com/calendar/*
// @exclude https://play.google.com/*
// @version     1.2
// ==/UserScript==

// Help catch mistakes.
"use strict";

var DEBUG = false;

// Check for the existence of the body before trying to append anything to it.
// Also check to make sure we aren't in an iframe.
// https://developer.mozilla.org/en-US/docs/Web/API/window.frameElement
if (typeof document.body === 'object' && self === top) {
    document.addEventListener("DOMContentLoaded", injectDiv);
    // Global counter to limit the number of times that padding is added to the end of the page.
    var allowedPadding = 1;
    // TODO: can functions be bound to event listeners if they aren't in global scope?
}
else if (typeof document.body === 'object' && self !== top) {
    if (DEBUG) {
        console.log("Error: self !== top");
        if (window.location !== window.parent.location) {
            console.log("This appears to be in an iframe.");
        }
    }
}
else if (typeof document.body !== 'object' && self === top) {
    if (DEBUG) {
        console.log("Error: typeof document.body = " + typeof document.body);
        console.log("Possibly in an XML document or SVG image?");
        if (document.doctype.name) {
            console.log("document.doctype.name = " + document.doctype.name);
        }
    }
}

function injectDiv() {
    // TODO: why is this always the empty string?
    if (document.body.style.position === 'absolute') {
        // Don't both doing anything if the body is positioned absolutely,
        // since we can't reliably add padding to the bottom anyway.
        return;
    }
    createEmptyPaddingDiv();

    padIfNecessary();

    // Every time the user scrolls or resizes the window, check if we need to add space.
    window.addEventListener("scroll", padIfNecessary);
    window.addEventListener("resize", padIfNecessary);
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
    // https://developer.mozilla.org/en-US/docs/Web/Events
}

function padIfNecessary() {
    if ( totalVerticalPixels() <= pixelsPerPgDn() ) {
        if (DEBUG) {
            console.log("Padding not necessary.");
            console.log("totalVerticalPixels() = "+ totalVerticalPixels());
            console.log("pixelsBelow() = "        + pixelsBelow());
            console.log("pixelsPerPgDn() = "      + pixelsPerPgDn());
            console.log("pixelsAbove() = "        + pixelsAbove());
        }
        return;
    } else if (allowedPadding > 0) {
        if (DEBUG) {
            console.log("Padding required.");
            console.log("totalVerticalPixels() = "+ totalVerticalPixels());
            console.log("pixelsBelow() = "        + pixelsBelow());
            console.log("pixelsPerPgDn() = "      + pixelsPerPgDn());
            console.log("pixelsAbove() = "        + pixelsAbove());
        }
        // Append ten lines of tildes.
        var padding = new Array(linesPerPgDn()).join("~<br>");
        var pagePadderDiv = document.getElementById('pagePadder');
        pagePadderDiv.innerHTML += padding;

        // Decrement the scroll limit so we don't keep on adding more and more space ad infinitem.
        allowedPadding--;
        // Check if the padding was enough or if we need to do more.
        padIfNecessary();
        return;
    } else {
        // We don't want to get into an infinite loop,
        // so just give up.
        if (DEBUG) {
            console.log("Warning: Cannot pad page anymore.");
        }
        return;
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
    return newDiv;
    // https://stackoverflow.com/questions/7759837/put-divs-below-floatleft-divs
}

function totalVerticalPixels() {
    if (DEBUG) {
        console.log("document.body.scrollHeight = " + document.body.scrollHeight);
        //console.log("document.body.offsetHeight = " + document.body.offsetHeight);
        //console.log("document.body.clientHeight = " + document.body.clientHeight);
        console.log("document.documentElement.scrollHeight = " + document.documentElement.scrollHeight);
        //console.log("document.documentElement.offsetHeight = " + document.documentElement.offsetHeight);
        //console.log("document.documentElement.clientHeight = " + document.documentElement.clientHeight);
        // http://stackoverflow.com/questions/22675126/what-is-offsetheight-clientheight-scrollheight
    }
    // total number of scrollable pixels.
    return document.body.scrollHeight;
}
// Determined empirically. Could also just take the maximum of them all:
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
    // Keep in mind that this can be negative.
}

function pixelsPerPgDn() {
    // Right now, this is pretty simple to calculate,
    // but we might need to change the definition later.
    return window.innerHeight;
}

function linesPerPgDn() {
    var pagePadderDiv = document.getElementById('pagePadder');
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
