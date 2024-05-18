// ==UserScript==
// @name         Ikea Pricechecker
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  forked from Tiuz https://pastebin.com/5qkwpVvV - Vergleicht die Preise auf der österreichischen Ikea Seite mit den Preisen von IKEA SK/IT/CZ/HU/HR
// @author       JP Stoni
// @match        https://www.ikea.com/at/*
// @icon         https://www.ikea.com/at/de/static/favicon.838d8a3778e4d716eb72.ico
// @grant        GM_xmlhttpRequest
// @connect      api.exchangeratesapi.io
// add @ below if using:
// connect      publications-ext.ikea.com
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// ==/UserScript==

// PRIO highest priority tasks for major functional bugs or features
// PRIO-1: if a product contains multiple pieces, script breaks. Also these type of products have multiple "price-module__addons". 
//      1. need to detect if a product has a "family price"
//      2. need to detect if a product contains multiple pieces. if so, then just get the regular price
//      3. need 1. and 2. to work together. If a product has a family price and contains multiple pieces.
// PRIO-2: wishlist: if a product is not available in a country, mark it in the aggregated result. maybe make the font-color of the country's sum red and when hovering over, open a info tooltip

// NICE to have features
// NICE-1: create css classes for all inline styles and just reference the classes
// NICE-2: wishlist: add availability for single product and for each items in wishlist. see comments get api.ingka.ikea.com
// NICE-3: single product page: sort prices auto after all infos are loaded

// TRIV trivial errors that should at some point be resolved
// TRIV-1: bug in wishlist: when selecting to check availability in store, not online, quantity cannot be found. error at column 310
// TRIV-2: wishlist: add buttons to sort the prices of other countries like on single product page
// TRIV-3: wishlist: sort prices auto after all infos are loaded


