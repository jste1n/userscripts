// ==UserScript==
// @name         mjan bigger image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.mjam.net/en/restaurant/*
// @match        https://www.mjam.net/restaurant/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mjam.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    // var e = jQuery.Event("keydown", {key: "Control"})
    // console.log(e);
    jQuery('body').append('<div id="loaderBg" style="display:none; position: fixed; top: 0; left: 0; z-index: 100; width:100%; height:100%; background-repeat: no-repeat; background-position: center; border: 100px solid rgba(255,255,255, 0);"></div>');
    var keyStopper = false;

    // Your code here...
    document.onkeydown = function(e) {
        if(keyStopper){
            return null;
        }
        keyStopper = true;
        // when pressing key M mute the plaýer
        if (e.key == 'Control') {
            // console.log(e);
            // var x = e.clientX, y = e.clientY;
            // elementMouseIsOver = document.elementFromPoint(x, y);
            var z = document.querySelectorAll( ":hover" );
            z = z[z.length-1];
            // if(z.hasAttribute('data-testid')){
            //     if(z.getAttribute('data-testid') == 'menu-product-button-overlay-id'){
            //         console.log(z.getAttribute('data-testid'));
            //         console.log(z);
            //     }
            // }
            if(z.nodeName == "BUTTON" && z.dataset.testid == "menu-product-button-overlay-id"){
                // console.log(z.nextElementSibling.querySelector('picture').firstChild);
                var imageUrl = z.nextElementSibling.querySelector('picture').firstChild.style.backgroundImage;
                // var indexOfQuestionmark = imageUrl.indexOf("?");
                // console.log(imageUrl.substring(5, indexOfQuestionmark));
                imageUrl = imageUrl.replace(/\?.*"/, '"')
                console.log(imageUrl);
                var dialog = document.querySelector("body > div#loaderBg");
                // console.dir(dialog);

                dialog.style.backgroundImage = imageUrl;
                dialog.style.display = "block";
            }

            // alert(elementMouseIsOver);
            //document.querySelector("#player > div > div.media-control.live.media-control-hide > div.media-control-layer > div.media-control-right-panel > div.drawer-container > div.drawer-icon-container > div").click();
        }
        // on F toogle fullscreen
        // if(e.which == 70){
        //     document.querySelector("#VideoFrame > div > div > div.media-control.live.media-control-hide > div.media-control-layer > div.media-control-right-panel > button:nth-child(1)").click();
        // }
    };

    document.onkeyup = function(e) {
        keyStopper = false;
        var dialog = document.querySelector("body > div#loaderBg");
        dialog.style.display = "none";
    };
})();