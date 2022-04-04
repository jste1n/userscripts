// ==UserScript==
// @name         Ikea Pricechecker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  forked from Tiuz https://pastebin.com/5qkwpVvV - Vergleicht die Preise auf der österreichischen Ikea Seite mit den Preisen von IKEA SK/IT/CZ/HU/HR
// @author       JP Stoni
// @match        https://www.ikea.com/at/*
// @icon         https://www.ikea.com/at/de/static/favicon.838d8a3778e4d716eb72.ico
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
    var backupResponse = JSON.parse('{"success":true,"timestamp":1649112186,"base":"EUR","date":"2022-04-04","rates":{"CZK":24.344007,"HRK":7.543161,"HUF":368.883491}}');
    // var backupResponse = JSON.parse('{"success":true,"timestamp":1635444725,"base":"EUR","date":"2021-10-28","rates":{"CZK":25.747439,"HRK":7.514092,"HUF":361.354151}}');
    // {"success": true,"timestamp": 1647374883,"base": "EUR","date": "2022-03-15","rates": {"AED": 4.022846,"AFN": 94.739355,"ALL": 123.485965,"AMD": 561.694149,"ANG": 1.972501,"AOA": 504.533851,"ARS": 119.671778,"AUD": 1.521771,"AWG": 1.971667,"AZN": 1.863045,"BAM": 1.948816,"BBD": 2.209747,"BDT": 94.095915,"BGN": 1.958621,"BHD": 0.412901,"BIF": 2201.38897,"BMD": 1.095218,"BND": 1.494435,"BOB": 7.51336,"BRL": 5.649366,"BSD": 1.094461,"BTC": 0.000027615471,"BTN": 83.716457,"BWP": 12.748419,"BYN": 3.640913,"BYR": 21466.2805,"BZD": 2.206061,"CAD": 1.397975,"CDF": 2205.769589,"CHF": 1.030927,"CLF": 0.032146,"CLP": 886.995139,"CNY": 6.977198,"COP": 4197.610678,"CRC": 704.574291,"CUC": 1.095218,"CUP": 29.023287,"CVE": 110.863502,"CZK": 24.86157,"DJF": 194.64253,"DKK": 7.439162,"DOP": 60.125214,"DZD": 156.657812,"EGP": 17.208947,"ERN": 16.428281,"ETB": 56.157394,"EUR": 1,"FJD": 2.327889,"FKP": 0.839988,"GBP": 0.839644,"GEL": 3.525983,"GGP": 0.839988,"GHS": 7.863316,"GIP": 0.839988,"GMD": 58.402489,"GNF": 9780.300479,"GTQ": 8.435441,"GYD": 228.975933,"HKD": 8.573315,"HNL": 26.669017,"HRK": 7.576389,"HTG": 115.329936,"HUF": 370.87346,"IDR": 15664.963434,"ILS": 3.593368,"IMP": 0.839988,"INR": 83.537453,"IQD": 1598.471244,"IRR": 46382.499017,"ISK": 144.699808,"JEP": 0.839988,"JMD": 167.43342,"JOD": 0.776514,"JPY": 129.555597,"KES": 125.178963,"KGS": 114.998129,"KHR": 4424.682066,"KMF": 492.793951,"KPW": 985.696937,"KRW": 1360.348554,"KWD": 0.333111,"KYD": 0.912018,"KZT": 564.125509,"LAK": 12595.011288,"LBP": 1657.0652,"LKR": 298.239382,"LRD": 168.333997,"LSL": 16.528165,"LTL": 3.233895,"LVL": 0.662487,"LYD": 5.103691,"MAD": 10.717259,"MDL": 20.192529,"MGA": 4397.301942,"MKD": 61.490391,"MMK": 1946.107477,"MNT": 3152.88491,"MOP": 8.823026,"MRO": 390.992778,"MUR": 48.572828,"MVR": 16.921406,"MWK": 883.292411,"MXN": 22.814051,"MYR": 4.607559,"MZN": 69.907882,"NAD": 16.535328,"NGN": 455.556512,"NIO": 39.105754,"NOK": 9.867206,"NPR": 133.946161,"NZD": 1.618075,"OMR": 0.421639,"PAB": 1.094461,"PEN": 4.09338,"PGK": 3.843518,"PHP": 57.241568,"PKR": 196.043977,"PLN": 4.705112,"PYG": 7619.37844,"QAR": 3.98765,"RON": 4.947975,"RSD": 117.6538,"RUB": 117.188485,"RWF": 1118.217979,"SAR": 4.109058,"SBD": 8.814705,"SCR": 15.787887,"SDG": 490.109768,"SEK": 10.530961,"SGD": 1.495285,"SHP": 1.508551,"SLL": 12835.959688,"SOS": 643.988017,"SRD": 22.520987,"STD": 22668.809495,"SVC": 9.576535,"SYP": 2751.188973,"SZL": 16.537927,"THB": 36.73144,"TJS": 14.255845,"TMT": 3.833264,"TND": 3.23306,"TOP": 2.496881,"TRY": 16.140013,"TTD": 7.431554,"TWD": 31.270645,"TZS": 2535.430745,"UAH": 32.178162,"UGX": 3934.539892,"USD": 1.095218,"UYU": 46.645128,"UZS": 12050.688023,"VEF": 234190792450.39844,"VND": 25064.07292,"VUV": 124.982604,"WST": 2.871713,"XAF": 653.595807,"XAG": 0.043994,"XAU": 0.000571,"XCD": 2.959883,"XDR": 0.794231,"XOF": 653.294614,"XPF": 113.135637,"YER": 274.077949,"ZAR": 16.544389,"ZMK": 9858.276561,"ZMW": 19.399084,"ZWL": 352.659876}}
    // {"success":true,"timestamp":1649112186,"base":"EUR","date":"2022-04-04","rates":{"AED":4.031018,"AFN":97.672391,"ALL":121.593087,"AMD":530.229252,"ANG":1.977425,"AOA":487.894301,"ARS":122.459909,"AUD":1.454337,"AWG":1.975945,"AZN":1.867486,"BAM":1.950626,"BBD":2.21541,"BDT":94.608429,"BGN":1.956065,"BHD":0.413778,"BIF":2205.858929,"BMD":1.097442,"BND":1.4893,"BOB":7.543345,"BRL":5.043291,"BSD":1.097183,"BTC":2.3515602e-5,"BTN":82.863847,"BWP":12.61895,"BYN":3.573307,"BYR":21509.868167,"BZD":2.21162,"CAD":1.370321,"CDF":2208.053892,"CHF":1.016667,"CLF":0.030984,"CLP":854.940374,"CNY":6.983459,"COP":4065.474828,"CRC":728.183993,"CUC":1.097442,"CUP":29.08222,"CVE":110.677454,"CZK":24.344007,"DJF":195.037445,"DKK":7.437915,"DOP":60.414016,"DZD":157.424544,"EGP":20.015042,"ERN":16.461639,"ETB":56.024346,"EUR":1,"FJD":2.296453,"FKP":0.841693,"GBP":0.83679,"GEL":3.380255,"GGP":0.841693,"GHS":8.258236,"GIP":0.841693,"GMD":59.050437,"GNF":9745.287007,"GTQ":8.431176,"GYD":229.549701,"HKD":8.598191,"HNL":26.776913,"HRK":7.543161,"HTG":115.088967,"HUF":368.883491,"IDR":15724.701328,"ILS":3.522493,"IMP":0.841693,"INR":82.788575,"IQD":1602.814411,"IRR":46476.679775,"ISK":141.602723,"JEP":0.841693,"JMD":168.219758,"JOD":0.778075,"JPY":134.697868,"KES":126.3135,"KGS":94.124003,"KHR":4444.641411,"KMF":492.586457,"KPW":987.698412,"KRW":1332.986114,"KWD":0.334007,"KYD":0.914369,"KZT":513.083798,"LAK":12933.357367,"LBP":1661.527301,"LKR":323.562152,"LRD":167.497136,"LSL":16.027669,"LTL":3.240462,"LVL":0.663832,"LYD":5.11955,"MAD":10.698419,"MDL":20.104899,"MGA":4373.307126,"MKD":61.62383,"MMK":1951.018169,"MNT":3159.286899,"MOP":8.855015,"MRO":391.786696,"MUR":49.044292,"MVR":16.955233,"MWK":889.4741,"MXN":21.742086,"MYR":4.62846,"MZN":70.049873,"NAD":16.022551,"NGN":456.228434,"NIO":39.211697,"NOK":9.563496,"NPR":132.580511,"NZD":1.579247,"OMR":0.422429,"PAB":1.097183,"PEN":3.98426,"PGK":3.852232,"PHP":56.452503,"PKR":201.408102,"PLN":4.619558,"PYG":7598.428979,"QAR":3.995804,"RON":4.942776,"RSD":117.733868,"RUB":91.910784,"RWF":1122.683425,"SAR":4.116881,"SBD":8.797168,"SCR":15.816447,"SDG":490.007657,"SEK":10.344707,"SGD":1.488678,"SHP":1.511617,"SLL":13043.101586,"SOS":643.100936,"SRD":22.702807,"STD":22714.838919,"SVC":9.59969,"SYP":2756.775311,"SZL":16.025916,"THB":36.715482,"TJS":13.686689,"TMT":3.852022,"TND":3.281905,"TOP":2.472103,"TRY":16.121318,"TTD":7.450392,"TWD":31.406275,"TZS":2553.74839,"UAH":32.255597,"UGX":3900.310467,"USD":1.097442,"UYU":45.134003,"UZS":12527.30329,"VEF":234666321051.95837,"VND":25073.811885,"VUV":125.236383,"WST":2.877544,"XAF":654.199809,"XAG":0.044705,"XAU":0.000568,"XCD":2.965893,"XDR":0.794865,"XOF":651.331443,"XPF":119.977883,"YER":274.635243,"ZAR":16.011627,"ZMK":9878.29753,"ZMW":19.282054,"ZWL":353.375958}}

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
            if (xrResponse?.response?.success) {
                var newRatesDate = new Date(xrResponse.response.timestamp * 1000).toString();
                console.log('rates from ', newRatesDate);
                console.log('new complete rates: ');
                console.log(xrResponse.responseText);

                var newRatesResponse = xrResponse.response;
                Object.keys(newRatesResponse.rates)
                    .filter(property => !["CZK", "HRK", "HUF"].includes(property))
                    .forEach(property => delete newRatesResponse.rates[property])
                console.log('new rates (short)');
                console.log("var backupResponse = JSON.parse('"+JSON.stringify(newRatesResponse)+"');");

                getPriceInForeignCurrency(newRatesResponse);
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
                    var priceFloat = parseFloat(priceDiv[0].innerText.replace(/\/.*|[^0-9,]/g, '').replace(',', '.'));
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