// ==UserScript==
// @name         F1 allsportsmedia fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       JStoni
// @match        http://allsportsmedia.live/novo/*
// @match        http://thecyclingentertainment.com/novo/*
// @grant        none
// ==/UserScript==
// old site http://allsportsmedia.live/novo/events/dutch-gp/

(function() {
    'use strict';

    // remove right side panel
    document.querySelector("#content > div.row > aside#secondary").remove();

    // make player bigger (100%)
    var element = document.querySelector("#content > div.row > div#primary");
    element.style.width = "100%";
    element.style.padding= "0";
    document.querySelector("#post-35 > div > div").style.padding = "0";
    document.querySelector("#content").style.width = "calc(100% - 20px)";

    // if player not started, click
    setTimeout(function() {
        //alert('starting..');
        if(!player.isPlaying()){
            player.play();
            //alert('trying..');
            var text = document.querySelector("#post-35 > header > h1");
            text.innerHTML = text.innerHTML + " - manuell started stream";
            //document.querySelector("#player > div > div.container > div.player-poster.clickable").click();
            //setTimeout(function(){
                //document.querySelector("#player > div > div.container.pointer-enabled").click();
                //console.log('starting..');
                //alert('done..');
            //}, 500);
        }
        //alert('done..');
        //document.querySelector("#player > div > div.container.pointer-enabled").click();
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
        // on F toogle fullscreen
        if(e.which == 70){
            document.querySelector("#player > div > div.media-control.live.media-control-hide > div.media-control-layer > div.media-control-right-panel > button:nth-child(1)").click();
        }
    };
})();
