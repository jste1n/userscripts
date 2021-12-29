// ==UserScript==
// @name         cinplexx only show OV moviues
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  only shows times that are in OV. removes all other
// @author       JStoni
// @match        https://www.cineplexx.at/film/*
// @icon         https://www.google.com/s2/favicons?domain=cineplexx.at
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        // var el = document.querySelector("#s2id_autogen1 > a > span");
        // console.log('ss',el);
        // el.onchange = function() { console.log("Changed!"); }
        // el.addEventListener('change',function(){
        //     //alert('Handler for .change() called.' + this.value);
        //     console.log('ff');
        //     //document.querySelector('#UserName').value = this.value;
        // });
        // document.querySelector("#s2id_autogen1 > a > span").addEventListener("DOMCharacterDataModified", function (event) { console.log("Changed111"); }, false);
        var stateSelector = document.querySelector("#filmDetailFilter");
        if (stateSelector != null) {
            stateSelector.onchange = () => checkTimes();
        }
    }, 1000);

    function checkTimes() {
        setTimeout(function () {
            // Do something after change.
            // a node per day
            // var startTimesPerDays = document.querySelectorAll("div.row-fluid.separator.time-row");
            // get times without the day info
            // var onlyTimes = startTimesPerDays[0].children[1]
            // document.querySelectorAll("div.row-fluid.separator.time-row")[0].children[1].children[0].children[0].children[0].children[2].innerText
            // [...document.querySelectorAll(" a > p.mode-desc")].filter(e => e.innerText.includes("OV"))

            // remove all non OV times
            [...document.querySelectorAll(" a > p.mode-desc")].filter(e => !e.innerText.includes("OV")).forEach(x => x.parentElement.parentElement.remove());

            // remove all empty days
            [...document.querySelectorAll("div.row-fluid.separator.time-row")].filter(x => x.children[1].innerText == "").forEach(x => x.remove());

            console.log('removed all non OV times');
        }, 150);
    }

})();