(function () {
    'use strict';
    // $.noConflict();

    var access_key = ''; // add your access key here
    var backupResponse = JSON.parse('{"success":true,"timestamp":1715886484,"base":"EUR","date":"2024-05-16","rates":{"CZK":24.707627,"HUF":386.792283}}');
    // var backupResponse = JSON.parse('{"success":true,"timestamp":1635444725,"base":"EUR","date":"2021-10-28","rates":{"CZK":25.747439,"HRK":7.514092,"HUF":361.354151}}');
    // {"success": true,"timestamp": 1647374883,"base": "EUR","date": "2022-03-15","rates": {"AED": 4.022846,"AFN": 94.739355,"ALL": 123.485965,"AMD": 561.694149,"ANG": 1.972501,"AOA": 504.533851,"ARS": 119.671778,"AUD": 1.521771,"AWG": 1.971667,"AZN": 1.863045,"BAM": 1.948816,"BBD": 2.209747,"BDT": 94.095915,"BGN": 1.958621,"BHD": 0.412901,"BIF": 2201.38897,"BMD": 1.095218,"BND": 1.494435,"BOB": 7.51336,"BRL": 5.649366,"BSD": 1.094461,"BTC": 0.000027615471,"BTN": 83.716457,"BWP": 12.748419,"BYN": 3.640913,"BYR": 21466.2805,"BZD": 2.206061,"CAD": 1.397975,"CDF": 2205.769589,"CHF": 1.030927,"CLF": 0.032146,"CLP": 886.995139,"CNY": 6.977198,"COP": 4197.610678,"CRC": 704.574291,"CUC": 1.095218,"CUP": 29.023287,"CVE": 110.863502,"CZK": 24.86157,"DJF": 194.64253,"DKK": 7.439162,"DOP": 60.125214,"DZD": 156.657812,"EGP": 17.208947,"ERN": 16.428281,"ETB": 56.157394,"EUR": 1,"FJD": 2.327889,"FKP": 0.839988,"GBP": 0.839644,"GEL": 3.525983,"GGP": 0.839988,"GHS": 7.863316,"GIP": 0.839988,"GMD": 58.402489,"GNF": 9780.300479,"GTQ": 8.435441,"GYD": 228.975933,"HKD": 8.573315,"HNL": 26.669017,"HRK": 7.576389,"HTG": 115.329936,"HUF": 370.87346,"IDR": 15664.963434,"ILS": 3.593368,"IMP": 0.839988,"INR": 83.537453,"IQD": 1598.471244,"IRR": 46382.499017,"ISK": 144.699808,"JEP": 0.839988,"JMD": 167.43342,"JOD": 0.776514,"JPY": 129.555597,"KES": 125.178963,"KGS": 114.998129,"KHR": 4424.682066,"KMF": 492.793951,"KPW": 985.696937,"KRW": 1360.348554,"KWD": 0.333111,"KYD": 0.912018,"KZT": 564.125509,"LAK": 12595.011288,"LBP": 1657.0652,"LKR": 298.239382,"LRD": 168.333997,"LSL": 16.528165,"LTL": 3.233895,"LVL": 0.662487,"LYD": 5.103691,"MAD": 10.717259,"MDL": 20.192529,"MGA": 4397.301942,"MKD": 61.490391,"MMK": 1946.107477,"MNT": 3152.88491,"MOP": 8.823026,"MRO": 390.992778,"MUR": 48.572828,"MVR": 16.921406,"MWK": 883.292411,"MXN": 22.814051,"MYR": 4.607559,"MZN": 69.907882,"NAD": 16.535328,"NGN": 455.556512,"NIO": 39.105754,"NOK": 9.867206,"NPR": 133.946161,"NZD": 1.618075,"OMR": 0.421639,"PAB": 1.094461,"PEN": 4.09338,"PGK": 3.843518,"PHP": 57.241568,"PKR": 196.043977,"PLN": 4.705112,"PYG": 7619.37844,"QAR": 3.98765,"RON": 4.947975,"RSD": 117.6538,"RUB": 117.188485,"RWF": 1118.217979,"SAR": 4.109058,"SBD": 8.814705,"SCR": 15.787887,"SDG": 490.109768,"SEK": 10.530961,"SGD": 1.495285,"SHP": 1.508551,"SLL": 12835.959688,"SOS": 643.988017,"SRD": 22.520987,"STD": 22668.809495,"SVC": 9.576535,"SYP": 2751.188973,"SZL": 16.537927,"THB": 36.73144,"TJS": 14.255845,"TMT": 3.833264,"TND": 3.23306,"TOP": 2.496881,"TRY": 16.140013,"TTD": 7.431554,"TWD": 31.270645,"TZS": 2535.430745,"UAH": 32.178162,"UGX": 3934.539892,"USD": 1.095218,"UYU": 46.645128,"UZS": 12050.688023,"VEF": 234190792450.39844,"VND": 25064.07292,"VUV": 124.982604,"WST": 2.871713,"XAF": 653.595807,"XAG": 0.043994,"XAU": 0.000571,"XCD": 2.959883,"XDR": 0.794231,"XOF": 653.294614,"XPF": 113.135637,"YER": 274.077949,"ZAR": 16.544389,"ZMK": 9858.276561,"ZMW": 19.399084,"ZWL": 352.659876}}
    // {"success":true,"timestamp":1649112186,"base":"EUR","date":"2022-04-04","rates":{"AED":4.031018,"AFN":97.672391,"ALL":121.593087,"AMD":530.229252,"ANG":1.977425,"AOA":487.894301,"ARS":122.459909,"AUD":1.454337,"AWG":1.975945,"AZN":1.867486,"BAM":1.950626,"BBD":2.21541,"BDT":94.608429,"BGN":1.956065,"BHD":0.413778,"BIF":2205.858929,"BMD":1.097442,"BND":1.4893,"BOB":7.543345,"BRL":5.043291,"BSD":1.097183,"BTC":2.3515602e-5,"BTN":82.863847,"BWP":12.61895,"BYN":3.573307,"BYR":21509.868167,"BZD":2.21162,"CAD":1.370321,"CDF":2208.053892,"CHF":1.016667,"CLF":0.030984,"CLP":854.940374,"CNY":6.983459,"COP":4065.474828,"CRC":728.183993,"CUC":1.097442,"CUP":29.08222,"CVE":110.677454,"CZK":24.344007,"DJF":195.037445,"DKK":7.437915,"DOP":60.414016,"DZD":157.424544,"EGP":20.015042,"ERN":16.461639,"ETB":56.024346,"EUR":1,"FJD":2.296453,"FKP":0.841693,"GBP":0.83679,"GEL":3.380255,"GGP":0.841693,"GHS":8.258236,"GIP":0.841693,"GMD":59.050437,"GNF":9745.287007,"GTQ":8.431176,"GYD":229.549701,"HKD":8.598191,"HNL":26.776913,"HRK":7.543161,"HTG":115.088967,"HUF":368.883491,"IDR":15724.701328,"ILS":3.522493,"IMP":0.841693,"INR":82.788575,"IQD":1602.814411,"IRR":46476.679775,"ISK":141.602723,"JEP":0.841693,"JMD":168.219758,"JOD":0.778075,"JPY":134.697868,"KES":126.3135,"KGS":94.124003,"KHR":4444.641411,"KMF":492.586457,"KPW":987.698412,"KRW":1332.986114,"KWD":0.334007,"KYD":0.914369,"KZT":513.083798,"LAK":12933.357367,"LBP":1661.527301,"LKR":323.562152,"LRD":167.497136,"LSL":16.027669,"LTL":3.240462,"LVL":0.663832,"LYD":5.11955,"MAD":10.698419,"MDL":20.104899,"MGA":4373.307126,"MKD":61.62383,"MMK":1951.018169,"MNT":3159.286899,"MOP":8.855015,"MRO":391.786696,"MUR":49.044292,"MVR":16.955233,"MWK":889.4741,"MXN":21.742086,"MYR":4.62846,"MZN":70.049873,"NAD":16.022551,"NGN":456.228434,"NIO":39.211697,"NOK":9.563496,"NPR":132.580511,"NZD":1.579247,"OMR":0.422429,"PAB":1.097183,"PEN":3.98426,"PGK":3.852232,"PHP":56.452503,"PKR":201.408102,"PLN":4.619558,"PYG":7598.428979,"QAR":3.995804,"RON":4.942776,"RSD":117.733868,"RUB":91.910784,"RWF":1122.683425,"SAR":4.116881,"SBD":8.797168,"SCR":15.816447,"SDG":490.007657,"SEK":10.344707,"SGD":1.488678,"SHP":1.511617,"SLL":13043.101586,"SOS":643.100936,"SRD":22.702807,"STD":22714.838919,"SVC":9.59969,"SYP":2756.775311,"SZL":16.025916,"THB":36.715482,"TJS":13.686689,"TMT":3.852022,"TND":3.281905,"TOP":2.472103,"TRY":16.121318,"TTD":7.450392,"TWD":31.406275,"TZS":2553.74839,"UAH":32.255597,"UGX":3900.310467,"USD":1.097442,"UYU":45.134003,"UZS":12527.30329,"VEF":234666321051.95837,"VND":25073.811885,"VUV":125.236383,"WST":2.877544,"XAF":654.199809,"XAG":0.044705,"XAU":0.000568,"XCD":2.965893,"XDR":0.794865,"XOF":651.331443,"XPF":119.977883,"YER":274.635243,"ZAR":16.011627,"ZMK":9878.29753,"ZMW":19.282054,"ZWL":353.375958}}
    // {"success":true,"timestamp":1671317283,"base":"EUR","date":"2022-12-17","rates":{"AED":3.893055,"AFN":92.949045,"ALL":114.398825,"AMD":420.405682,"ANG":1.91668,"AOA":534.604039,"ARS":182.778523,"AUD":1.585549,"AWG":1.90789,"AZN":1.806104,"BAM":1.95581,"BBD":2.147378,"BDT":110.925061,"BGN":1.956374,"BHD":0.400896,"BIF":2202.977373,"BMD":1.059939,"BND":1.442985,"BOB":7.348925,"BRL":5.626709,"BSD":1.063489,"BTC":6.334929e-5,"BTN":88.060996,"BWP":13.811958,"BYN":2.684472,"BYR":20774.806624,"BZD":2.143778,"CAD":1.456728,"CDF":2154.856601,"CHF":0.987671,"CLF":0.034053,"CLP":931.695931,"CNY":7.391172,"COP":5098.447634,"CRC":632.393505,"CUC":1.059939,"CUP":28.088387,"CVE":110.263867,"CZK":24.258869,"DJF":189.328055,"DKK":7.447349,"DOP":58.818396,"DZD":145.523505,"EGP":26.126732,"ERN":15.899087,"ETB":56.924815,"EUR":1,"FJD":2.338336,"FKP":0.870912,"GBP":0.872809,"GEL":2.809253,"GGP":0.870912,"GHS":9.571702,"GIP":0.870912,"GMD":65.716602,"GNF":9164.305874,"GTQ":8.369914,"GYD":222.507715,"HKD":8.251524,"HNL":26.25073,"HRK":7.549739,"HTG":154.742411,"HUF":406.052486,"IDR":16551.956199,"ILS":3.671315,"IMP":0.870912,"INR":87.692477,"IQD":1552.224057,"IRR":43881.47967,"ISK":151.469344,"JEP":0.870912,"JMD":163.250323,"JOD":0.751819,"JPY":144.909618,"KES":130.866056,"KGS":90.042235,"KHR":4369.955117,"KMF":492.133754,"KPW":953.921202,"KRW":1388.478248,"KWD":0.325232,"KYD":0.886291,"KZT":496.5149,"LAK":18386.111158,"LBP":1608.283481,"LKR":390.843386,"LRD":163.230993,"LSL":18.740128,"LTL":3.129725,"LVL":0.641147,"LYD":5.126247,"MAD":11.150985,"MDL":20.589689,"MGA":4709.901625,"MKD":61.614367,"MMK":2233.390261,"MNT":3635.329341,"MOP":8.524712,"MRO":378.398081,"MUR":46.902707,"MVR":16.327028,"MWK":1091.601788,"MXN":20.972489,"MYR":4.689705,"MZN":67.656314,"NAD":18.740123,"NGN":472.171476,"NIO":38.828601,"NOK":10.491331,"NPR":140.897553,"NZD":1.664216,"OMR":0.409396,"PAB":1.063489,"PEN":4.075658,"PGK":3.795561,"PHP":58.858816,"PKR":239.158844,"PLN":4.691152,"PYG":7673.221189,"QAR":3.858974,"RON":4.920771,"RSD":117.478392,"RUB":68.763591,"RWF":1130.458389,"SAR":3.983315,"SBD":8.695299,"SCR":13.823858,"SDG":603.105715,"SEK":11.035666,"SGD":1.440355,"SHP":1.459964,"SLE":19.836972,"SLL":19815.562085,"SOS":603.105714,"SRD":33.522735,"STD":21938.59964,"SVC":9.305904,"SYP":2662.529272,"SZL":18.707808,"THB":36.931499,"TJS":10.842589,"TMT":3.720386,"TND":3.345433,"TOP":2.489744,"TRY":19.756527,"TTD":7.219126,"TWD":32.631078,"TZS":2482.254505,"UAH":39.085899,"UGX":3892.460021,"USD":1.059939,"UYU":41.099578,"UZS":11980.506949,"VEF":1646972.326076,"VES":16.484438,"VND":25019.862773,"VUV":125.692746,"WST":2.871138,"XAF":655.950263,"XAG":0.045658,"XAU":0.000591,"XCD":2.864539,"XDR":0.799192,"XOF":655.950263,"XPF":119.640667,"YER":265.306569,"ZAR":18.694687,"ZMK":9540.727752,"ZMW":18.813607,"ZWL":341.299962}}
    // {"success":true,"timestamp":1672358823,"base":"EUR","date":"2022-12-30","rates":{"AED":3.916522,"AFN":93.317645,"ALL":114.106751,"AMD":419.291122,"ANG":1.921871,"AOA":537.096921,"ARS":188.519435,"AUD":1.575657,"AWG":1.922216,"AZN":1.796072,"BAM":1.960511,"BBD":2.153141,"BDT":109.489493,"BGN":1.955067,"BHD":0.401974,"BIF":2198.950743,"BMD":1.066416,"BND":1.438068,"BOB":7.368595,"BRL":5.63718,"BSD":1.066346,"BTC":6.4143655e-5,"BTN":88.258633,"BWP":13.671217,"BYN":2.692128,"BYR":20901.762636,"BZD":2.149433,"CAD":1.445506,"CDF":2163.225322,"CHF":0.984457,"CLF":0.033102,"CLP":913.374635,"CNY":7.426629,"COP":5171.991866,"CRC":624.150388,"CUC":1.066416,"CUP":28.260036,"CVE":110.960854,"CZK":24.1949,"DJF":189.523407,"DKK":7.435962,"DOP":60.039202,"DZD":146.562962,"EGP":26.403195,"ERN":15.996247,"ETB":57.166657,"EUR":1,"FJD":2.344356,"FKP":0.886326,"GBP":0.884342,"GEL":2.878924,"GGP":0.886326,"GHS":10.663875,"GIP":0.886326,"GMD":66.064251,"GNF":9357.804684,"GTQ":8.368282,"GYD":223.11008,"HKD":8.31149,"HNL":26.313787,"HRK":7.537328,"HTG":156.756313,"HUF":399.767404,"IDR":16667.182832,"ILS":3.754799,"IMP":0.886326,"INR":88.336235,"IQD":1557.501241,"IRR":44629.528852,"ISK":151.889788,"JEP":0.886326,"JMD":162.18937,"JOD":0.756408,"JPY":141.725661,"KES":131.605171,"KGS":91.370189,"KHR":4390.43698,"KMF":492.260725,"KPW":959.792548,"KRW":1344.388579,"KWD":0.326505,"KYD":0.888655,"KZT":492.190671,"LAK":18496.993557,"LBP":1616.03994,"LKR":389.764315,"LRD":164.758245,"LSL":18.257301,"LTL":3.14885,"LVL":0.645065,"LYD":5.150822,"MAD":11.157385,"MDL":20.426275,"MGA":4764.749077,"MKD":61.74623,"MMK":2239.411617,"MNT":3654.405884,"MOP":8.560563,"MRO":380.710493,"MUR":46.965311,"MVR":16.433506,"MWK":1090.943936,"MXN":20.766338,"MYR":4.717297,"MZN":68.069403,"NAD":18.25708,"NGN":477.306819,"NIO":38.785169,"NOK":10.544038,"NPR":141.212846,"NZD":1.681179,"OMR":0.410627,"PAB":1.066346,"PEN":4.038552,"PGK":3.759101,"PHP":59.420502,"PKR":241.490174,"PLN":4.67515,"PYG":7836.18941,"QAR":3.883089,"RON":4.949672,"RSD":117.305514,"RUB":78.915029,"RWF":1137.866364,"SAR":4.009334,"SBD":8.81351,"SCR":14.116585,"SDG":610.521465,"SEK":11.15109,"SGD":1.432939,"SHP":1.468884,"SLE":20.085936,"SLL":20155.271442,"SOS":606.255473,"SRD":33.925965,"STD":22072.667657,"SVC":9.330586,"SYP":2679.411831,"SZL":18.2568,"THB":36.872947,"TJS":10.866145,"TMT":3.743122,"TND":3.331465,"TOP":2.503146,"TRY":19.955425,"TTD":7.246704,"TWD":32.728563,"TZS":2486.88298,"UAH":39.38254,"UGX":3960.51731,"USD":1.066416,"UYU":42.712591,"UZS":11970.524181,"VEF":1787896.666841,"VES":17.896334,"VND":25188.756809,"VUV":126.522529,"WST":2.893824,"XAF":657.542539,"XAG":0.044668,"XAU":0.000587,"XCD":2.882044,"XDR":0.801332,"XOF":657.979241,"XPF":119.75609,"YER":266.870481,"ZAR":18.065844,"ZMK":9599.019087,"ZMW":19.279938,"ZWL":343.385665}}

    var countriesToCheck = [
        { name: 'Slowakei', countryCode: 'SK', lang: 'sk' },
        { name: 'Italien', countryCode: 'IT', lang: 'it' },
        { name: 'Slowenien', countryCode: 'SI', lang: 'sl' },
        { name: 'Tschechien', countryCode: 'CZ', lang: 'cs', exchangeRateReference: 'CZK' },
        { name: 'Ungarn', countryCode: 'HU', lang: 'hu', exchangeRateReference: 'HUF' },
        { name: 'Kroatien', countryCode: 'HR', lang: 'hr' }
    ].sort((a, b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0; // names must be equal
    });

    // original class: range-revamp-pip-price-package, then pip-pip-price-package, then ?
    var priceGroupStyle = "-webkit-text-size-adjust: 100%;\
    font: 100% sans-serif;\
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important;\
    font-family: var(--ikea-font);\
    color: #484848;\
    line-height: 1.571;\
    -webkit-box-direction: normal;\
    box-sizing: inherit;\
    outline: none;\
    margin: 0;\
    padding: 0;\
    font-size: 0.875rem !important;"; // overriden
    // original class: range-revamp-pip-price-package__wrapper, then pip-pip-price-package__wrapper, then ?
    var priceWrapperStyle = "-webkit-text-size-adjust: 100%;\
    font: 100% sans-serif;\
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important;\
    font-family: var(--ikea-font);\
    color: #484848;\
    line-height: 1.571;\
    -webkit-box-direction: normal;\
    font-size: 0.875rem !important;\
    box-sizing: inherit;\
    outline: none;\
    margin: 0;\
    padding: 0;\
    display: flex;\
    -webkit-box-pack: justify;\
    justify-content: space-between;";
    // original class: range-revamp-pip-price-package__content-left, then pip-pip-price-package__content-left, then ?
    var priceContentLeftStyle = "-webkit-text-size-adjust: 100%;\
    font: 100% sans-serif;\
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important;\
    font-family: var(--ikea-font);\
    -webkit-box-direction: normal;\
    box-sizing: inherit;\
    outline: none;\
    margin: 0;\
    padding: 0;\
    font-weight: 400;\
    margin-right: 4px;\
    font-size: .875rem;\
    line-height: 1.42857;\
    color: #484848;\
    width: auto;";
    // original class: pip-link, then pip-link-button
    var priceCountryLink = "-webkit-text-size-adjust: 100%;\
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important;\
    box-sizing: inherit;\
    outline: none;\
    margin: 0;\
    overflow: visible;\
    text-transform: none;\
    -webkit-appearance: button;\
    position: relative;\
    font-family: inherit;\
    cursor: pointer;\
    color: rgb(var(--colour-text-and-icon-2, 72, 72, 72));\
    font-size: .875rem;\
    line-height: 1.571;\
    border: none;\
    width: fit-content;\
    background: rgba(0,0,0,0);\
    padding: 0;\
    text-align: inherit;\
    text-decoration: underline;";
    // original class: range-revamp-pip-price-package__main-price, then pip-pip-price-package__main-price, then pip-temp-price?
    var pricePriceGroup = "-webkit-text-size-adjust: 100%;\
    font: 100% sans-serif;\
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important;\
    font-family: var(--ikea-font);\
    color: #484848;\
    line-height: 1.571;\
    -webkit-box-direction: normal;\
    font-size: 0.875rem !important;\
    white-space: nowrap;\
    text-align: left;\
    box-sizing: inherit;\
    outline: none;\
    margin: 0;\
    padding: 0;";
    // original class: range-revamp-price, then pip-price
    var pricePriceGroupSpan = "    -webkit-text-size-adjust: 100%;\
    font: 100% sans-serif;\
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important;\
    font-family: var(--ikea-font);\
    line-height: 1.571;\
    -webkit-box-direction: normal;\
    text-align: left;\
    box-sizing: inherit;\
    outline: none;\
    display: inline-block;\
    color: #000;\
    font-size: 1rem;\
    white-space: pre;\
    font-weight: normal;";
    // original class: PriceRow_row__Q3m-v, elements: div over 'Preis ohne USt' or 'USt.'
    var sumPriceCountryContainer = "    -webkit-text-size-adjust: 100%; \
    font: 100% sans-serif; \
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important; \
    font-family: var(--ikea-font); \
    color: rgb(var(--colour-text-and-icon-2, 72, 72, 72)); \
    font-size: .875rem; \
    line-height: 1.571; \
    box-sizing: inherit; \
    outline: none; \
    margin: 0; \
    padding: 0; \
    display: flex; \
    justify-content: space-between; \
    margin-top: 1.25rem;";
    // original class: list-ingka-price list-ingka-price--leading list-ingka-price--fixed-size list-ingka-price--leading list-ingka-price--small list-ingka-price--regular-font-weight PriceRow_priceCustomSize__G1QU3
    // span -> span (this) -> span symbol, span price
    var sumPriceCountryPriceContainer = "    -webkit-text-size-adjust: 100%; \
    font: 100% sans-serif; \
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important; \
    font-family: var(--ikea-font); \
    box-sizing: inherit; \
    outline: none; \
    line-height: 1; \
    position: relative; \
    color: rgb(var(--colour-text-and-icon-1,17,17,17)); \
    font-weight: 400; \
    font-size: .875rem;";
    // original class: list-ingka-price__currency
    var sumPriceCountryPriceContainerCurrency = "    -webkit-text-size-adjust: 100%; \
    font: 100% sans-serif; \
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important; \
    font-family: var(--ikea-font); \
    color: rgb(var(--colour-text-and-icon-1,17,17,17)); \
    font-weight: 400; \
    box-sizing: inherit; \
    outline: none; \
    margin-inline-end: .125rem; \
    position: relative; \
    unicode-bidi: bidi-override; \
    font-size: 1em; \
    line-height: 1; \
    top: auto;";
    // original class: list-ingka-price__integer
    var sumPriceCountryPriceContainerPrice = "    -webkit-text-size-adjust: 100%; \
    font: 100% sans-serif; \
    --ikea-font: 'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', system-ui, sans-serif !important; \
    font-family: var(--ikea-font); \
    line-height: 1; \
    color: rgb(var(--colour-text-and-icon-1,17,17,17)); \
    font-weight: 400; \
    font-size: .875rem; \
    box-sizing: inherit; \
    outline: none;";

    // add style for button to sort, was .hnf-link .hnf-btn .hnf-btn-change-country
    var css = '.janSortButton { \
        background: none;  \
        border-radius: 64px;  \
        box-sizing: border-box; \
        box-shadow: inset 0 0 0 1px rgb(146,146,146);; \
        cursor: pointer; \
        font-size: .75rem;  \
        font-weight: 700;  \
        text-align: center;  \
        line-height: 1.3333333333;  \
        position: relative;  \
        text-decoration: none !important;  \
        width: 100%; \
        display: inline-flex; \
        justify-content: center; \
        align-items: center; \
        padding: 0 1.5rem; \
        min-height: 2.5rem; \
        transition-property: opacity, margin-right, margin-left, transform; \
        transition-duration: 200ms; \
        transition-timing-function: cubic-bezier(0.4, 0, 0.4, 1); \
        -webkit-user-select: none; /* Safari */ \
        -ms-user-select: none; /* IE 10 and IE 11 */ \
        user-select: none; /* Standard syntax */ \
     } \
     .janSortButton:hover { \
        box-shadow: inset 0 0 0 2px rgb(146,146,146);; \
     } \
     .janSortButton:active { \
        background: rgba(var(--colour-interactive-secondary-bg-pressed, 204, 204, 204), 0.5); \
     } \
     .janSortButton:active:not(:disabled) { \
        transform: scale(0.97); \
     }\
     .tooltip { \
        position: relative; \
        display: inline-block; \
      } \
      .tooltip .tooltiptext { \
        visibility: hidden; \
        width: 120px; \
        background-color: black; \
        color: #fff; \
        text-align: center; \
        border-radius: 6px; \
        padding: 5px 0; \
        position: absolute; \
        z-index: 1; \
        bottom: 100%; \
        left: 50%; \
        margin-left: -60px; \
      } \
      .tooltip .tooltiptext::after { \
        content: ""; \
        position: absolute; \
        top: 100%; \
        left: 50%; \
        margin-left: -5px; \
        border-width: 5px; \
        border-style: solid; \
        border-color: black transparent transparent transparent; \
      } \
      .tooltip:hover .tooltiptext { \
        visibility: visible; \
      } \
     ',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    head.appendChild(style);
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    var productID, favouritesList, counters, sums;
    // this url will not work for wishlist, because it's some sort of single page
    runDefaultWebsite();

    // need to recognize when navigated to a new page and check the script again. wishlist will not work without it. probably because its some sort of a sub singel page.
    window.navigation.addEventListener("navigate", (event) => {
        // checks here too for the favourites url
        var isFavouritesWishlist = event.destination.url.match(/.*\/favourites\/.+/g);
        // ignore event traverse. when going back in history, both traverse and replace are called.
        if ((event.navigationType == 'push' || event.navigationType == 'replace') && isFavouritesWishlist) {
            favouritesList = isFavouritesWishlist;
            runFavouritesWebsite();
        }
    })

    function runDefaultWebsite() {
        productID = window.location.href.match(/\w*\d{8}/g);
        // is needed for when a specific wishlist is opened directlly.
        favouritesList = window.location.href.match(/.*\/favourites\/.+/g);
        counters = [];
        sums = [];
        resetSumValues();

        main();
    }

    function runFavouritesWebsite() {
        counters = [];
        sums = [];
        resetSumValues();
        main();
    }

    async function main() {
        // when product page is open
        if (productID) {
            var customSelector = '.customElementIkeaPrices';
            // find title, description, price and stars
            jQuery('.js-price-package')
                .after('<div class=' + customSelector.slice(1) +
                    ' style="' + priceGroupStyle + ' display:none;"></div>');
            jQuery(customSelector).after('<div class="' + customSelector.slice(1) + 'NA" style="' + priceGroupStyle + ' display:none;"></div>');

            productID = productID.toString().toUpperCase();

            // by default use saved rates
            var usedRates = backupResponse;
            // check if new rates are available
            var xrResponse = await getExchangeRates();
            if (xrResponse?.response?.success) {
                console.log('rates from ', new Date(xrResponse.response.timestamp * 1000).toString());
                console.log('new complete rates: ', xrResponse.responseText);

                var newRatesResponse = xrResponse.response;
                Object.keys(newRatesResponse.rates)
                    .filter(property => !["CZK", "HUF"].includes(property))
                    .forEach(property => delete newRatesResponse.rates[property])
                console.log('new rates (short)');
                console.log("var backupResponse = JSON.parse('" + JSON.stringify(newRatesResponse) + "');");
                usedRates = newRatesResponse;
            } else {
                console.log('couldn\'t get new rates. using old exchange rates from:', new Date(backupResponse.timestamp * 1000).toString(), '. Check that your browser doesn\'t force HTTPS. The API doesn\'t support it on the free model.', xrResponse);
            }

            // get price and print it for every country in list
            for (const country of countriesToCheck) {
                // if a country has the attribute 'exchangeRateReference', check and replace with the actual value
                if (country?.exchangeRateReference) {
                    country.exchangeRateReference = usedRates.rates[country.exchangeRateReference];
                }
                // get new price from other country
                var countryPriceDate = await getPriceFromOtherCountryAsync(country.countryCode, country.lang, productID, country?.exchangeRateReference);
                // print the price on the website
                printNewPrice(country.name, countryPriceDate, customSelector);
            }

            // create element for sort the prices
            jQuery(customSelector + 'NA').after('<div style="margin-top: 12px; padding: 0 0 1rem; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; flex-wrap: wrap;">' +
                '<div style="width: 50%; padding-right: 0.5rem; padding-left: 0.0rem;">' +
                '<a id="sortByPrice" class="janSortButton">sortieren nach Preis</a>' +
                '</div>' +
                '<div style="width: 50%; padding-right: 0.0rem; padding-left: 0.5rem;">' +
                '<a id="sortByCountry" class="janSortButton">sortieren nach Land</a>' +
                '</div>' +
                '</div>');
            jQuery('#sortByPrice').click(function () { sortIkeas(getFancyTextPrice, customSelector) });
            jQuery('#sortByCountry').click(function () { sortIkeas(getFancyTextCountry, customSelector) });
        }
        // when wishlist is open
        if (favouritesList) {
            // .ProductCard_productCard__ARvOv: is class of div element that contains each the product name, details, id and price per piece
            // only when those details are available, then we know all data(items of wishlist) are loaded
            waitForKeyElements(".ProductCard_productCard__ARvOv", getPriceForEachItemOnWishlistAfterLoad);

            // event when click to switch between online and in-store. the sum of countries need to be resetted. otherwise it will be added again
            waitForKeyElements('button.ListSwitch_wrapper__r1bNq', (elem) => {
                elem.on("click", function (param) {
                    if (param?.target?.dataset?.testid == "in-store-online") {
                        resetSumValues();
                    }
                })
            })
        }
    }

    function getPriceForEachItemOnWishlistAfterLoad(divElementProductInfos) {
        // each element in the "list" has the id of the product in the html elements property data.testid="item-12345678"
        var productId = divElementProductInfos[0]?.dataset?.testid?.match(/(?<=item-)\d{8}$/g)[0];
        if (productId) {
            var customSelector = '.customElementIkeaPricesPerProduct' + productId;
            jQuery('button.list-ingka-rating', divElementProductInfos)
                .after('<div class=' + customSelector.slice(1) + ' style="' + priceGroupStyle + ' display:none;"></div>');
            jQuery(customSelector).after('<div class="' + customSelector.slice(1) + 'NA" style="' + priceGroupStyle + ' display:none;"></div>');

            // get price and print it for every country in list
            for (const country of countriesToCheck) {

                // only for the first time, (after the lements are loaded) create the sum entry on the right
                if (counters[country.countryCode] == 0) {
                    // find element which contains the text 'Normalpreis'
                    jQuery('div.PriceSummary_wrapper__B3uv_ > :last-child')
                        .after('<div style="' + sumPriceCountryContainer + '">\
                    <span>Normalpreis '+ country.name + '</span>\
                    <span>\
                        <span id="priceMissingDisclaimer'+ country.name + '" style="color:red!important; display:none;" class="tooltip">Preis enthält möglicherweise nicht alle Produkte\
                            <span class="tooltiptext" id="priceMissingDisclaimerTooltip'+ country.name + '" style="display:none;">Fehlen:</span>\
                        </span>\
                        <span style="'+ sumPriceCountryPriceContainer + '">\
                            <span>\
                                <span style="'+ sumPriceCountryPriceContainerCurrency + '">€</span>\
                                <span class="sum'+ country.countryCode + '" style="' + sumPriceCountryPriceContainerPrice + '">0</span>\
                            </span>\
                        </span>\
                    </span>\
                    </div>');
                }
                counters[country.countryCode]++;  // might not be needed anymore
                doo(divElementProductInfos, productId, country, customSelector);
            }
        } else {
            console.log('no id found. it seems the first 4 hits are placeholder while the real items are loading. element', divElementProductInfos);
        }
    }

    async function doo(element, productId, country, customElementIkeaPricesPerProduct) {
        var otherPrice = await getPriceFromOtherCountryAsync(country.countryCode, country.lang, productId, backupResponse.rates[country?.exchangeRateReference]);

        // want the information of how many of this product are saved in the list
        var quantity = jQuery('div > input', element)[0].value;
        quantity = parseFloat(quantity) ? parseFloat(quantity) : 0;
        otherPrice.priceData.quantity = quantity;

        // calculate the actual price now, because just the total price is shown, no price per product anymore
        if (otherPrice.priceData?.price) {
            otherPrice.priceData.price = parseFloat(otherPrice?.priceData?.price * quantity).toFixed(2);
        }
        printNewPrice(country.name, otherPrice, customElementIkeaPricesPerProduct);

        // total price of the whole list
        var price = parseFloat(otherPrice?.priceData?.price);
        // if no price, add disclaimer and tooltip
        if (price) {
            sums[country.countryCode] = sums[country.countryCode] + price;
        } else {
            sums[country.countryCode] = sums[country.countryCode];
            jQuery(('#priceMissingDisclaimer' + country.name)).show();

            var tooltip = jQuery(('#priceMissingDisclaimerTooltip' + country.name));
            tooltip.show();
            tooltip[0].innerHTML = tooltip[0].innerHTML + "<br>" + productId;
        }
        var viewValue = sums[country.countryCode] == 0 ? "n.a." : sums[country.countryCode].toFixed(2);
        jQuery('.sum' + country.countryCode)[0].innerText = viewValue;
    }

    function resetSumValues() {
        for (const country of countriesToCheck) {
            // sum of all items on wishlist including their selected quantitiy
            sums[country.countryCode] = 0;

            // count elements on wishlist
            // only for the first time, set an init value
            if (!counters[country.countryCode]) {
                counters[country.countryCode] = 0;
            }
        }
    }

    function getExchangeRates() {
        return new Promise(function (resolve) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.exchangeratesapi.io/v1/latest?access_key=' + access_key + '&base=EUR',
                responseType: 'json',
                onload: function (response) {
                    resolve(response);
                }
            })
        });
    }

    function sortIkeas(property, customSelector) {
        var parent = jQuery(customSelector);
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
            if (isNumber(vA) && isNumber(vB)) {
                return (+vA < +vB) ? -1 : (+vA > +vB) ? 1 : 0;
            } else {
                return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
            }
        });
        parent.append(items);
    };

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }

    function getPriceFromOtherCountryAsync(countryCode, lang, productID, exchangeRate = 1) {
        return new Promise(function (resolve) {

            // alternative link from web product catalog
            // var urlOtherIkea = 'https://publications-ext.ikea.com/'+country.toLowerCase()+'/'+lang+'/products/ART%2C'+productID;
            var urlOtherIkea = 'https://www.ikea.com/' + countryCode.toLowerCase() + '/' + lang + '/catalog/products/' + productID;
            console.log('link ', countryCode, urlOtherIkea);

            GM_xmlhttpRequest({
                method: 'GET',
                url: urlOtherIkea,
                responseType: 'document',
                onload: function (responseDetails) {
                    // alternative link from web product catalog
                    // var priceDiv = jQuery('.product-price',jQuery(responseDetails.responseText));
                    // alternative: search for the right class without nowing the prefix
                    // var priceDiv = jQuery('[class*="package__main-price"]', jQuery(responseDetails.responseText));
                    // get the price info text like "Cena € 54,90"
                    var responseObj = {};

                    // console.log('addon price ', jQuery('.pip-temp-price-module__addons', jQuery(responseDetails.responseText)).find('.pip-temp-price__sr-text').length)
                    // console.log('regular price ', jQuery('.pip-temp-price-module__price', jQuery(responseDetails.responseText)).find('.pip-temp-price__sr-text'))
                    // console.log('addon price ', jQuery('.pip-temp-price-module__addons > .pip-temp-price__sr-text', jQuery(responseDetails.responseText)))
                    // console.log('regular price ', jQuery('.pip-temp-price-module__price > .pip-temp-price__sr-text', jQuery(responseDetails.responseText)))

                    // PRIO-1 disabled the family price for now, because it breaks if a product contains multiple pieces. Then a product also contains price-module__addons to show the price each.
                    // var priceDiv;
                    // var priceDivAddon = jQuery('.pip-temp-price-module__addons', jQuery(responseDetails.responseText)).find('.pip-temp-price__sr-text');
                    // if (priceDivAddon.length != 0) {
                    //     console.log('family price exists for country', countryCode);
                    //     priceDiv = priceDivAddon;
                    // } else {
                    //     priceDiv = jQuery('.pip-temp-price-module__price', jQuery(responseDetails.responseText)).find('.pip-temp-price__sr-text')
                    // }
                    var priceDiv = jQuery('.pip-temp-price__sr-text', jQuery(responseDetails.responseText));
                    // console.log('priceDiv',priceDiv)
                    if (priceDiv[0]) {
                        var priceFloat = parseFloat(priceDiv[0].innerText.replace(/\/.*|[^0-9,]/g, '').replace(',', '.'));
                        // console.log('priceFloat', priceFloat)
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

                        responseObj.priceData = { price: pricePrint, exchangeText: exchangeText, link: urlOtherIkea };
                    } else {
                        responseObj.priceData = { link: urlOtherIkea };
                    }

                    // var availableDiv = jQuery('.js-stockcheck-section .pip-stockcheck__text', jQuery(responseDetails.responseText));
                    // console.log('ggg', availableDiv);
                    // console.log('ggg', availableDiv[0].dataset);
                    //  availability is a seperate get call to https://api.ingka.ikea.com/cia/availabilities/ru/at?itemNos=70525679&expand=StoresList,Restocks,SalesLocations
                    // curl --location --request GET 'https://api.ingka.ikea.com/cia/availabilities/ru/at?itemNos=70525679&expand=StoresList,Restocks,SalesLocations' \
                    // --header 'accept: application/json;version=2' \
                    // --header 'x-client-id: b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631' \
                    // --header 'Cookie: _abck=6293D0F276F25CDE9BE3B7C2472A7248~-1~YAAQHE4SAnMpQFWFAQAAtGGHVgkbl6ichNQkStBJF7+ZYAvr7zjUQyvpMRVo7tn/Q3DbeUJWj6TVfU27uQKRulAGyRzT+cFJZfkxiX1ki5yf+Yo4R6/OaxB1PmB0a/uuuFxkztBP11vjlqx02iQV2gNLlmKigDsEu0UvePNJ324Cvi3CzHIfFXL8/b+uILsE72BP1TmfReXc0NTiPZ8A78ZPv+sTqU8kYGAigbYIdaMtY43n8j0L6sKgMry7trcKyB79POZIAIsCBggg/VGVLwfS97TkviryaOWNNg3K0DjMycBPPVWaNoP0x8JPuT+/IwMslvJcW/SCu3+9jNWndY0VnvfKuLW3oSju2zDjn9qc4n5yPuDh~-1~-1~-1; bm_sz=0A4CC74F65AAD582242BE8B8F2D7A414~YAAQHE4SAnUpQFWFAQAAtGGHVhJkpqmgfbviom5+QwA5EHqJKV8vJHvi/GfiSz9sThsLRKBLaQSHQWo2opd0sVpg1B1eNIqgn8elxod/doqaV1lUJ/FcieFRRy0To+mx7xn7SlIl4kJwluYVxEsHSw+2XJpVMupBoWYNNdbiJfahh77u+7237nhnTmMoLkFCeFgXDXgXKMNzGHKvfp0SXtWyqIg6pUXEomsv/Vedjcse+tj5z76hUPrb0dHLQu8+4C5Nz1jcZeW+BMbJMlIWg9ccIydJz+zxaIA6fufMDtgn~3420229~3160369; ak_bmsc=11AB1498BB32800E8369B9C562A954ED~000000000000000000000000000000~YAAQHE4SAlflQFWFAQAANW2MVhLb/KrjlaJbNqRTmBHD7lq6qpilXbA4ah4OJUQ8Pt1PGJ3ZnTuEgCsjANuZ4JStgqRnxucRmMdGy+RMewd91IMGClWcYCKKZVXh3jSMsQ9Lw1U6/FqvtfMLsD2M2KfQ8X6hdwojGfgxQiJfICiro5DfNmZ+LTX7w3dwu70rKkQi2VDnWWhkkJm10gx5aOqhzAmNXvOBN0S/pkasRKdseCT3xEdm5eT/bqRPtTY+/bSU/E3QXKDxXmTHomncSAir++mdGqukM0dQYx1GZ8NJ7i90haQveFul8VEgBCryo8csLTk58PiUGjGS/N45F3d4euCE4FkwrNAH+zrrFstk2jy1nuFVbBhV5I7/XjC5qgGW+EUzuDyJPjjwFa694/rRIBCB; bm_sv=260AC2533B9AC9F2C4D9F9CE66748E1A~YAAQHE4SAq7sQFWFAQAA3J+MVhKKhwAnfJJF1NLtu9n6CbQD3UYelwsf37w6IDlfVs0cayy4VNbbX8pvLhYVXLEtLPbd0vdfXP6VshwQ49gFF0vBgtL4RVwLewCBT7Tqc/siURwqxgFP6Ovjv/6INi4LgXC6OOA6w+m01TxKxMd/p5kO9/BKxbmfzwuCOrjWmke03r3NK+GkBKGOl+P5lIw4HBDyzCOEPJLGDBEhwvPODHHdH+pNg8ALLW7LdyHU2jj1504=~1'
                    // if (availableDiv[0].dataset.analyticsAction) {
                    //     if (availableDiv[0].dataset.analyticsAction.includes('Available')) {
                    //         console.log(availableDiv[0].dataset.analyticsAction);
                    //     }
                    // }

                    resolve(responseObj);
                }
            });
        });
    }

    function printNewPrice(countryName, productData, customSelector) {
        var priceData = productData.priceData;
        var urlOtherIkea = priceData?.link;
        if (priceData?.price) {
            var price = priceData.price;
            var exchangeText = priceData.exchangeText;
            jQuery(customSelector).show();
            jQuery(customSelector).append('<div style="' + priceWrapperStyle + '">' +
                '<div style="' + priceContentLeftStyle + '">' +
                '<span><a style="' + priceCountryLink + '" target="_blank" rel="noopener noreferrer" href="' + urlOtherIkea + '">Ikea ' + countryName +
                '</a>' + exchangeText + '<span></div>' +
                '<div style="' + priceWrapperStyle + '"><div style="' + pricePriceGroup + '">' +
                '<span style="' + pricePriceGroupSpan + '" style="font-weight: normal;">' +
                '<span style="margin-right: 0.0625rem; font-size: 0.625rem; vertical-align: text-top;">€ </span>' +
                '<span style="font-size: 1rem; vertical-align: text-bottom;">' + price.split(".")[0] + '</span>' +
                '<span style="font-size: 0.625rem; vertical-align: text-top; margin-left: .0625rem;">,' + price.split(".")[1] +
                '</span>' +
                '</span></div></div></div>');
        } else {
            jQuery(customSelector + 'NA').show();
            jQuery(customSelector + 'NA').append('<div style="' + priceWrapperStyle + '">' +
                '<div style="' + priceContentLeftStyle + '">' +
                '<span><a style="' + priceCountryLink + '" target="_blank" rel="noopener noreferrer" href="' + urlOtherIkea + '">Ikea ' + countryName +
                '</a><span></div>' +
                '<div style="' + priceWrapperStyle + '"><div style="' + pricePriceGroup + '">' +
                '<span style="' + pricePriceGroupSpan + '" style="font-weight: normal;">' +
                '<span style="vertical-align: text-bottom;">n.a.</span>' +
                '</span></div></div></div>');
        }
        sortIkeas(getFancyTextCountry, customSelector);
        sortIkeas(getFancyTextCountry, customSelector + 'NA');
    }

})();