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

    var onlyOV = false;
    var timeChildrenOriginal = null;
    var modifiedView = null;

    // change class to span6
    document.querySelector("#root > div.scale-wrapper > div > div.section.content-page.filmDetailPage > div > div:nth-child(8) > div:nth-child(2)").className = "span6";
    // add new div with span6 and in it add button to trigger OV
    var tempDiv = document.createElement('div');
    document.querySelector("#root > div.scale-wrapper > div > div.section.content-page.filmDetailPage > div > div:nth-child(8) > div.span6").insertAdjacentElement('afterend', tempDiv);
    tempDiv.outerHTML = '<div class="span6 whyareyoufuck"><button disabled>toggle OV view</button></div>';

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
            stateSelector.onchange = () => {
                checkTimes();
                var btn = document.querySelector("#root > div.scale-wrapper > div > div.section.content-page.filmDetailPage > div > div:nth-child(8) > div.span6.whyareyoufuck > button");
                btn.disabled = false;
                btn.addEventListener("click", toggleOVView);
            }
        }
    }, 1000);

    function checkTimes() {
        setTimeout(function () {
            document.querySelector("#s2id_autogen2").blur();

            // Do something after change.
            // a node per day
            // var startTimesPerDays = document.querySelectorAll("div.row-fluid.separator.time-row");
            // get times without the day info
            // var onlyTimes = startTimesPerDays[0].children[1]
            // document.querySelectorAll("div.row-fluid.separator.time-row")[0].children[1].children[0].children[0].children[0].children[2].innerText
            // [...document.querySelectorAll(" a > p.mode-desc")].filter(e => e.innerText.includes("OV"))

            timeChildrenOriginal = document.querySelector("div.span12.start-times-wrapper.margin-top-10").innerHTML;

            // remove all non OV times
            [...document.querySelectorAll(" a > p.mode-desc")].filter(e => !e.innerText.includes("OV")).forEach(x => x.parentElement.parentElement.remove());
            // [...document.querySelectorAll(" a > p.mode-desc")].filter(e => !e.innerText.includes("OV")).forEach(x => {x.parentElement.parentElement.style.visibility = "hidden"; onlyOV = true;});

            // remove all empty days
            [...document.querySelectorAll("div.row-fluid.separator.time-row")].filter(x => x.children[1].innerText == "").forEach(x => x.remove());
            modifiedView = document.querySelector("div.span12.start-times-wrapper.margin-top-10").innerHTML;

            onlyOV = true;
            console.log('removed all non OV times');
        }, 150);
    }

    document.onkeyup = function (e) {
        // on F toogle fullscreen
        if (e.code == "KeyV") {
            toggleOVView();
        }
    };

    function toggleOVView() {
        if (onlyOV) {
            // [...document.querySelectorAll(" a > p.mode-desc")].filter(e => !e.innerText.includes("OV")).forEach(x => x.parentElement.parentElement.style.visibility = "visible");
            onlyOV = false;
            document.querySelector("div.span12.start-times-wrapper.margin-top-10").innerHTML = timeChildrenOriginal;
            // [...document.querySelectorAll("div.row-fluid.separator.time-row")].filter(x => x.children[1].innerText == "").forEach(x => x.remove());
        } else {
            // [...document.querySelectorAll(" a > p.mode-desc")].filter(e => !e.innerText.includes("OV")).forEach(x => x.parentElement.parentElement.style.visibility = "hidden");
            onlyOV = true;
            document.querySelector("div.span12.start-times-wrapper.margin-top-10").innerHTML = modifiedView;
        }
    }

})();