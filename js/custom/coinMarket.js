var CoinMarket = (function () {

  var Service = null;
  var NormalizerService = null;

  var COIN_MARKET_KEY = 'coinMarket';
  var COIN_MAREKT_TOP_KEY = 'coinTopMarket';
  var COIN_GLOBAL_MARKET = 'coinGlobalMarket';
  var COIN_TOP_MARKET_LIMIT = 5;
  var EXCLUDE_CURRENCIES_COIN_MARKET = ['bgn', 'hrk', 'isk', 'ron'];
  var serverData = {};
  var currencyDetails = {};
  var coinGlobalMarketElements = {
    totalMarketCap: ['mTrendtotalMarketCap', ''],
    total24hVolume: ['mTrendtotal24HrsVol', ''],
    bitcoinPerMarketCap: ['mTrendbitcoinMarketCap', '']
  };
  var coinTopMarketElements = {
    trendMarket0: ['mTrendMarket0', ''],
    trendMarket1: ['mTrendMarket1', ''],
    trendMarket2: ['mTrendMarket2', ''],
    trendMarket3: ['mTrendMarket3', ''],
    trendMarket4: ['mTrendMarket4', ''],
    trendPrice0: ['mTrendPrice0', ''],
    trendPerChnge0: ['mTrendPerChnge0', 'trendPerChnge0Class'],
    trendPrice1: ['mTrendPrice1', ''],
    trendPerChnge1: ['mTrendPerChnge1', 'trendPerChnge1Class'],
    trendPrice2: ['mTrendPrice2', ''],
    trendPerChnge2: ['mTrendPerChnge2', 'trendPerChnge2Class'],
    trendPrice3: ['mTrendPrice3', ''],
    trendPerChnge3: ['mTrendPerChnge3', 'trendPerChnge3Class'],
    trendPrice4: ['mTrendPrice4', ''],
    trendPerChnge4: ['mTrendPerChnge4', 'trendPerChnge4Class']
  };

  function init () {
    Service = Services(PBConstants.BASE_API_URL, PBConstants.MARKET_CAP_API_URL, PBConstants.CURRENCIES_API_URL, PBConstants.GLOBAL_MARKET_CAP_API_URL);
    NormalizerService = Service.Normalizer;
  }

  /**
   * It calls the coin market API for every 20 minutes.
   * @param {*} data 
   */
  function callCoinMarket (data) {
    data = data || serverData;
    if (!data.settings) {
      return false;
    }

    getCoinMarketCrncy(data);

    Service.getMarketCap(PBConstants.MARKET_CAP_CONVERT, PBConstants.MARKET_CAP_LIMIT).done(function (response) {
      normalizeMarketCapData(response);
    });

    Service.getMarketCap(currencyDetails.currency, COIN_TOP_MARKET_LIMIT).done(function (response) {
      normalizeTopMarketCapData(response);
    });

    Service.getGlobalMarketCap(currencyDetails.currency).done(function (response) {
      normalizeGlobalMarketData(response);
    });

    setTimeout(callCoinMarket, PBConstants.COIN_MARKET_REFRESH);
  }

  function normalizeGlobalMarketData (globalMarketCap) {
    var coinGlobalMarketCap =
      getGlobalMarketCapDetails(globalMarketCap);
    if (coinGlobalMarketCap === false) {
      // Error, set old data if present otherwise reset everything.
      var oldCoinGlobalMarketCap = getCoinMarketLocalStorage(COIN_GLOBAL_MARKET);
      if (oldCoinGlobalMarketCap) {
        coinGlobalMarketCap = oldCoinGlobalMarketCap;
      } else {
        coinGlobalMarketCap = NormalizerService.getDefaultCoinGlobalMarket();
      }
    }
    setCoinMarketLocalStorage(COIN_GLOBAL_MARKET, coinGlobalMarketCap);
  }

  function getDefaultCoinGlobalMarket () {
    return {
      'total_market_cap': 0,
      'total_24h_volume': 0,
      'bitcoin_percentage_of_market_cap': 0
    };
  }

  function getGlobalMarketCapDetails (coinGlobalMarketCap) {
    if (!coinGlobalMarketCap) {
      return false;
    }
    try {
      var currency = currencyDetails.currency.toLowerCase();

      var globalMarket = {
        'total_market_cap': coinGlobalMarketCap['total_market_cap_' + currency],
        'total_24h_volume': coinGlobalMarketCap['total_24h_volume_' + currency],
        'bitcoin_percentage_of_market_cap': coinGlobalMarketCap['bitcoin_percentage_of_market_cap'],
      };
      return globalMarket;
    } catch (e) {
      console.log('Error while processing data from global market cap API.');
      console.log(e);
      return false;
    }
  }

  /**
   * It normalizes the coin market data.
   * @param {*} marketCapData 
   */
  function normalizeMarketCapData (marketCapData) {
    var coinMarketCap =
      NormalizerService.marketCap(marketCapData, PBConstants.MARKET_CAP_CURRENCY);
    if (coinMarketCap === false) {
      // Error, set old data if present otherwise reset everything.
      var oldCoinMarketCap = getCoinMarketLocalStorage(COIN_MARKET_KEY);
      if (oldCoinMarketCap) {
        coinMarketCap = oldCoinMarketCap;
      } else {
        coinMarketCap = NormalizerService.getDefaultCoinMarket();
      }
    }
    setCoinMarketLocalStorage(COIN_MARKET_KEY, coinMarketCap);
  }

  function normalizeTopMarketCapData (coinTopMarketCapData) {
    var coinTopMarketCap =
      getCoinTopMarketCapDetails(coinTopMarketCapData);
    if (coinTopMarketCap === false) {
      // Error, set old data if present otherwise reset everything.
      var oldCoinTopMarketCap = getCoinMarketLocalStorage(COIN_MAREKT_TOP_KEY);
      if (oldCoinTopMarketCap) {
        coinTopMarketCap = oldCoinTopMarketCap;
      } else {
        coinTopMarketCap = getDefaultCoinTopMarket();
      }
    }
    setCoinMarketLocalStorage(COIN_MAREKT_TOP_KEY, coinTopMarketCap);
  }

  function getCoinTopMarketCapDetails (coinTopMarketCapData) {
    if (!coinTopMarketCapData) {
      return false;
    }
    try {
      var currency = currencyDetails.currency.toLowerCase();
      var coinTopMarkets = {
      };

      // Loop over through API data.
      var totalRecords = coinTopMarketCapData ? coinTopMarketCapData.length : 0;
      for (var i = 0; i !== totalRecords; ++i) {
        var currentCap = coinTopMarketCapData[i];
        coinTopMarkets['trendPrice' + i] = +currentCap['price_' + currency];
        coinTopMarkets['trendPerChnge' + i] = +currentCap['percent_change_24h'];
        coinTopMarkets['trendMarket' + i] = currentCap.symbol;
      }
      return coinTopMarkets;
    } catch (e) {
      console.log('Error while processing data from top market cap API.');
      console.log(e);
      return false;
    }
  }

  function getCoinMarketCrncy (data) {

    var currencyInLC = data.settings.currency.toLowerCase();

    var currencyDetailsTmp = {
      currency: PBConstants.MARKET_CAP_CONVERT,
      isValidCoinMarketCurrency: false
    };

    // Coin market doesn't support some currencies, if current currency belongs to exclude currencies array
    // then we should consider usd as currency.
    if (EXCLUDE_CURRENCIES_COIN_MARKET.indexOf(currencyInLC) === -1) {
      currencyDetailsTmp.currency = currencyInLC;
      currencyDetailsTmp.isValidCoinMarketCurrency = true;
    }
    currencyDetails = currencyDetailsTmp;
  }

  function getCoinMarketLocalStorage (key) {
    var value = localStorage.getItem(key);
    value = value ? JSON.parse(value) : '';
    return value;
  }

  /**
   * It checks whether localstorage has coin market data 
   * if it is not there then it returns data with default coin market data.
   * @param {*} data 
   */
  function getCoinMarketData (data) {

    if (!data.settings) {
      return false;
    }
    serverData = data;
    var coinMarket = getCoinMarketLocalStorage(COIN_MARKET_KEY);
    if (!coinMarket) {
      coinMarket = NormalizerService.getDefaultCoinMarket();
    }

    var coinTopMarket = getCoinMarketLocalStorage(COIN_MAREKT_TOP_KEY);
    if (!coinTopMarket) {
      coinTopMarket = getDefaultCoinTopMarket();
    }

    var coinGlobalMarket = getCoinMarketLocalStorage(COIN_GLOBAL_MARKET);
    if (!coinGlobalMarket) {
      coinGlobalMarket = getDefaultCoinGlobalMarket();
    }

    data.coinMarketCap = coinMarket;
    data.coinTopMarket = coinTopMarket;
    data.coinGlobalMarket = coinGlobalMarket;
    return data;
  }

  function getDefaultCoinTopMarket () {
    var defaultCoinTopMarketObj = {};

    // Generate default coin top market data.
    for (var i = 0; i < COIN_TOP_MARKET_LIMIT; i++) {
      defaultCoinTopMarketObj['trendPrice' + i] = 0;
      defaultCoinTopMarketObj['trendPerChnge' + i] = 0;
    }
    return defaultCoinTopMarketObj;
  }

  function setCoinMarketLocalStorage (key, response) {
    localStorage.setItem(key, JSON.stringify(response));
  }

  function normalizeTopMarketCapDataToDisplay (summary, data) {
    if (!data.coinTopMarket) {
      return false;
    }
    var precision = 2;
    var coinTopMarketCapValues = data.coinTopMarket;

    var trendCurrency = currencyDetails ? currencyDetails.currency.toUpperCase() : '';

    // Generate classes for coin five market values and normalize values.
    for (var i = 0; i < COIN_TOP_MARKET_LIMIT; i++) {
      summary['trendPrice' + i] = NormalizerService.normalizeValuesWithCommas(coinTopMarketCapValues['trendPrice' + i], precision)
        + ' ' + trendCurrency;
      summary['trendPerChnge' + i + 'Class'] = NormalizerService.getClassName(coinTopMarketCapValues['trendPerChnge' + i]);
      summary['trendPerChnge' + i] = NormalizerService.checkAndAddPrecision(coinTopMarketCapValues['trendPerChnge' + i], precision) + ' %';
      summary['trendMarket' + i] = coinTopMarketCapValues['trendMarket' + i];
    }
    return summary;
  }

  function normalizeGlobalMarketCapDataToDisplay (summary, data) {
    if (!data.coinGlobalMarket) {
      return false;
    }
    var coinGlobalMarketCapValues = data.coinGlobalMarket;
    var trendCurrency = currencyDetails ? currencyDetails.currency.toUpperCase() : '';

    summary['totalMarketCap'] = NormalizerService.normalizeValuesWithCommas(coinGlobalMarketCapValues['total_market_cap'], '', true) + ' ' + trendCurrency;
    summary['total24hVolume'] = NormalizerService.normalizeValuesWithCommas(coinGlobalMarketCapValues['total_24h_volume'], '', true) + ' ' + trendCurrency;
    summary['bitcoinPerMarketCap'] = NormalizerService.checkAndAddPrecision(coinGlobalMarketCapValues['bitcoin_percentage_of_market_cap'], 2) + ' %';
    return summary;
  }

  function bindTopMarketValues (summary, data) {
    summary = normalizeTopMarketCapDataToDisplay(summary, data);
    DomHelper.checkAndBindData(coinTopMarketElements, summary, PBConstants.POSSIBLE_CLASSES, summary);
  }

  function bindGlobalMarketValues (summary, data) {
    summary = normalizeGlobalMarketCapDataToDisplay(summary, data);
    DomHelper.checkAndBindData(coinGlobalMarketElements, summary, PBConstants.POSSIBLE_CLASSES, summary);
  }

  return {
    init: init,
    getCoinMarketData: getCoinMarketData,
    callCoinMarket: callCoinMarket,
    bindTopMarketValues: bindTopMarketValues,
    bindGlobalMarketValues: bindGlobalMarketValues
  };

})();