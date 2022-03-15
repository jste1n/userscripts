// ==UserScript==
// @name         Ikea Pricechecker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  forked from Tiuz https://pastebin.com/5qkwpVvV - Vergleicht die Preise auf der österreichischen Ikea Seite mit den Preisen von IKEA SK/IT/CZ/HU/HR
// @author       JP Stoni
// @match        https://www.ikea.com/at/*
// @grant        GM_xmlhttpRequest
// @connect      api.exchangeratesapi.io
// add @ below if using:
// connect      publications-ext.ikea.com
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function () {
    'use strict';
    $.noConflict();

    var access_key = ''; // add your access key here
    var backupResponse = JSON.parse('{"success": true,"timestamp": 1647374883,"base": "EUR","date": "2022-03-15","rates": {"CZK": 24.86157,"HRK": 7.576389,"HUF": 370.87346}}');
    // var backupResponse = JSON.parse('{"success":true,"timestamp":1635444725,"base":"EUR","date":"2021-10-28","rates":{"CZK":25.747439,"HRK":7.514092,"HUF":361.354151}}');
    // var backupResponse = JSON.parse('{"success": true,"timestamp": 1647374883,"base": "EUR","date": "2022-03-15","rates": {"AED": 4.022846,"AFN": 94.739355,"ALL": 123.485965,"AMD": 561.694149,"ANG": 1.972501,"AOA": 504.533851,"ARS": 119.671778,"AUD": 1.521771,"AWG": 1.971667,"AZN": 1.863045,"BAM": 1.948816,"BBD": 2.209747,"BDT": 94.095915,"BGN": 1.958621,"BHD": 0.412901,"BIF": 2201.38897,"BMD": 1.095218,"BND": 1.494435,"BOB": 7.51336,"BRL": 5.649366,"BSD": 1.094461,"BTC": 0.000027615471,"BTN": 83.716457,"BWP": 12.748419,"BYN": 3.640913,"BYR": 21466.2805,"BZD": 2.206061,"CAD": 1.397975,"CDF": 2205.769589,"CHF": 1.030927,"CLF": 0.032146,"CLP": 886.995139,"CNY": 6.977198,"COP": 4197.610678,"CRC": 704.574291,"CUC": 1.095218,"CUP": 29.023287,"CVE": 110.863502,"CZK": 24.86157,"DJF": 194.64253,"DKK": 7.439162,"DOP": 60.125214,"DZD": 156.657812,"EGP": 17.208947,"ERN": 16.428281,"ETB": 56.157394,"EUR": 1,"FJD": 2.327889,"FKP": 0.839988,"GBP": 0.839644,"GEL": 3.525983,"GGP": 0.839988,"GHS": 7.863316,"GIP": 0.839988,"GMD": 58.402489,"GNF": 9780.300479,"GTQ": 8.435441,"GYD": 228.975933,"HKD": 8.573315,"HNL": 26.669017,"HRK": 7.576389,"HTG": 115.329936,"HUF": 370.87346,"IDR": 15664.963434,"ILS": 3.593368,"IMP": 0.839988,"INR": 83.537453,"IQD": 1598.471244,"IRR": 46382.499017,"ISK": 144.699808,"JEP": 0.839988,"JMD": 167.43342,"JOD": 0.776514,"JPY": 129.555597,"KES": 125.178963,"KGS": 114.998129,"KHR": 4424.682066,"KMF": 492.793951,"KPW": 985.696937,"KRW": 1360.348554,"KWD": 0.333111,"KYD": 0.912018,"KZT": 564.125509,"LAK": 12595.011288,"LBP": 1657.0652,"LKR": 298.239382,"LRD": 168.333997,"LSL": 16.528165,"LTL": 3.233895,"LVL": 0.662487,"LYD": 5.103691,"MAD": 10.717259,"MDL": 20.192529,"MGA": 4397.301942,"MKD": 61.490391,"MMK": 1946.107477,"MNT": 3152.88491,"MOP": 8.823026,"MRO": 390.992778,"MUR": 48.572828,"MVR": 16.921406,"MWK": 883.292411,"MXN": 22.814051,"MYR": 4.607559,"MZN": 69.907882,"NAD": 16.535328,"NGN": 455.556512,"NIO": 39.105754,"NOK": 9.867206,"NPR": 133.946161,"NZD": 1.618075,"OMR": 0.421639,"PAB": 1.094461,"PEN": 4.09338,"PGK": 3.843518,"PHP": 57.241568,"PKR": 196.043977,"PLN": 4.705112,"PYG": 7619.37844,"QAR": 3.98765,"RON": 4.947975,"RSD": 117.6538,"RUB": 117.188485,"RWF": 1118.217979,"SAR": 4.109058,"SBD": 8.814705,"SCR": 15.787887,"SDG": 490.109768,"SEK": 10.530961,"SGD": 1.495285,"SHP": 1.508551,"SLL": 12835.959688,"SOS": 643.988017,"SRD": 22.520987,"STD": 22668.809495,"SVC": 9.576535,"SYP": 2751.188973,"SZL": 16.537927,"THB": 36.73144,"TJS": 14.255845,"TMT": 3.833264,"TND": 3.23306,"TOP": 2.496881,"TRY": 16.140013,"TTD": 7.431554,"TWD": 31.270645,"TZS": 2535.430745,"UAH": 32.178162,"UGX": 3934.539892,"USD": 1.095218,"UYU": 46.645128,"UZS": 12050.688023,"VEF": 234190792450.39844,"VND": 25064.07292,"VUV": 124.982604,"WST": 2.871713,"XAF": 653.595807,"XAG": 0.043994,"XAU": 0.000571,"XCD": 2.959883,"XDR": 0.794231,"XOF": 653.294614,"XPF": 113.135637,"YER": 274.077949,"ZAR": 16.544389,"ZMK": 9858.276561,"ZMW": 19.399084,"ZWL": 352.659876}}').rates;

    var cssClassPreFix = 'pip'; // previously: range-revamp
    var url = window.location.href;
    var productID = url.match(/\w*\d{8}/g);
    main();

    async function main() {
        if (productID) {
            jQuery('.js-price-package, .' + cssClassPreFix + '-pip-price-package')
                .after('<div class="customElementIkeaPrices ' + cssClassPreFix + '-pip-price-package"' +
                    'style="font-size: 0.875rem !important; display:none; /*border-bottom: 1px solid #dfdfdf; padding:10px 0;*/"></div>')
            jQuery('.customElementIkeaPrices').after('<div class="customElementIkeaNA ' + cssClassPreFix + '-pip-price-package" style="font-size: 0.875rem !important; display:none;"></div>');

            productID = productID.toString().toUpperCase();

            printPrice('Slowakei', 'SK', 'sk', productID);
            printPrice('Italien', 'IT', 'it', productID);
            printPrice('Slowenien', 'SI', 'sl', productID);

            var xrResponse = await getExchangeRates();
            xrResponse = xrResponse.response;
            if (xrResponse?.success) {
                console.log('rates from ', new Date(xrResponse.timestamp * 1000).toString());
                console.log('rates: ', xrResponse);
                getPriceInForeignCurrency(xrResponse);
            } else {
                console.log('couldn\'t get new rates. using old exchange rates from:', new Date(backupResponse.timestamp * 1000).toString());
                getPriceInForeignCurrency(backupResponse);
            }

            // setTimeout(function () {
            //     sortIkeas(getFancyTextPrice);
            //     console.log('timeout done');
            // }, 1000);

            jQuery('.customElementIkeaNA').after('<div style="padding: 0 0 1rem; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; flex-wrap: wrap;">' +
                '<div style="width: 50%; padding-right: 0.5rem; padding-left: 0.0rem;">' +
                '<a id="sortByPrice" class="hnf-link hnf-btn hnf-btn-change-country" style="width:100%; padding-left: unset; padding-right: unset;">sortieren nach Preis</a>' +
                '</div>' +
                '<div style="width: 50%; padding-right: 0.0rem; padding-left: 0.5rem;">' +
                '<a id="sortByCountry" class="hnf-link hnf-btn hnf-btn-change-country" style="width:100%; padding-left: unset; padding-right: unset;">sortieren nach Land</a>' +
                '</div>' +
                '</div>');
            jQuery('#sortByPrice').click(function () { sortIkeas(getFancyTextPrice) });
            jQuery('#sortByCountry').click(function () { sortIkeas(getFancyTextCountry) });
        }
    }

    function getExchangeRates() {
        return new Promise(function (resolve) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://api.exchangeratesapi.io/v1/latest?access_key=' + access_key + '&base=EUR',
                responseType: 'json',
                onload: function (response) {
                    resolve(response);
                }
            })
        });
    }

    function getPriceInForeignCurrency(response) {
        printPrice('Tschechien', 'CZ', 'cs', productID, response.rates.CZK);
        printPrice('Ungarn', 'HU', 'hu', productID, response.rates.HUF);
        printPrice('Kroatien', 'HR', 'hr', productID, response.rates.HRK);
    }

    function sortIkeas(property) {
        var parent = jQuery('.customElementIkeaPrices');
        // sortUsingNestedText(parent, "a", property);
        sortFancyText(parent, property);
    };

    function getFancyTextPrice(x) {
        return x.substring(x.indexOf("€") + 2).replace(',', '.');
    }

    function getFancyTextCountry(x) {
        return x.substring(0, x.indexOf("€")).split(' ')[1];
    }

    function sortFancyText(parent, formatter) {
        var items = parent.children().sort(function (a, b) {
            var vA = formatter(a.innerText);
            var vB = formatter(b.innerText);
            return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
        });
        parent.append(items);
    };

    // function getNameFromLink(x) {
    //     return x.text.split(":")[0];
    // }

    // function getPriceFromLink(x) {
    //     return x.text.split("€")[1].substring(1, 6);
    // }

    // function sortUsingNestedText(parent, childSelector, formatter) {
    //     console.log('children', parent.children(childSelector));
    //     var items = parent.children(childSelector).sort(function (a, b) {
    //         var vA = formatter(a);
    //         console.log('check a', a);
    //         console.log('formatted', vA);
    //         var vB = formatter(b);
    //         return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    //     });
    //     parent.append(items);
    // };

    function printPrice(country, countryCode, lang, productID, exchangeRate = 1) {
        // alternative link from web product catalog
        // var urlOtherIkea = 'https://publications-ext.ikea.com/'+country.toLowerCase()+'/'+lang+'/products/ART%2C'+productID;
        var urlOtherIkea = 'https://www.ikea.com/' + countryCode.toLowerCase() + '/' + lang + '/catalog/products/' + productID;
        console.log('link ', country, urlOtherIkea);

        GM_xmlhttpRequest({
            method: 'GET',
            url: urlOtherIkea,
            responseType: 'document',
            onload: function (responseDetails) {
                // alternative link from web product catalog
                // var priceDiv = jQuery('.product-price',jQuery(responseDetails.responseText));
                // alternative: search for the right class without nowing the prefix
                // var priceDiv = jQuery('[class*="package__main-price"]', jQuery(responseDetails.responseText));
                var priceDiv = jQuery('.' + cssClassPreFix + '-pip-price-package__main-price', jQuery(responseDetails.responseText));
                if (priceDiv[0]) {
                    var priceFloat = parseFloat(priceDiv[0].innerText.replace(/[^0-9,]/g, '').replace(',', '.'));
                    var pricePrint = "";
                    var exchangeText = "";
                    if (exchangeRate != 1) {
                        priceFloat = priceFloat / exchangeRate;
                        // pricePrint = priceFloat.toFixed(2) + " <small>(exchange: " + exchangeRate + ")</small>";
                        pricePrint = priceFloat.toFixed(2);
                        exchangeText = " (XR: " + exchangeRate + ")";
                    } else {
                        pricePrint = priceFloat.toFixed(2);
                    }

                    jQuery('.customElementIkeaPrices').show();
                    // only works when there is a bewertung
                    // jQuery('.range-revamp-average-rating, .range-revamp-average-rating__button').after('<a style="display:block;font-size: 16px !important; color: #ca5008 !important; margin-top:5px;" id="price-' + countryCode + '-link" href="' + urlOtherIkea + '">Ikea ' + country + ': € ' + pricePrint + '</a>');

                    // jQuery('.customElementIkeaPrices').append('<a style="display:block; margin-top:5px;" id="price-' + countryCode + '-link" href="' + urlOtherIkea + '">Ikea ' + country + ': € ' + pricePrint + '</a>');
                    jQuery('.customElementIkeaPrices').append('<div class="' + cssClassPreFix + '-pip-price-package__wrapper">' +
                        '<div class="' + cssClassPreFix + '-pip-price-package__content-left">' +
                        '<span><a class="' + cssClassPreFix + '-link" href="' + urlOtherIkea + '">Ikea ' + country +
                        '</a>' + exchangeText + '<span></div>' +
                        '<div class="' + cssClassPreFix + '-pip-price-package__price-wrapper"><div class="' + cssClassPreFix + '-pip-price-package__main-price">' +
                        '<span class="' + cssClassPreFix + '-price" style="font-weight: normal;">' +
                        '<span style="margin-right: 0.0625rem; font-size: 0.625rem; vertical-align: text-top;">€ </span>' +
                        '<span style="font-size: 1rem; vertical-align: text-bottom;">' + pricePrint.split(".")[0] + '</span>' +
                        '<span style="font-size: 0.625rem; vertical-align: text-top; margin-left: .0625rem;">,' + pricePrint.split(".")[1] +
                        '</span>' +
                        '</span></div></div></div>');
                } else {
                    jQuery('.customElementIkeaNA').show();
                    // jQuery('.customElementIkeaNA').append('<div id="price-' + countryCode + '-link"><a class="' + cssClassPreFix + '-link" href="'+urlOtherIkea+'">Ikea ' + country + '</a>: n.a.</div>');
                    jQuery('.customElementIkeaNA').append('<div class="' + cssClassPreFix + '-pip-price-package__wrapper">' +
                        '<div class="' + cssClassPreFix + '-pip-price-package__content-left">' +
                        '<span><a class="' + cssClassPreFix + '-link" href="' + urlOtherIkea + '">Ikea ' + country +
                        '</a><span></div>' +
                        '<div class="' + cssClassPreFix + '-pip-price-package__price-wrapper"><div class="' + cssClassPreFix + '-pip-price-package__main-price">' +
                        '<span class="' + cssClassPreFix + '-price" style="font-weight: normal;">' +
                        '<span style="vertical-align: text-bottom;">n.a.</span>' +
                        '</span></div></div></div>');
                }
            }
        });
    };

})();