// ==UserScript==
// @name         skip all redirected ad sites on preisjaeger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       JP Stoni
// @match        https://www.preisjaeger.at/*
// @icon         https://www.preisjaeger.at/favicon.ico
// run-at document-start
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.5.0.min.js
// ==/UserScript==

(function () {
    'use strict';
    $.noConflict();

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '#loaderSpinner { position: fixed; left: 50%; top: 50%; z-index: 101; width: 120px; height: 120px; margin: -76px 0 0 -76px; border: 16px solid #f3f3f3; border-radius: 50%; border-top: 16px solid #3498db; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } ';
    document.getElementsByTagName('head')[0].appendChild(style);
    jQuery('body').append('<div id="loaderBg" style="display:none; position: fixed; top: 0; left: 0; z-index: 100; background-color: #000000 !important; opacity: 0.3; width:100%; height:100%;"></div>');//<div id="loader" style="border: 16px solid #f3f3f3 !important; border-top: 16px solid #3498db !important;"></div></div>');
    jQuery('body').append('<div id="loaderSpinner" style="display:none; border: 16px solid #f3f3f3 !important; border-top: 16px solid #3498db !important;"></div>');

    function findLink(el) {
        if (el.tagName == 'A' && el.href) {
            return el;
        } else if (el.parentElement) {
            return findLink(el.parentElement);
        } else {
            return null;
        }
    };

    async function callback(e) {
        const link = findLink(e.target);

        if (!(link?.href != null && /^https:\/\/www\.preisjaeger\.at\/visit\/thread(image)?(desc)?\/\d{6}(\/\d{6})?$/g.test(link.href))) { return; }

        if (link.hasAttribute('title')) {
            link.href = link.title;
            console.log('changed link to the title of DOM element');
        } else {
            console.log('checking redirects...');

            e.preventDefault();

            jQuery('#loaderSpinner').show();
            jQuery('#loaderBg').show();

            var newUrl = await gettraceRoute(link.href);
            var response = JSON.parse(newUrl.response)[0];

            if (response.statusCode == 'error' || response.redirectURLChain == null) {
                window.open(link.href, '_blank');
            } else {
                var realLink = response.redirectURLChain[1].match(/https%.*(?=&ppref)/g);
                var realLinkEncoded = '';
                if (realLink != null) {
                    realLinkEncoded = decodeURIComponent(realLink[0].replace(/\+/g, " "));
                } else {
                    realLinkEncoded = response.redirectURLChain[response.redirectURLChain.length - 1]
                }

                window.open(realLinkEncoded, '_blank');
                link.href = realLinkEncoded;
            }
            jQuery('#loaderSpinner').hide();
            jQuery('#loaderBg').hide();
            console.log('new link', link.href);
        }
    };

    // if (document.addEventListener){
    document.addEventListener('click', callback, false);
    // }else{
    //     document.attachEvent('onclick', callback);
    // }

    function gettraceRoute(urlToTrace) {
        return new Promise(function (resolve) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://httpstatus-backend-production.herokuapp.com/api", // https://httpstatus.io/
                data: '{"urls":["' + urlToTrace + '"],"userAgent":"browser","userName":"","passWord":"","headerName":"","headerValue":"","strictSSL":true,"canonicalDomain":false,"additionalSubdomains":["www"],"followRedirect":true,"throttleRequests":100,"escapeCharacters":false}',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Connection': 'keep-alive',
                    'sec-ch-ua': '"Chromium";v="95", ";Not A Brand";v="99"',
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'sec-ch-ua-mobile': '?0',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
                    'sec-ch-ua-platform': '"Windows"',
                    'Origin': 'https://httpstatus.io',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Referer': 'https://httpstatus.io/',
                    'Accept-Language': 'en-US,en;q=0.9,de-AT;q=0.8,de;q=0.7',
                    'dnt': '1',
                    'sec-gpc': '1'
                },
                onload: function (response) {
                    resolve(response);
                }
            })
        });
    }

})();