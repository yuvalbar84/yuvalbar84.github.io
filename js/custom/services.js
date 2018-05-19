/** ******************************************************
 * Contains all the code related to API calls, normalization
 * of data received from the API, and configuration of
 * plugins.
 *
 * © ProfitTrailer
 ********************************************************/
var Services = function (baseAPI, marketCapAPI, currenciesAPI, globalMarketCapAPI) {
  var BASE_API = baseAPI;
  var MARKET_CAP_API_URL = marketCapAPI;
  var CURRENCIES_API = currenciesAPI;
  var GLOBAL_MARKET_CAP_URL = globalMarketCapAPI;

  var DEFAULT_REQUEST_OBJ = {
    cache: false,
    crossDomain: true,
    dataType: 'json'
  };

  var CONFIG_REQUEST_OBJ = jQuery.extend({
    beforeSend: function () {
      $('.tab-specific-loading').show();
    },
    error: function () {
      toastr.info(i18next.t('constantMsgs.ajaxError'));
    },
    complete: function () {
      $('.tab-specific-loading').hide();
    }
  }, DEFAULT_REQUEST_OBJ);

  function getTableData () {
    return $.ajax(jQuery.extend({
      url: BASE_API + '/monitoring/data',
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getCurrencies () {
    return $.ajax(jQuery.extend({
      url: CURRENCIES_API,
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getMarketCap (currency, limit) {
    return $.ajax(jQuery.extend({
      url: MARKET_CAP_API_URL + currency +
        '&limit=' + limit,
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getGlobalMarketCap (currency) {
    return $.ajax(jQuery.extend({
      url: GLOBAL_MARKET_CAP_URL + currency,
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getMarketTrend () {
    return $.ajax(jQuery.extend({
      url: BASE_API + '/private?command=returnTicker',
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function stopProfitTrailer () {
    return $.ajax(jQuery.extend({
      url: BASE_API + '/stop',
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getConfigFile (filename) {
    return $.ajax(jQuery.extend({
      url: BASE_API + '/settings/load',
      data: {
        fileName: filename
      },
      global: false
    }, CONFIG_REQUEST_OBJ));
  }

  function saveSOM (value) {
    return $.ajax(jQuery.extend({}, CONFIG_REQUEST_OBJ, {
      url: BASE_API + '/settings/sellOnlyMode?type=&enabled=' + value,
      global: false,
      dataType: 'text'
    }));
  }

  function saveSOMO (value) {
    var URL = value ? '?enabled=false' : '';
    return $.ajax(jQuery.extend({}, CONFIG_REQUEST_OBJ, {
      url: BASE_API + '/settings/overrideSellOnlyMode' + URL,
      global: false,
      dataType: 'text'
    }));
  }

  function saveConfigFile (filename, fileData) {
    return $.ajax(jQuery.extend({}, CONFIG_REQUEST_OBJ, {
      url: BASE_API + '/settings/save?fileName=' + filename,
      data: fileData,
      dataType: 'text',
      contentType: 'text/plain',
      global: false,
      type: 'POST'
    }));
  }

  function getCurrentMarketPrecision (market, precision) {
    precision = precision || PBConstants.DEFAULT_PRECISION;
    // If market is USDT then we should add 2 decimals precision.
    if (market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD) {
      precision = PBConstants.MARKET_USDT_PRECISION;
    }
    return precision;
  }

  return {
    getTableData: getTableData,
    getMarketCap: getMarketCap,
    getMarketTrend: getMarketTrend,
    getConfigFile: getConfigFile,
    saveConfigFile: saveConfigFile,
    getCurrentMarketPrecision: getCurrentMarketPrecision,
    stopProfitTrailer: stopProfitTrailer,
    getCurrencies: getCurrencies,
    Normalizer: Services.Normalizer(),
    Configurations: Services.Configurations(),
    saveSOM: saveSOM,
    saveSOMO: saveSOMO,
    getGlobalMarketCap: getGlobalMarketCap
  };
};

// Configurations.
Services.Configurations = function () {
  function setToastrOptions () {
    toastr.options = {
      closeButton: true,
      newestOnTop: true,
      positionClass: 'toast-top-right',
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
      preventDuplicates: true
    };
  }

  return {
    setToastrOptions: setToastrOptions
  };
};

// Data normalization
Services.Normalizer = function () {
  var MAX_HEARTBEATS = 12;
  var ICONS = {
    'cache heartbeat': {
      class: 'mdi-heart-pulse',
      'dark-theme-color': '#3bafda',
      'light-theme-color': '#3bafda'
    },
    'dca heartbeat': {
      class: 'mdi-heart-pulse',
      'dark-theme-color': 'rgba(133, 187, 101, 0.75)',
      'light-theme-color': 'rgba(133, 187, 101, 0.75)'
    },
    'pairs heartbeat': {
      class: 'mdi-heart-pulse',
      'dark-theme-color': '#ef5350',
      'light-theme-color': '#ef5350'
    },
    'detected configuration changes': {
      class: 'mdi-settings',
      'dark-theme-color': 'rgba(176, 196, 222, 0.75)',
      'light-theme-color': '#4B8DE0'
    },
    'default': {
      class: 'mdi-alert-circle-outline',
      'dark-theme-color': '#FF9900',
      'light-theme-color': '#4B8DE0'
    },
    'api issues': {
      class: 'mdi-desktop-tower',
      'dark-theme-color': 'rgba(176, 196, 222, 0.75)',
      'light-theme-color': '#4B8DE0'
    },
    'something wrong with bot': {
      class: 'mdi-robot',
      'dark-theme-color': 'rgba(176, 196, 222, 0.75)',
      'light-theme-color': '#4B8DE0'
    },
    'invalid strategy selected': {
      class: 'mdi-dice-1',
      'dark-theme-color': 'rgba(176, 196, 222, 0.75)',
      'light-theme-color': '#4B8DE0'
    }
  };

  // To remove the unused data which we are receiving from API.
  function removeUnusedData(response) {
    delete response.dcaBackupLogData;
    delete response.dcaBuyOrdersHistory;
    delete response.orderHistory;
    delete response.storedAverageMap;
    delete response.testModeBalanceMap;
    delete response.testModeTradeHistoryMap;
    return response;
  }

  function getIconType (text) {
    var lowerText = text.toLowerCase();
    var icon = null;
    if (ICONS.hasOwnProperty(lowerText)) {
      icon = ICONS[lowerText];
    } else {
      icon = ICONS.default;
    }
    return icon;
  }

  // TODO: This function should not be here, need to be moved to correct place.
  function settingsDetails (data) {
    var settingsDetails = {
      password: false,
      passwordAndConfig: false,
      enableShutdown: false,
      enableChngePswrd: false
    };
    if (data && data.settings) {
      settingsDetails.password = data.settings.passwordSet;
      settingsDetails.passwordAndConfig = data.settings.enableConfig && data.settings.passwordSet;
      settingsDetails.enableShutdown = data.settings.enableShutdown;
      settingsDetails.enableChngePswrd = data.settings.role === PBConstants.ENABLE_CHNGE_PSWRD_ROLE ? true : false;
    }
    return settingsDetails;
  }

  function marketCap (data, marketCapCurrency) {
    if (data === null) {
      return false;
    }
    try {
      var percChange1h = 0;
      var percChange24h = 0;
      var percChange7d = 0;
      var totalRecords = data ? data.length : 0;

      for (var i = 0; i !== totalRecords; ++i) {
        if (data[i].symbol === marketCapCurrency) {
          // exclude bitcoin in the trend
          continue;
        }
        percChange1h += +data[i].percent_change_1h;
        percChange24h += +data[i].percent_change_24h;
        percChange7d += +data[i].percent_change_7d;
      }

      if (totalRecords) {
        percChange1h = percChange1h / totalRecords;
        percChange24h = percChange24h / totalRecords;
        percChange7d = percChange7d / totalRecords;
      }
    } catch (e) {
      console.log('Error while processing data from market cap API.');
      console.log(e);
      return false;
    }

    return {
      percChange1h: percChange1h,
      percChange24h: percChange24h,
      percChange7d: percChange7d,
    };
  }

  function normalizeCurrencies (data, currencies) {
    var currentCurrency = data.settings.currency;
    var isBaseCurrency = currentCurrency && currencies.rates.hasOwnProperty(currentCurrency) ? false : true;
    data.currency = isBaseCurrency ? PBConstants.BASE_CURRENCY : currentCurrency;
    data.currencyValue = isBaseCurrency ? 1 : currencies.rates[currentCurrency];
    if (!isBaseCurrency && PBConstants.CURRENCY_SYMBOLS.hasOwnProperty(currentCurrency)) {
      data.currencySymbol = PBConstants.CURRENCY_SYMBOLS[currentCurrency];
    } else {
      data.currencySymbol = PBConstants.BASE_CURRENCY_SYMBOL;
    }
    return data;
  }

  function segregateNotifications (data) {
    var notifications = data && data.notifications ? data.notifications : [];
    var heartbeats = data && data.heartbeats ? data.heartbeats : [];
    var heartbeatsLength = heartbeats.length;
    var notificationsLength = notifications.length;
    var currentNotificationIndex = notifications.length - 1;
    var nrmlsdNotifications = [];
    var heartBeats = [];
    var currentHeartbeatIndex = heartbeatsLength - 1;
    var currentHeartbeat;
    var i;
    // To loop over heartbeat array only if heartbeat array's length is greater than zero.
    if (heartbeatsLength !== 0) {
      i = 0;
      // Calcuate the number of times the looping occurs based on length of heartbeat array.
      var maxHeartBeatLength = heartbeatsLength <= MAX_HEARTBEATS ? heartbeatsLength : MAX_HEARTBEATS;
      while (i < maxHeartBeatLength) {
        currentHeartbeat = heartbeats[currentHeartbeatIndex];
        currentHeartbeat.icon = getIconType(currentHeartbeat.heartbeat);
        heartBeats.push(currentHeartbeat);
        currentHeartbeatIndex--;
        i++;
      }
    }
    // To loop over notification array only if notification array's length is greater than zero.
    if (notificationsLength !== 0) {
      // We are looping only through X notifications to avoid performance issues that might arise if we loop through all the notifications
      i = 0;
      var maxLimit = notificationsLength < PBConstants.NOTIFICATIONS.NOTIFICATIONS_CUT_OFF ? notificationsLength
        : PBConstants.NOTIFICATIONS.NOTIFICATIONS_CUT_OFF;
      while (i < maxLimit) {
        var currentNotification = notifications[currentNotificationIndex];
        currentNotification.icon = getIconType(currentNotification.notification);
        // Pushing current notification in notification array.
        nrmlsdNotifications.push(currentNotification);
        currentNotificationIndex--;
        i++;

        // If we found 20 notifications 
        // then we can stop looping as we are showing showing max 20 notifications. 
        if (nrmlsdNotifications.length > PBConstants.NOTIFICATIONS.MAX) {
          break;
        }
      }
    }

    data.nrmlsdNotifications = nrmlsdNotifications;
    data.heartBeats = heartBeats;
    return data;
  }

  /**
   * If market is USDT then we should consider market as BTC.
   * @param {*} market
   */
  function normalizeMarket (market) {
    market = market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD ? 'BTC' : market;
    return market;
  }
  function normalizeValuesWithCommas (value, precision, noPrecision) {
    precision = precision || PBConstants.DEFAULT_PRECISION;
    if (noPrecision) {
      return DataTableHelper.normalizeValueWithCommas(value, 'display', '', '', true);
    } else {
      return DataTableHelper.normalizeValueWithCommas(value, 'display', '', '', '', precision);
    }
  }
  function normalizeSummaryData (summary, precision) {
    // Don't modify the original object.
    var summaryTemp = $.extend({}, summary);
    var normalizedSummary = summaryTemp;
    var precisionToUse = precision || PBConstants.DEFAULT_PRECISION;
    precisionToUse = Services().getCurrentMarketPrecision(summary.apiMarket, precisionToUse);
    normalizedSummary.balance = normalizeValuesWithCommas(+summaryTemp.balance, precisionToUse);
    normalizedSummary.DCABalance = normalizeValuesWithCommas(+summaryTemp.DCABalance, precisionToUse);
    normalizedSummary.pairsBalance = normalizeValuesWithCommas(+summaryTemp.pairsBalance, precisionToUse);
    normalizedSummary.totalCurrentVal = normalizeValuesWithCommas(+summaryTemp.totalCurrentVal, precisionToUse);
    normalizedSummary.TCVDustValue = normalizeValuesWithCommas(+summaryTemp.TCVDustValue, precisionToUse);
    normalizedSummary.startBalance = normalizeValuesWithCommas(+summaryTemp.startBalance, precisionToUse);
    normalizedSummary.TPVDustValue = normalizeValuesWithCommas(+summaryTemp.TPVDustValue, precisionToUse);
    normalizedSummary.todayProfit = normalizeValuesWithCommas(+summaryTemp.todayProfit, precisionToUse);
    normalizedSummary.yesterdayProfit = normalizeValuesWithCommas(+summaryTemp.yesterdayProfit, precisionToUse);
    normalizedSummary.lastWeekProfit = normalizeValuesWithCommas(+summaryTemp.lastWeekProfit, precisionToUse);

    for (var prop in normalizedSummary) {
      if ((typeof normalizedSummary[prop] === undefined) ||
        (typeof (normalizedSummary[prop]) === 'string' && normalizedSummary[prop].toLowerCase() === 'nan')) {
        normalizedSummary[prop] = '--';
      }
    }
    return normalizedSummary;
  }

  function marketTrend (data, marketCapCurrency) {
    var marketTrend = 0;
    var marketTrendAvg = 0;
    try {
      var marketRecords = 0;
      for (var key in data) {
        // Consider coins contains marketCapCurrency
        if (key.indexOf(marketCapCurrency) !== -1) {
          var value = JSON.parse(data[key]);
          marketTrend += +value.percentChange * 100;
          ++marketRecords;
        }
      }
      marketTrendAvg = marketRecords ? marketTrend / marketRecords : 0;
    } catch (e) {
      console.error('Error while processing data from market Trend API');
      console.error(e);
      return false;
    }
    return marketTrendAvg;
  }

  function getTablesRecordsCount (data, routes, tables) {
    if (!data || $.isEmptyObject(data)) {
      return false;
    }
    var recordsCount = {};
    for (var i = 0; i < tables.length; i++) {
      var currentTable = tables[i];
      var jsonProp = routes[currentTable].json;
      // Some routes have two json properties, we have to concat both properties data.
      var currentTabledata = Array.isArray(jsonProp) && Array.isArray(data[jsonProp[1]]) ? data[jsonProp[0]].concat(data[jsonProp[1]]) : data[jsonProp];
      currentTabledata = Array.isArray(currentTabledata) ? currentTabledata : [];
      recordsCount[currentTable] = currentTabledata.length;
    }
    return recordsCount;
  }

  function getInCurrencyValue (value, data, precision, checkCondition) {
    if ((checkCondition && !showInCurrentCurrency(data)) || !data || $.isEmptyObject(data)) {
      return '';
    }
    var marketTmp = data.market;
    var marketPrice = data[marketTmp + 'USDTPrice'] ? data[marketTmp + 'USDTPrice'] : 1;
    value = value * marketPrice * data.currencyValue;
    if (precision) {
      value = DataTableHelper.normalizeValueWithCommas(value, 'display', '', '', '', precision);
    }
    return value;
  }

  function showInCurrentCurrency (data) {
    // If market is USDT and currency is USD then we should not show the current currency value.
    if (data && data.market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD && data.currency === PBConstants.BASE_CURRENCY) {
      return false;
    }
    return true;
  }

  function getMonitoringSummary (data, lowerPrecision) {
    var precision = PBConstants.DEFAULT_PRECISION;
    if (lowerPrecision) {
      precision = 3;
    }
    if (!data.settings) {
      return false;
    }
    var percChange1hClass = data.coinMarketCap.percChange1h < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var percChange24hClass = data.coinMarketCap.percChange24h < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var percChange7dClass = data.coinMarketCap.percChange7d < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;

    var percChange24hBtcClass = data.BTCUSDTPercChange < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var marketTrendAvgClass = data.marketTrendAvg < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;

    var normalizedMarket = data.normalizedMarket;
    var normalizedMarketPrice = data[normalizedMarket + 'USDTPrice'] ? data[normalizedMarket + 'USDTPrice'] : 0;
    var normalizedMarketPercChange = data[normalizedMarket + 'USDTPercChange'] ? data[normalizedMarket + 'USDTPercChange'] : 0;
    var normalizedMarketPercChangeClass = normalizedMarketPercChange < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;

    var marketPriceClass = data.market === PBConstants.HIDE_MARKET_PRICE_ROW_COMPARISION ? 'hide' : 'show';

    var returnDataTmp = {
      balance: data.realBalance,
      pairsBalance: data.pairsBalance,
      DCABalance: data.DCABalance,
      todayProfit: data.totalProfitToday,
      yesterdayProfit: data.totalProfitYesterday,
      lastWeekProfit: data.totalProfitWeek,
      totalCurrentVal: parseFloat((data.totalPairsCurrentValue + data.totalDCACurrentValue +
        data.totalPendingCurrentValue + data.realBalance).toFixed(precision)).toFixed(precision),
      startBalance: parseFloat(data.startBalance.toFixed(precision)).toFixed(precision),
      percChange1h: parseFloat(data.coinMarketCap.percChange1h.toFixed(2)).toFixed(2) + ' %',
      percChange24h: parseFloat(data.coinMarketCap.percChange24h.toFixed(2)).toFixed(2) + ' %',
      percChange7d: parseFloat(data.coinMarketCap.percChange7d.toFixed(2)).toFixed(2) + ' %',
      percBtcChange24h: checkAndAddPrecision(data.BTCUSDTPercChange * 100, 2) + ' %',
      normalizedMarketPercChange: checkAndAddPrecision(normalizedMarketPercChange * 100, 2) + ' %',
      marketTrendAvg: checkAndAddPrecision(data.marketTrendAvg, 2) + ' %',
      percChange24hBtcClass: percChange24hBtcClass,
      normalizedMarketPercChangeClass: normalizedMarketPercChangeClass,
      priceUsd: normalizeValuesWithCommas(data.BTCUSDTPrice, 2),
      normalizedMarketPrice: normalizeValuesWithCommas(normalizedMarketPrice, 2),
      marketTrendAvgClass: marketTrendAvgClass,
      apiMarket: data.market,
      normalizedMarket: normalizedMarket,
      percChange1hClass: percChange1hClass,
      percChange24hClass: percChange24hClass,
      percChange7dClass: percChange7dClass,
      marketTitle: normalizedMarket + 'USD ' + i18next.t('summaryItems.price.title'),
      pendingOrderTime: data.pendingOrderTime,
      balMarketPrice: getInCurrencyValue(data.realBalance, data, 2),
      marketPriceClass: marketPriceClass,
      currencySymbol: data.currencySymbol,
      currencySymbolTitle: i18next.t('settingInfo.currency.title'),
      estimatedValueCurrencyText: data.currency + i18next.t('monitoringSection.usdFullText'),
      estimatedValueShortText: data.currency + i18next.t('monitoringSection.usdShortText'),
      exchange: data.exchange
    };
    var marketPriceValues = {
      TPVMarketPrice: getInCurrencyValue(returnDataTmp.startBalance, data, 2),
      TCVMarketPrice: getInCurrencyValue(returnDataTmp.totalCurrentVal, data, 2),
      todayProfitUSDValue: getInCurrencyValue(returnDataTmp.todayProfit, data, 2),
      yesterdayProfitUSDValue: getInCurrencyValue(returnDataTmp.yesterdayProfit, data, 2),
      lastWeekProfitUSDValue: getInCurrencyValue(returnDataTmp.lastWeekProfit, data, 2)
    };
    // Calculate yesterday's value and then the profit %
    var yesterdayValue = returnDataTmp.startBalance - returnDataTmp.todayProfit;
    marketPriceValues.yesterdayProfitPercent = parseFloat(getPercent(returnDataTmp.yesterdayProfit, yesterdayValue).toFixed(2)).toFixed(2);

    marketPriceValues.todayProfitPercent = parseFloat(getPercent(returnDataTmp.todayProfit,
      returnDataTmp.startBalance).toFixed(2)).toFixed(2);

    var dustValues = {
      TCVDustValue: normalizeValuesWithCommas(+returnDataTmp.totalCurrentVal + data.totalDustCurrentValue)
    };

    returnDataTmp = $.extend(returnDataTmp, marketPriceValues, dustValues);
    var returnData = $.extend(returnDataTmp, getSecondHeaderData(data));
    return returnData;
  }

  /**
  * It is to fix .toFixed not defined error
  * this error will occur when value is not an integer.
  * @param {*} value
  * @param {*} precisionTmp
  */
  function checkAndAddPrecision (value, precisionTmp) {
    var returnVal = value ? +value : 0;
    var precision = precisionTmp ? precisionTmp : PBConstants.DEFAULT_PRECISION;
    return DataTableHelper.normalizeValueWithCommas(returnVal, 'display', '', '', '', precision);
  }

  function addPrecisionForMultipleValues (originalObj, data, precision) {
    for (var key in originalObj) {
      originalObj[key] = checkAndAddPrecision(data[originalObj[key]], precision);
    }
    return originalObj;
  }

  function getClassName (value) {
    var className = value < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    return className;
  }

  function getSecondHeaderData (data) {
    var returnObj = {
      sellOnlyMode: '',
      sellOnlyModeOverride: '',
      sellOnlyModeToolTip: ''
    };
    var isEnableConfig = data.settings.hasOwnProperty('enableConfig') && data.settings.enableConfig;
    var isPasswordSet = data.settings.hasOwnProperty('passwordSet') && data.settings.passwordSet;
    var somStatus = data.settings.hasOwnProperty('sellOnlyMode') && data.settings.sellOnlyMode;
    var somoStatus = data.settings.hasOwnProperty('sellOnlyModeOverride') && data.settings.sellOnlyModeOverride;

    if (data.settings) {
      returnObj = {
        sellOnlyMode: somStatus ? i18next.t('constantMsgs.true') : i18next.t('constantMsgs.false'),
        sellOnlyModeClass: somStatus ? PBConstants.NEGATIVE_BADGE : PBConstants.POSITIVE_BADGE,
        sellOnlyModeOverride: somoStatus ? i18next.t('constantMsgs.true') : i18next.t('constantMsgs.false'),
        sellOnlyModeOverrideClass: somoStatus ? PBConstants.NEGATIVE_BADGE : PBConstants.POSITIVE_BADGE,
        sellOnlyModeToolTip: data.settings.sellOnlyMode && data.settings.sellOnlyModeTrigger ? data.settings.sellOnlyModeTrigger : '',
        configEnabled: isEnableConfig ? i18next.t('constantMsgs.onConfig') : i18next.t('constantMsgs.offConfig'),
        configEnabledClass: isEnableConfig ? PBConstants.POSITIVE_BADGE : PBConstants.NEGATIVE_BADGE,
        passwordSet: isPasswordSet ? i18next.t('constantMsgs.onPassword') : i18next.t('constantMsgs.offPassword'),
        passwordSetClass: isPasswordSet ? PBConstants.POSITIVE_BADGE : PBConstants.NEGATIVE_BADGE,
        isTestMode: data.settings.hasOwnProperty('testMode') ? data.settings.testMode : false
      };
    }
    return returnObj;
  }

  function getDefaultCoinMarket () {
    return {
      percChange1h: 0,
      percChange24h: 0,
      percChange7d: 0,
    };
  }

  function getPercent (value, total) {
    total = +total;
    var returnVal = total ? (value / total) * 100 : 0;
    return returnVal;
  }

  return {
    marketCap: marketCap,
    marketTrend: marketTrend,
    normalizeSummaryData: normalizeSummaryData,
    getTablesRecordsCount: getTablesRecordsCount,
    getMonitoringSummary: getMonitoringSummary,
    checkAndAddPrecision: checkAndAddPrecision,
    getSecondHeaderData: getSecondHeaderData,
    addPrecisionForMultipleValues: addPrecisionForMultipleValues,
    getDefaultCoinMarket: getDefaultCoinMarket,
    normalizeCurrencies: normalizeCurrencies,
    segregateNotifications: segregateNotifications,
    settingsDetails: settingsDetails,
    removeUnusedData: removeUnusedData,
    getClassName: getClassName,
    normalizeValuesWithCommas: normalizeValuesWithCommas,
    normalizeMarket: normalizeMarket,
    getInCurrencyValue: getInCurrencyValue
  };
};

