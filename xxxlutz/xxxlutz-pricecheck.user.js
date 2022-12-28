// ==UserScript==
// @name         xxxlutz compare countries price
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.xxxlutz.at/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xxxlutz.at
// @grant        GM_xmlhttpRequest
// @connect      www.xxxlutz.sk
// @connect      www.xxxlutz.cz
// @connect      www.xxxlutz.ch
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

// first draft
// gets price from different countries if available
// just printes them in the console
// not yet displayed in a proper way. because content changes mulitple times and also just some tags changed/added/removed when clicking on links

(function() {
    'use strict';

    // setTimeout(function () {}, 1000);

    // TODO: this part seems to be reloading and then remove my added element
    jQuery('#currentPrice').parent().after('<div class="customElementIkeaPrices">aaa</div>');
    // var newTag = document.querySelector('[aria-label="breadcrumbs"]')?.after('<div class="customElementIkeaPrices">ccc</div>');

    var div = document.createElement('div');
    div.textContent = "Sup, y'all?";
    div.setAttribute('class', 'customFicker');
    document.querySelector('[aria-label="breadcrumbs"]')?.after(div);

    // document.querySelector
    // var newPriceTag = jQuery('.customElementIkeaPrices');
    // console.log('b', newPriceTag);

    var productIdMatch = document.querySelector('meta[property="og:url"]')?.content?.match(/\d+$/);
    console.log('b', productIdMatch);
    var productId;
    if (productIdMatch){
        console.log('c', productIdMatch[0]);
        productId = productIdMatch[0];
        //newPriceTag[0].innerText = productId;
    }
    console.log('d', productId);

    getPriceOtherCountry('Slovakia', 'sk', productId, 'b2937d2f9ea533d14e60bfa56b1693ead3b24b7651d7d09eb1d9e5fc4945a3e0');
    getPriceOtherCountry('Czech', 'CZ', productId, 'b2937d2f9ea533d14e60bfa56b1693ead3b24b7651d7d09eb1d9e5fc4945a3e0', 24.344007);
    getPriceOtherCountry('Swiss', 'ch', productId, 'b2937d2f9ea533d14e60bfa56b1693ead3b24b7651d7d09eb1d9e5fc4945a3e0', 1.016667);


    function getPriceOtherCountry(country, countryCode, productID, hash, exchangeRate = 1) {
        var urlOtherIkea = 'https://www.xxxlutz.' + countryCode.toLowerCase() + '/api/graphql?operationName=product&variables=%7B%22productCode%22:%22' + productID + '%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22'+hash+'%22%7D%7D';
        console.log('link ', country, urlOtherIkea);

        GM_xmlhttpRequest({
            method: 'GET',
            url: urlOtherIkea,
            responseType: 'json',
            onload: function (responseDetails) {
                console.log('tt', country, responseDetails);
                var priceFloat = responseDetails?.response?.data?.getProduct?.priceData?.currentPrice?.value;
                var pricePrint = "";
                var exchangeText = "";
                console.log('zz', country, priceFloat);

                if (priceFloat) {
                    if (exchangeRate != 1) {
                        priceFloat = priceFloat / exchangeRate;
                        // pricePrint = priceFloat.toFixed(2) + " <small>(exchange: " + exchangeRate + ")</small>";
                        pricePrint = priceFloat.toFixed(2);
                        exchangeText = " (XR: " + exchangeRate + ")";
                    } else {
                        pricePrint = priceFloat.toFixed(2);
                    }
                    console.log('------------------>>>>>>>', country, pricePrint);
                } else {
                    console.log('item not found for country ', country);
                }
            }
        });
    }
})();