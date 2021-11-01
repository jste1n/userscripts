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

    var rates = JSON.parse('{"success":true,"timestamp":1635444725,"base":"EUR","date":"2021-10-28","rates":{"AED":4.292518,"AFN":106.05419,"ALL":122.998529,"AMD":558.362832,"ANG":2.105984,"AOA":697.675265,"ARS":116.498594,"AUD":1.549435,"AWG":2.103544,"AZN":1.986631,"BAM":1.969109,"BBD":2.359411,"BDT":100.113811,"BGN":1.956746,"BHD":0.440555,"BIF":2331.428049,"BMD":1.168636,"BND":1.574028,"BOB":8.068641,"BRL":6.541994,"BSD":1.16858,"BTC":1.9110876e-5,"BTN":87.479613,"BWP":13.233741,"BYN":2.837031,"BYR":22905.258029,"BZD":2.355383,"CAD":1.443206,"CDF":2353.631961,"CHF":1.065443,"CLF":0.034135,"CLP":941.885521,"CNY":7.469804,"COP":4414.228872,"CRC":740.261905,"CUC":1.168636,"CUP":30.968844,"CVE":110.677812,"CZK":25.747439,"DJF":207.689345,"DKK":7.438249,"DOP":65.969184,"DZD":160.119626,"EGP":18.360203,"ERN":17.530982,"ETB":55.10095,"EUR":1,"FJD":2.430332,"FKP":0.856869,"GBP":0.847348,"GEL":3.680857,"GGP":0.856869,"GHS":7.11657,"GIP":0.856869,"GMD":60.768968,"GNF":11259.804077,"GTQ":9.044312,"GYD":244.476519,"HKD":9.088888,"HNL":28.257237,"HRK":7.514092,"HTG":118.020856,"HUF":361.354151,"IDR":16586.737425,"ILS":3.698673,"IMP":0.856869,"INR":87.402082,"IQD":1706.207996,"IRR":49374.854314,"ISK":149.80774,"JEP":0.856869,"JMD":180.479048,"JOD":0.828634,"JPY":132.586338,"KES":129.954301,"KGS":99.097261,"KHR":4750.503668,"KMF":492.465476,"KPW":1051.771702,"KRW":1364.498221,"KWD":0.352402,"KYD":0.973867,"KZT":499.947081,"LAK":11990.201543,"LBP":1772.502492,"LKR":236.045074,"LRD":177.036435,"LSL":17.66982,"LTL":3.450678,"LVL":0.706896,"LYD":5.317599,"MAD":10.551027,"MDL":20.449298,"MGA":4630.718188,"MKD":62.032783,"MMK":2097.530803,"MNT":3331.691841,"MOP":9.360804,"MRO":417.202713,"MUR":50.314429,"MVR":18.055513,"MWK":952.43779,"MXN":23.830234,"MYR":4.84973,"MZN":74.593806,"NAD":17.66943,"NGN":479.432926,"NIO":41.139444,"NOK":9.733788,"NPR":139.969069,"NZD":1.622797,"OMR":0.449953,"PAB":1.16858,"PEN":4.648247,"PGK":4.131142,"PHP":59.13822,"PKR":201.180614,"PLN":4.625325,"PYG":8079.684798,"QAR":4.254976,"RON":4.948238,"RSD":118.397392,"RUB":82.114768,"RWF":1168.635614,"SAR":4.383565,"SBD":9.386686,"SCR":17.399074,"SDG":514.857522,"SEK":9.95653,"SGD":1.570839,"SHP":1.609681,"SLL":12592.048996,"SOS":682.482954,"SRD":25.077168,"STD":24188.397739,"SVC":10.224951,"SYP":1468.942273,"SZL":17.669413,"THB":38.789938,"TJS":13.134157,"TMT":4.096068,"TND":3.286789,"TOP":2.613595,"TRY":11.147262,"TTD":7.901987,"TWD":32.474011,"TZS":2693.704979,"UAH":30.776539,"UGX":4154.112975,"USD":1.168636,"UYU":50.895208,"UZS":12492.714466,"VEF":249889613119.56204,"VND":26592.303391,"VUV":131.233611,"WST":3.011566,"XAF":660.416122,"XAG":0.048498,"XAU":0.000649,"XCD":3.158297,"XDR":0.827286,"XOF":660.860688,"XPF":119.784014,"YER":292.451164,"ZAR":17.684141,"ZMK":10519.125259,"ZMW":20.156781,"ZWL":376.300191}}').rates;
    var url = window.location.href;
    var productID = url.match(/\w*\d{8}/g);

    if (productID) {
        jQuery('.js-price-package, .range-revamp-pip-price-package')
            .after('<div class="customElementIkeaPrices range-revamp-pip-price-package"' +
                'style="font-size: 0.875rem !important; /*border-bottom: 1px solid #dfdfdf; padding:10px 0;*/"></div>');
        jQuery('.customElementIkeaPrices').after('<div class="customElementIkeaNA range-revamp-pip-price-package" style="font-size: 0.875rem !important; padding-top:10px;"></div>');

        productID = productID.toString().toUpperCase();

        // GM_xmlhttpRequest( {
        //     method:     'GET',
        //     url:        'http://api.exchangeratesapi.io/v1/latest?access_key=key&base=EUR',
        //     responseType: 'json',
        //     onload:     function (responseDetails) {
        //         var rates = responseDetails.response.rates;
        printPrice('Slowakei', 'SK', 'sk', productID);
        printPrice('Italien', 'IT', 'it', productID);
        printPrice('Slowenien', 'SI', 'sl', productID);
        printPrice('Tschechien', 'CZ', 'cs', productID, rates.CZK);
        printPrice('Ungarn', 'HU', 'hu', productID, rates.HUF);
        printPrice('Kroatien', 'HR', 'hr', productID, rates.HRK);

        setTimeout(function () {
            sortIkeas(getFancyTextPrice);
            console.log('timeout done');
        }, 1000);

        jQuery('.customElementIkeaNA').after('<div style="padding: 1rem 0; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; flex-wrap: wrap;">'+
                                             '<div style="width: 50%; padding-right: 0.5rem; padding-left: 0.0rem;">'+
                                             '<a id="sortByPrice" class="hnf-link hnf-btn hnf-btn-change-country" style="width:100%; padding-left: unset; padding-right: unset;">sortieren nach Preis</a>'+
                                             '</div>'+
                                             '<div style="width: 50%; padding-right: 0.0rem; padding-left: 0.5rem;">'+
                                             '<a id="sortByCountry" class="hnf-link hnf-btn hnf-btn-change-country" style="width:100%; padding-left: unset; padding-right: unset;">sortieren nach Land</a>'+
                                             '</div>'+
                                             '</div>');
        jQuery('#sortByPrice').click(function(){ sortIkeas(getFancyTextPrice) });
        jQuery('#sortByCountry').click(function(){ sortIkeas(getFancyTextCountry) });
    }

    function sortIkeas(property) {
        var parent = jQuery('.customElementIkeaPrices');
        // sortUsingNestedText(parent, "a", property);
        sortFancyText(parent, property);
    };

    function getFancyTextPrice(x){
        return x.substring(x.indexOf("€")+2).replace(',','.');
    }

    function getFancyTextCountry(x){
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

//     function getNameFromLink(x) {
//         return x.text.split(":")[0];
//     }

//     function getPriceFromLink(x) {
//         return x.text.split("€")[1].substring(1, 6);
//     }

//     function sortUsingNestedText(parent, childSelector, formatter) {
//         console.log('children', parent.children(childSelector));
//         var items = parent.children(childSelector).sort(function (a, b) {
//             var vA = formatter(a);
//             console.log('check a', a);
//             console.log('formatted', vA);
//             var vB = formatter(b);
//             return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
//         });
//         parent.append(items);
//     };

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
                var priceDiv = jQuery('.range-revamp-pip-price-package__main-price', jQuery(responseDetails.responseText));

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

                    // only works when there is a bewertung
                    // jQuery('.range-revamp-average-rating, .range-revamp-average-rating__button').after('<a style="display:block;font-size: 16px !important; color: #ca5008 !important; margin-top:5px;" id="price-' + countryCode + '-link" href="' + urlOtherIkea + '">Ikea ' + country + ': € ' + pricePrint + '</a>');

                    // jQuery('.customElementIkeaPrices').append('<a style="display:block; margin-top:5px;" id="price-' + countryCode + '-link" href="' + urlOtherIkea + '">Ikea ' + country + ': € ' + pricePrint + '</a>');
                    jQuery('.customElementIkeaPrices').append('<div class="range-revamp-pip-price-package__wrapper">' +
                        '<div class="range-revamp-pip-price-package__content-left">' +
                        '<span><a class="range-revamp-link" href="' + urlOtherIkea + '">Ikea ' + country +
                        '</a>' + exchangeText + '<span></div>' +
                        '<div class="range-revamp-pip-price-package__price-wrapper"><div class="range-revamp-pip-price-package__main-price">' +
                        '<span class="range-revamp-price" style="font-weight: normal;">' +
                        '<span style="margin-right: 0.0625rem; font-size: 0.625rem; vertical-align: text-top;">€ </span>' +
                        '<span style="font-size: 1rem; vertical-align: text-bottom;">' + pricePrint.split(".")[0] + '</span>' +
                        '<span style="font-size: 0.625rem; vertical-align: text-top; margin-left: .0625rem;">,' + pricePrint.split(".")[1] +
                        '</span>' +
                        '</span></div></div></div>');
                } else {
                    jQuery('.customElementIkeaNA').append('<div id="price-' + countryCode + '-link">Ikea ' + country + ': n.a.</div>');
                }
            }
        });
    };

})();