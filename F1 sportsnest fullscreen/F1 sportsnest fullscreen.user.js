// ==UserScript==
// @name         F1 sportsnest fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       JStoni
// @match        http://sportsnest.co/000-formula1/
// @grant        none
// ==/UserScript==

// some recomendations:
// use Dark Reader

(function() {
    'use strict';

    // remove right side panel
    document.querySelector("#content > div > #secondary").remove();

    // make player bigger (100%)
    document.querySelector("#content > div").style.width = "99%";
    document.querySelector("#content > div > #primary").style.width = "100%";

    // remove ad on player
    document.querySelector("#ad").remove();

    // start the player
    setTimeout(function() {
        if(!player.isPlaying()){
            player.play();
            var text = document.querySelector("#post-156 > header > h1");
            text.innerHTML = text.innerHTML + " - manuell started stream ";
        }
    }, 500);

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
        if(e.which == 70){
            document.querySelector("#player > div > div.media-control.live.media-control-hide > div.media-control-layer > div.media-control-right-panel > button:nth-child(1)").click();
        }
    };
})();