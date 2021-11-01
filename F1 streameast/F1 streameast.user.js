// ==UserScript==
// @name         F1 streameast
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.streameast.live/f1/*
// @match        https://www.streameast.io/*
// @icon         https://www.google.com/s2/favicons?domain=streameast.live
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // remove right side panel
    document.querySelector("body > div:nth-child(1) > div > main > div.f1-race-hub--latest.f1-color--white > div > div > div.col-lg-3.curated-space.first-child").remove();

    // make player bigger (100%)
    var element = document.querySelector("body > div:nth-child(1) > div > main > div.f1-race-hub--latest.f1-color--white > div > div > div");
    element.style.maxWidth = "100%";
    element.style.flex= "0 0 100%";

    // theader moed
    document.querySelector("#PlayerDuzenBolumu").style.width="100%";
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.moveTheaterButton { right: 0 !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    document.querySelector("#TiyatroModu").className += "moveTheaterButton";

    // if player not started, click
    setTimeout(function() {
        if(!player.isPlaying()){
            player.play();
            var text = document.querySelector("body > div.site-wrapper > main > div.f1-race-hub--latest.f1-color--white > div > div > div > fieldset > legend > h2");
            text.innerHTML = text.innerHTML + " - manuell started stream";
        }
    }, 500);

//     var playerHeight = document.createElement('style');
//     playerHeight.type = 'text/css';
//     playerHeight.innerHTML = '.playerHeight { height: 710px !important; }';
//     document.getElementsByTagName('head')[0].appendChild(playerHeight);
//     document.querySelector("#VideoFrame").children[0].children[0].className += "playerHeight";
    document.querySelector("#VideoFrame").children[0].children[0].style.height = "710px";

    document.onkeyup = function(e) {
        // when pressing key M mute the plaýer
        if (e.which == 77) {
            if(player.getVolume() != 0){
                player.mute();
            } else {
                player.unmute();
            }
            //document.querySelector("#player > div > div.media-control.live.media-control-hide > div.media-control-layer > div.media-control-right-panel > div.drawer-container > div.drawer-icon-container > div").click();
        }
        // on F toogle fullscreen
        if(e.which == 70){
            document.querySelector("#VideoFrame > div > div > div.media-control.live.media-control-hide > div.media-control-layer > div.media-control-right-panel > button:nth-child(1)").click();
        }
    };
})();