jQuery(document).ready(function ($) {
  // API REF
  var TABLE_REFS = getTableRefs($);
  var LOWEST_DESKTOP_RESOLUTION = 1023;
  var RECORDS_COUNT_CLASSES = 'badge-danger badge-primary';
  var DEFAULT_RECORDS_COUNT_CLASS = 'badge-primary';
  var RECORDS_COUNT_HIGHLIGHT_CLASS = 'badge-danger';

  // Global elements
  var $spinner = $('.spinner');
  var $lastUpdatedOn = $('#dvLastUpdatedOn');
  var $monitorSummary = $('.monitor-summary');
  var $utcTime = $('#dvCurrentUTCTime');
  var $currentTime = $('#dvCurrentTime');
  var $configurationMenu = $('#configMenu, #topConfigMenu');
  var $stopBtn = $('#btnStopContainer').find('button');
  var $contentPage = $('#contentPage');
  var $topNav = $('#topNav');
  var $testModeContainer = $('#testModeContainer');
  var $subHeader = $('#subHeader');
  var $topbar = $('.topbar');
  var $footer = $('footer');

  // Store for the server data.
  var serverData = {};
  var editor = '';
  var tableRecordsCount = {};
  var routes, Service, NormalizerService, ConfigurationService;
  var currenciesLocalStorageKey = 'currencies';
  var currenciesAPICalledTimeLocalStorageKey = 'currenciesAPICalledTime';
  var updatingSummaryClass = 'js-updating-summary';
  var marketIcons = {
    BTC: 'fa fa-btc',
    USDT: 'fa fa-usd',
    BNB: 'fa fa-dot-circle-o',
    XMR: 'cf cf-xmr',
    ETH: 'cf cf-eth'
  };
  var onlySaveConfigFiles = ['HOTCONFIG'];
  var topbarMargin = 5;

  // API calls should happen after localization and loading translations which will happen in the below function call
  // otherwise translated messages will not be available in API call back functions.
  Translations.init();

  function loadPage (isPageLoad) {

    // make the ajax call to get the data
    getServerData(function (data) {
      data.currentMarketPrecision = Service.getCurrentMarketPrecision(data.market);
      data = NormalizerService.segregateNotifications(data);
      data.normalizedMarket = NormalizerService.normalizeMarket(data.market);

      // Call coin market API function only on page load.
      if (isPageLoad) {
        CoinMarket.callCoinMarket(data);
      }
      data = CoinMarket.getCoinMarketData(data);
      serverData = data;
      TABLE_REFS.cbUpdateDtCache(data);
      showOrHideConfigurationMenu(data);
      // update the UI elements
      updateLayoutItems(data);
      // Add api market value.
      addMarketValue();
      // Enable stop,logout and switchery buttons.
      var settingsDetails = NormalizerService.settingsDetails(data);
      DomHelper.toggleBtns(true, settingsDetails);
      Translations.loadCurrentLanguage(data);

      // Display the notification and heartbeats, and remove it from serverData since we dont want so many
      // unnecessary objects in memory.
      AppNotification.display(data.nrmlsdNotifications, data.timeZoneOffset);
      Settings.displayHeartBeats(data.heartBeats, data.timeZoneOffset);
      Settings.setSwitcheryElemsValue(data);
      delete data.notifications;
      delete data.nrmlsdNotifications;
      delete data.heartBeats;

      // routes variable will not have a property with querystring.
      var currentPath = window.history.state.path.split('?')[0];
      RouteHelper.showCurrentPage(routes, currentPath, isPageLoad, data);
      setMainContentMarginAndHeight();
    });
  }

  function getCurrencies (cbMain) {
    var currenciesTmp = localStorage.getItem(currenciesLocalStorageKey);
    var currenciesAPICalledTime = +(localStorage.getItem(currenciesAPICalledTimeLocalStorageKey));
    var currentEpochTime = new Date().getTime();

    // Check local storage has currencies value and currencies API called time,
    // if above two values are there and currencies API called time didn't cross 24 hours then consider local storages values.
    if (currenciesTmp && currenciesAPICalledTime) {
      if (currentEpochTime - currenciesAPICalledTime < PBConstants.CURRENCY_API_CALL_FREQUENCY) {
        serverData = NormalizerService.normalizeCurrencies(serverData, JSON.parse(currenciesTmp));
        cbMain(serverData);
        ajaxStopCb();
        return;
      }
    }

    // If localstorage doesn't have currencies or currencies API called time
    // (or) currencies API called time crossed 24 hours then call currencies API.
    Service.getCurrencies().done(function (response) {
      if (response) {
        localStorage.setItem(currenciesLocalStorageKey, JSON.stringify(response));
        localStorage.setItem(currenciesAPICalledTimeLocalStorageKey, currentEpochTime);
        serverData = NormalizerService.normalizeCurrencies(serverData, response);
        cbMain(serverData);
      }
    }).fail(function () {
      toastr.info(i18next.t('constantMsgs.ajaxError'));
    }).always(function () {
      ajaxStopCb();
    });
  }

  // Triggers on language file load
  $(document).on('evt.after-lang-file-load', function () {
    // Initialize the services.
    Service = Services(PBConstants.BASE_API_URL, PBConstants.MARKET_CAP_API_URL, PBConstants.CURRENCIES_API_URL, PBConstants.GLOBAL_MARKET_CAP_API_URL);
    NormalizerService = Service.Normalizer;
    ConfigurationService = Service.Configurations;

    routes = {
      'monitoring': {
        template: 'tmplMonitoring',
        heading: i18next.t('sidebar.monitoring'),
        callback: cbMonitoring,
        refresh: true,
      },
      'totals-log': {
        template: 'tmplTotalLog',
        heading: i18next.t('pageHeadings.totalLog'),
        refresh: true,
      },
      'config': {
        template: 'tmplConfig',
        heading: i18next.t('pageHeadings.configuration'),
        callback: cbLoadConfig,
        refresh: false
      },
      'possible-buys-log': {
        template: 'tmplPossibleBuys',
        callback: TABLE_REFS.loadPossibleBuyData,
        heading: i18next.t('sidebar.buyLog'),
        json: 'bbBuyLogData',
        refresh: true,
      },
      'pairs-log': {
        template: 'tmplPairsLog',
        callback: cbPairLog,
        heading: i18next.t('sidebar.pairsLog'),
        json: ['gainLogData', 'watchModeLogData'],
        refresh: true,
      },
      'pending-log': {
        template: 'tmplPendingLog',
        callback: cbPendingLog,
        heading: i18next.t('sidebar.pendingLog'),
        json: 'pendingLogData',
        refresh: true,
      },
      'dca-log': {
        template: 'tmplDcaLog',
        callback: cbDcaLog,
        heading: i18next.t('sidebar.dcaLog'),
        json: 'dcaLogData',
        refresh: true,
      },
      'sales-log': {
        template: 'tmplSalesLog',
        callback: cbSalesLog,
        heading: i18next.t('sidebar.salesLog'),
        json: 'sellLogData',
        refresh: true,
      },
      'dust-log': {
        template: 'tmplDustLog',
        callback: cbDustLog,
        heading: i18next.t('sidebar.dustLog'),
        json: 'dustLogData',
        refresh: true,
      }
    };
    addUTCTimer();
    RouteHelper.init(routes);
    AppNotification.init();
    Settings.init();
    CoinMarket.init();
    loadPage(true);
    Settings.setTheme(true);
    ConfigurationService.setToastrOptions();
    showCurrentPage();
    clickEventHandlers();
    highlightCurrentPageinTopMenu();
    intializeTooltips();
    handleDustValueTooltips();
    Translations.loadTimeAgoTranslations();
    reloadPageOnInactivity(PBConstants.INACTIVITY_REFRESH_TIMER);
  });

  function highlightCurrentPageinTopMenu () {
    var currentPath = window.history.state.path;
    if (currentPath) {
      var $currentAnchorLink = $('[href="' + currentPath + '"]');
      var $anchorLinkParents = $currentAnchorLink.parents();
      $anchorLinkParents.eq(0).addClass('active');
      $anchorLinkParents.eq(2).addClass('active');
      $anchorLinkParents.eq(4).addClass('active');
    }
  }

  addEventHandler();
  handleWindowResize();
  scrollTopInLowerResolutions();
  handleConfigurationUnsavedChanges();

  function addEventHandler () {
    $(document).on('evt.before-page-load', function () {
      setMainContentMarginAndHeight();
      TABLE_REFS.destroyTable();
    });

    $(document).on('evt.add-market-value', function () {
      addMarketValue();
    });

    $('#dvPageContent').on('click', '#aceEditorSearch', function () {
      editor.execCommand('find');
    });
  }

  /**
   * Topbar and footer are position fixed and height of topbar and footer will differ from one resolution to another resolution.
   * We also have to change margin-top and height of main content according to the above comment changes.
   *
   */
  function setMainContentMarginAndHeight () {
    // We have added fixed subheader only in desktop resolutions.
    if (window.innerWidth > LOWEST_DESKTOP_RESOLUTION) {
      // Calculate topbar height and add margintop to mail content.
      var topbarHeight = $subHeader.innerHeight() + $topbar.innerHeight() - topbarMargin;
      var contentPageHeight = topbarHeight + $footer.innerHeight();
      $contentPage.css('margin-top', topbarHeight).css('height', 'calc(100vh - ' + contentPageHeight + 'px)');
    } else {
      $contentPage.css('margin-top', 0).css('height', 'auto');
    }
  }

  function addMarketValue () {
    // Add api market value.
    $('.api-market').html(serverData.market);
    $('.api-currency').html(serverData.currency);
  }

  // We have to add market values for child rows which will appear on click on + icon.
  $('#dvPageContent').on('click', '.collapsed tbody tr td:first-child', function () {
    addMarketValue();
  });

  /**
   * If a user tries to close the tab without saving then we should inform them.
   */
  function handleConfigurationUnsavedChanges () {
    window.addEventListener('beforeunload', function (event) {
      if (isConfigurationSaved()) {
        event.preventDefault();
      }
    });

    window.onbeforeunload = function (e) {
      if (isConfigurationSaved()) {
        var dialogText = 'Not saved';
        e.returnValue = dialogText;
        return dialogText;
      }
    };
  }

  function isConfigurationSaved () {
    return $('.show-save-message').hasClass('not-saved');
  }

  function hideConfigurationNotSaved () {
    $('.show-save-message').removeClass('not-saved').hide();
  }

  function scrollTopInLowerResolutions () {
    // On click on menu scroll to top.
    $('html').on('click', 'body.smallscreen .open-left', function () {
      // We have to scroll to top only when menu is getting opened.
      if (!$('.enlarged').length) {
        $('html,body').animate({
          scrollTop: '0px'
        }, 'slow');
      }
    });
  }

  function showSweetAlertError (title, text, btnConfirmText, callback) {

    // User has to set a enable shutdown in application file to enable this functionality.
    // If enable shutdown is not set then we should disable confirm button and inform user to set enable shutdown.
    var settingsDetails = NormalizerService.settingsDetails(serverData);
    var errorText = text;
    var closeAlertOnConfirm = true;
    var btnConfirmClasses = 'btn-danger';
    if (!settingsDetails.enableShutdown) {
      btnConfirmClasses = 'btn-danger disabled btn-sweet-alert-confirm';
      errorText = i18next.t('alertMsgs.noEnableShutdown');
      closeAlertOnConfirm = false;
    }

    swal({
      title: title,
      text: errorText,
      type: 'error',
      showCancelButton: true,
      containerClass: 'stop-button-alert',
      confirmButtonClass: btnConfirmClasses,
      confirmButtonText: btnConfirmText,
      cancelButtonText: i18next.t('alertMsgs.cancelBtn'),
      closeOnConfirm: closeAlertOnConfirm
    },
      function () {
        callback();
      });
  }

  function callStopAPI () {
    // We should stop the application only when password is set.
    // We are disabling button when password is not set.
    if ($('.btn-sweet-alert-confirm').hasClass('disabled')) {
      return;
    }
    // If a user clicks on "Stop" button in dialog then call "stop" API.
    Service.stopProfitTrailer().done(function (data, textStatus, jqXHR) {
      if (jqXHR.status !== PBConstants.SUCCESS_CODE) {
        toastr.info(i18next.t('constantMsgs.ajaxError'));
      }
    });
  }

  function clickEventHandlers () {
    // On click on stop button show alert.
    $stopBtn.click(function () {
      if ($(this).hasClass('disabled')) {
        return;
      }
      $stopBtn.blur();
      showSweetAlertError(i18next.t('alertMsgs.stop'), i18next.t('alertMsgs.stopAlert'), i18next.t('alertMsgs.stopBtn'), callStopAPI);
    });

    // Highlight current page link on click on link in top menu.
    $topNav.find('li').click(function () {
      $topNav.find('li').removeClass('active');
      $(this).addClass('active');
    });

    // Highlight sub menu link on click on it.
    $topNav.find('.submenu li').click(function (e) {
      e.stopPropagation();
      $topNav.find('.submenu li').removeClass('active');
      $(this).addClass('active');
      $(this).parents('.has-submenu').addClass('active');
    });

    // Route to particular page based on the clicked tab.
    $('#sidebar-menu li, .main-heading, #topNav li').click(function (e) {

      // Check whether a user has unsaved changes and ask for confirmation.
      var resultsSaved = true;
      e.preventDefault();
      if (isConfigurationSaved()) {
        resultsSaved = confirm(i18next.t('constantMsgs.configNotSave'));
      }
      // If a user clicks on okay then switch to other tab
      // Otherwise stay in same tab.
      if (!resultsSaved) {
        return;
      }
      hideConfigurationNotSaved();
      removeHighlightRecordsCountInSideMenu($(this));
      var href = $(this).find('a').attr('href');
      page(href);
    });
  }

  /**
   * Show loading symbol when we are calling API.
   */
  function ajaxStartCb () {
    $lastUpdatedOn.hide();
    $monitorSummary.addClass(updatingSummaryClass);
    $spinner.show();
  }

  /**
   * Show last updated on after calling API.
   */
  function ajaxStopCb () {
    $spinner.hide();
    var UTCTime = DateTimeHelper.getUTCTime();
    var currentTime = new Date().toISOString();
    $('#spnTimeAgo').timeago('update', currentTime).attr('title', UTCTime + ' UTC');
    // Show date and time.
    $monitorSummary.show().removeClass(updatingSummaryClass);
    $lastUpdatedOn.show();
  }

  /**
   * Get data from the server
   * @param {any} cbMain - Callback method to be called after data is fetch.
   */
  function getServerData (cbMain) {
    ajaxStartCb();
    $.when(Service.getTableData(), Service.getMarketTrend())
      .done(function (tableData, marketTrend) {
        Settings.setTheme(false, tableData[0]);
        var responseData = cbServerData(tableData[0], marketTrend[0]);
        if (responseData.processStatus === false) {
          toastr.info(i18next.t('constantMsgs.ajaxError'));
        }
        serverData = NormalizerService.removeUnusedData(responseData);
        getCurrencies(cbMain);
      }).fail(function () {
        Settings.setTheme();
        DomHelper.toggleBtns(false);
        toastr.info(i18next.t('constantMsgs.ajaxError'));
      }).always(function () {
        // lets now set a timer again for refresh
        // this will be set even if there is an error.
        setTimeout(loadPage, PBConstants.REFRESH_TIMER);
      });
  }

  function cbServerData (tableData, marketTrend) {
    var responseData = tableData;
    responseData.processStatus = true;
    responseData.marketTrendAvg =
      NormalizerService.marketTrend(marketTrend, responseData.market);
    if (responseData.marketTrendAvg === false) {
      responseData.processStatus = false;
      responseData.marketTrendAvg = 0;
    }
    return responseData;
  }

  function showCurrentPage () {
    var isFound = false;
    // Check on which page we are and route to that particular page.
    $.each(routes, function (path) {
      var URL = window.location.href;
      if (URL.indexOf(path) !== -1) {
        $('#sidebar-menu [href="' + path + '"]').addClass('subdrop');
        isFound = true;
        // If a URL consists of query string then we have to pass query string also to page function.
        var URLArr = URL.split('?');
        path = URLArr[1] ? path + '?' + URLArr[1] : path;
        page(path);
        return;
      }
    });

    if (!isFound) {
      showMonitoring();
    }
  }

  /**
   * It redirects to monitoring page.
   */
  function showMonitoring () {
    page('Monitoring');
    $('#defaultPage a').addClass('subdrop');
  }

  function intializeTooltips () {
    $('[data-toggle="tooltip"]').tooltip('dispose').tooltip();
  }

  /**
   * Callback function called after the data has been retrieved.
   * @param {any} data
   */
  function updateLayoutItems (data) {
    // Load current page table data.
    try {
      cbUpdateNavbar(data);
      cbUpdateFooter(data);
    } catch (e) {
      console.error(e);
      // show a message to the user.
      toastr.error(i18next.t('constantMsgs.processingError'));
    }
  }

  /** ******************************
   * START of page load callbacks
   *******************************/

  function cbPairLog (gainLogData, watchModeLogData) {
    var sumVals = TABLE_REFS.loadPairLogsData(gainLogData, watchModeLogData);
    addDifference(sumVals.currentValue, sumVals.totalCost, 'pairsLogDifference', true);
    $('#pairsLogTotalCurrentVal').html(sumVals.currentValueConvertedValue);
    $('#pairsLogRealCost').html(sumVals.totalCostConvertedValue);
  }

  function cbDustLog (dustLogData) {
    var sumVals = TABLE_REFS.loadDustLogsData(dustLogData);
    addDifference(sumVals.currentValue, sumVals.totalCost, 'dustLogDifference', true);
    $('#dustLogTotalCurrentVal').html(sumVals.currentValueConvertedValue);
    $('#dustLogRealCost').html(sumVals.totalCostConvertedValue);
  }

  function cbDcaLog (dcaLogData) {
    var sumVals = TABLE_REFS.loadDcaLogsData(dcaLogData);
    addDifference(sumVals.currentValue, sumVals.totalCost, 'dcLogDifference', true);
    $('#dcLogTotalCurrentVal').html(sumVals.currentValueConvertedValue);
    $('#dcLogRealCost').html(sumVals.totalCostConvertedValue);
  }

  function cbPendingLog (pendingLogData) {
    var sumVals = TABLE_REFS.loadPendingLogsData(pendingLogData);
    addDifference(sumVals.currentValue, sumVals.totalCost, 'pendingLogDifference', true);
    $('#pendingLogTotalCurrentVal').html(sumVals.currentValueConvertedValue);
    $('#pendingLogRealCost').html(sumVals.totalCostConvertedValue);
  }

  function cbSalesLog (salesLogData) {
    var sumVals = TABLE_REFS.loadSellLogData(salesLogData);
    $('#salesLogTotalCurrentVal').html(sumVals.soldValueConvertedValue);
    $('#salesLogBoughtCost').html(sumVals.boughtCostConvertedValue);
    addDifference(sumVals.soldValue, sumVals.boughtCost, 'salesLogDifference', true);
  }

  /**
   * It adds difference value and percentage in the summary table.
   * @param {*} difference
   * @param {*} element
   */
  function addDifference (firstValue, secondValue, element, addCurrencyValue) {
    var difference = firstValue - secondValue;
    var diffPerTmp = +secondValue ? (difference / secondValue) * 100 : 0;

    var diffValue = DataTableHelper.normalizeValueWithCommas(difference, 'display', '', '', '', serverData.currentMarketPrecision);
    var currentCurrencyValue = '';
    if (addCurrencyValue) {
      currentCurrencyValue = NormalizerService.getInCurrencyValue(diffValue, serverData, 2, true);
      currentCurrencyValue = currentCurrencyValue ? '<span class="current-currency-values"> (' + serverData.currencySymbol + currentCurrencyValue + ')</span>' : '';
    }
    var differencePerClass = diffPerTmp < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var differencePer = ' (' + parseFloat((diffPerTmp).toFixed(2)).toFixed(2) + ' %)';
    $('#' + element + ' .value').html(diffValue + currentCurrencyValue);
    $('#' + element + ' .percentage').html((differencePer)).removeClass(PBConstants.POSSIBLE_CLASSES).addClass(differencePerClass);
  }

  /**
   * We are having tooltips for child and parent elment.
   * Below code is to fix two tooltips are appearing at a time when we hover
   * on child element.
   */
  function handleDustValueTooltips () {
    $('.js-dust-values').hover(function () {
      $(this).parents('.card-box').tooltip('hide');
    });
  }

  function cbMonitoring (data) {
    intializeTooltips();
    var summary = NormalizerService.getMonitoringSummary(data);

    var tablesInfo = getTablesInfo(data);
    if (!summary || !tablesInfo) {
      return;
    }
    var normalizedSummary = NormalizerService.normalizeSummaryData(summary);

    // Top market values
    CoinMarket.bindTopMarketValues(summary, data);

    // Global market values
    CoinMarket.bindGlobalMarketValues(summary, data);

    // Tables summary
    // DCA log table summary.
    var dcLogsData = tablesInfo['dca-log'];
    jQuery('#mDcLogCurrentValue').html(dcLogsData.currentValueConvertedValue);
    jQuery('#mDcLogBoughtCost').html(dcLogsData.boughtCostConvertedValue);
    addDifference(dcLogsData.currentValue, dcLogsData.boughtCost, 'mDcLogDifference');

    // Pairs log table summary.
    var pairsLogData = tablesInfo['pairs-log'];
    jQuery('#mPairsLogCurrentValue').html(pairsLogData.currentValueConvertedValue);
    jQuery('#mPairsLogBoughtCost').html(pairsLogData.boughtCostConvertedValue);
    addDifference(pairsLogData.currentValue, pairsLogData.boughtCost, 'mPairsLogDifference');

    // Pending log table summary.
    var pendingLogData = tablesInfo['pending-log'];
    jQuery('#mPendingLogCurrentValue').html(pendingLogData.currentValueConvertedValue);
    jQuery('#mPendingLogBoughtCost').html(pendingLogData.boughtCostConvertedValue);
    addDifference(pendingLogData.currentValue, pendingLogData.boughtCost, 'mPendingLogDifference');

    // Sales log table summary
    var salesLogData = tablesInfo['sales-log'];
    jQuery('#mSalesLogCurrentValue').html(salesLogData.currentValueConvertedValue);
    jQuery('#mSalesLogBoughtCost').html(salesLogData.boughtCostConvertedValue);
    addDifference(salesLogData.currentValue, salesLogData.boughtCost, 'mSalesLogDifference');
    var firstRowElementsObjObj = {
      balance: ['mBalanceVal', '', 'balance'],
      DCABalance: ['mDCABalanceVal', '', 'DCABalance'],
      pairsBalance: ['mPairsBalanceVal', '', 'pairsBalance'],
      totalCurrentVal: ['mTotalCurrentVal', '', 'totalCurrentVal'],
      startBalance: ['mStartBalance', '', 'startBalance'],
      lastWeekProfit: ['mLastWeekProfit', '', 'lastWeekProfit'],
      yesterdayProfit: ['mYesterdayProfit', '', 'yesterdayProfit'],
      todayProfit: ['mTodayProfit', '', 'todayProfit'],
      balMarketPrice: ['mBalUSDValue'],
      TCVMarketPrice: ['mTCVUSDValue'],
      TCVDustValue: ['mTCVDustValue'],
      TPVMarketPrice: ['mTPVUSDValue'],
      lastWeekProfitUSDValue: ['mLastWeekProfitUSDValue', '', 'lastWeekProfitUSDValue'],
      yesterdayProfitUSDValue: ['mYesterdayProfitUSDValue', '', 'yesterdayProfitUSDValue'],
      yesterdayProfitPercent: ['mYesterdayProfitPercent', '', 'yesterdayProfitPercent'],
      todayProfitUSDValue: ['mTodayProfitUSDValue', '', 'todayProfitUSDValue'],
      todayProfitPercent: ['mTodayProfitPercent', '', 'todayProfitPercent']
    };
    DomHelper.checkAndBindData(firstRowElementsObjObj, normalizedSummary);

    var secondRowElementsObj = {
      percChange1h: ['mTrend1h', 'percChange1hClass'],
      percChange24h: ['mTrend24h', 'percChange24hClass'],
      percChange7d: ['mTrend7d', 'percChange7dClass'],
      marketTrendAvg: ['mMarketTrend', 'marketTrendAvgClass', 'marketTrendAvg'],
      priceUsd: ['mBtcPrice'],
      pendingOrderTime: ['mPendingOrderTime']
    };
    DomHelper.checkAndBindData(secondRowElementsObj, summary, PBConstants.POSSIBLE_CLASSES, summary);

    var monitoringSOMElements = {
      sellOnlyMode: ['mSellOnlyMode', 'sellOnlyModeClass'],
      sellOnlyModeOverride: ['mSellOnlyModeOverride', 'sellOnlyModeOverrideClass'],
      passwordSet: ['mPasswordSet', 'passwordSetClass'],
      configEnabled: ['mConfigEnabled', 'configEnabledClass']
    };
    DomHelper.checkAndBindData(monitoringSOMElements, summary, PBConstants.POSSIBLE_BADGES, summary);
    $('#mMarketTrendLabel').html(summary.apiMarket + ' ' + i18next.t('monitoringSection.trend24H'));
    $('#mMarketTrendContainer').attr('data-original-title', i18next.t('monitoringSection.trendContainerFirstPart') + ' ' + summary.apiMarket + ' ' + i18next.t('monitoringSection.trendContainerSecondPart'));
    jQuery('.market').html(summary.apiMarket);
    $('.js-exchange').html(data.exchange);
    jQuery('#mMarket').html(summary.apiMarket);
    jQuery('#mVersion').html(data.version);
    jQuery('#mBtc24h').html('(' + summary.percBtcChange24h + ')').removeClass(PBConstants.POSSIBLE_CLASSES)
      .addClass(summary.percChange24hBtcClass);
    jQuery('#mSellOnlyModeLabel').attr('data-original-title', summary.sellOnlyModeToolTip);
    jQuery('.js-usd-value .full-text').html(summary.estimatedValueCurrencyText);
    jQuery('.js-usd-value .short-text').html(summary.estimatedValueShortText);
    changeMarketIcons(summary.apiMarket);
    var $marketPriceCalculations = $('.js-usd-value').parents('.market-price-calculations');
    if (summary.apiMarket === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD && data.currency === PBConstants.BASE_CURRENCY) {
      $marketPriceCalculations.hide();
    } else {
      $marketPriceCalculations.show();
    }
    // Show estimated gain only if start balance is not equal to zero.
    var $estimatedGain = $('.js-estimated-gain');
    +summary.startBalance ? $estimatedGain.show() : $estimatedGain.hide();
  }

  /**
   * Removes all the previously added market icons and adds current market icon in monitoring first row.
   * @param {*} market
   */
  function changeMarketIcons (market) {
    var $marketIconElement = $('.market-icon');
    // Generate all market icons array.
    var possibleMarketIconsArr = $.map(marketIcons, function (icon) {
      return [icon];
    });
    var currentMarketIcon = marketIcons.hasOwnProperty(market) ? marketIcons[market] : marketIcons.BTC;
    DomHelper.replaceClasses($marketIconElement, possibleMarketIconsArr, currentMarketIcon);
  }

  function updatePageTitle (data, tableRecordsCount) {
    // We have to show (possibleLogsLength-pairsLogsLength-DCALogsLength) in page title.
    var logsCount = + tableRecordsCount['possible-buys-log'].toString() +
      '-' + tableRecordsCount['pairs-log'].toString() + '-' + tableRecordsCount['dca-log'].toString();
    var sitename = i18next.t('constantMsgs.ptMonitor');
    if (data.sitename) {
      sitename = data.sitename;
    }
    DomHelper.updatePageTitle(sitename + ' ' + logsCount);
  }

  function cbUpdateNavbar (data) {
    var summaryTemp = NormalizerService.getMonitoringSummary(data);
    var tables = ['pairs-log', 'pending-log', 'dca-log', 'possible-buys-log', 'sales-log', 'dust-log'];
    var oldTableRecordsCount = tableRecordsCount;
    var currentPage = window.history.state.path;
    var navBarElements = {
      'possible-buys-log': ['possibleBuyLogLength'],
      'pairs-log': ['pairsLogLength'],
      'pending-log': ['pendingLogLength'],
      'sales-log': ['salesLogLength'],
      'dca-log': ['dcLogLength'],
      'dust-log': ['dustLogLength']
    };
    tableRecordsCount = NormalizerService.getTablesRecordsCount(data, routes, tables);
    var topBarRecordsCountElements = {
      'possible-buys-log': ['topPossibleBuyLogLength'],
      'pairs-log': ['topPairsLogLength'],
      'pending-log': ['topPendingLogLength'],
      'sales-log': ['topSalesLogLength'],
      'dca-log': ['topDcLogLength'],
      'dust-log': ['topDustLogLength']
    };

    updatePageTitle(data, tableRecordsCount);
    if (!summaryTemp && !tableRecordsCount) {
      return;
    }
    // Records count in side menu
    highlightRecordsCountInSideMenu(oldTableRecordsCount, tableRecordsCount, currentPage, navBarElements);
    // Records count in top menu
    highlightRecordsCountInSideMenu(oldTableRecordsCount, tableRecordsCount, currentPage, topBarRecordsCountElements);

    var summary = NormalizerService.normalizeSummaryData(summaryTemp, 2);
    var precisionTo3 = {
      balance: 'balance',
      totalCurrentVal: 'totalCurrentVal',
      startBalance: 'startBalance',
      lastWeekProfit: 'lastWeekProfit',
      yesterdayProfit: 'yesterdayProfit',
      todayProfit: 'todayProfit'
    };
    var nrmlsdTmpData = NormalizerService.addPrecisionForMultipleValues(precisionTo3, summaryTemp, 3);
    $.extend(summary, nrmlsdTmpData);
    $monitorSummary.addClass(updatingSummaryClass);
    var navBarElementsObj = {
      balance: ['nBalanceVal', '', 'balance'],
      totalCurrentVal: ['nTotalCurrentVal', '', 'totalCurrentVal'],
      startBalance: ['nStartBalance', '', 'startBalance'],
      marketTrendAvg: ['nMarketTrend', 'marketTrendAvgClass', 'marketTrendAvg'],
      normalizedMarketPrice: ['nMarketPrice', '', 'normalizedMarketPrice'],
      normalizedMarket: ['nMarket', '', 'marketTitle'],
      lastWeekProfit: ['nLastWeekProfit', '', 'lastWeekProfit'],
      yesterdayProfit: ['nYesterdayProfit', '', 'yesterdayProfit'],
      todayProfit: ['nTodayProfit', '', 'todayProfit'],
      currencySymbol: ['apiCurrency']
    };
    DomHelper.checkAndBindData(navBarElementsObj, summary, PBConstants.POSSIBLE_CLASSES, summary);
    jQuery('#nMarketPercChange').html('(' + summary.normalizedMarketPercChange + ')').attr('title', summary.normalizedMarketPercChange)
      .removeClass(PBConstants.POSSIBLE_CLASSES).addClass(summary.normalizedMarketPercChangeClass);
    $('#nMarketTrendLabel').attr('title', i18next.t('summaryItems.trend.title') + ' ' + summary.apiMarket + i18next.t('summaryItems.trend.suffix'));
    $monitorSummary.removeClass(updatingSummaryClass);
    var monitorInfoMblTxt = $($('.monitor-summary').get(0).outerHTML).addClass('mointor-summary-title').removeClass('monitor-summary').get(0).outerHTML;
    $('.monitor-info-mbl').find('a').attr('data-original-title', monitorInfoMblTxt);
    $('#apiCurrency').attr('data-original-title', summary.currencySymbolTitle);
    updateSubHeader(data);
  }

  /**
   * It highlights the records count in side menu if they got changed.
   * @param {*} oldTableRecordsCount
   * @param {*} tableRecordsCount
   * @param {*} currentPage
   * @param {*} navBarElements
   */
  function highlightRecordsCountInSideMenu (oldTableRecordsCount, tableRecordsCount, currentPage, navBarElements) {
    var classedObj = {};
    var recordsCountClasses = $.isEmptyObject(oldTableRecordsCount) ? '' : RECORDS_COUNT_CLASSES;
    // On page load oldTablerecordscount will be empty.
    if (!$.isEmptyObject(oldTableRecordsCount)) {
      // Should not highlight current page records count.
      delete oldTableRecordsCount[currentPage];
      // Add current page to nav bar elements to add primary badge to current page logs count.
      if (navBarElements[currentPage]) {
        classedObj[currentPage] = DEFAULT_RECORDS_COUNT_CLASS;
        navBarElements[currentPage].push(currentPage);
      }

      for (var table in oldTableRecordsCount) {
        // If previous records count and current records count are not equal then highlight that records count.
        if (oldTableRecordsCount[table] !== tableRecordsCount[table]) {
          classedObj[table] = RECORDS_COUNT_HIGHLIGHT_CLASS;
          navBarElements[table].push(table);
        } else {
          classedObj[table] = DEFAULT_RECORDS_COUNT_CLASS;
          navBarElements[table].push(table);
        }
      }
    }
    DomHelper.checkAndBindData(navBarElements, tableRecordsCount, recordsCountClasses, classedObj);
  }

  /**
   * When a user clicks on menu item then remove records count highlighted color in side menu
   * and show in normal color.
   */
  function removeHighlightRecordsCountInSideMenu ($currentMenuItem) {
    $currentMenuItem.find('.records-count').removeClass(RECORDS_COUNT_HIGHLIGHT_CLASS).addClass(DEFAULT_RECORDS_COUNT_CLASS);
  }

  function cbUpdateFooter (data) {
    var elems = {
      version: ['apiVersion']
    };
    DomHelper.checkAndBindData(elems, data);
  }


  /**
   * It updates second header.
   * @param {*} dataTmp
   */
  function updateSubHeader (dataTmp) {
    var data = $.extend(dataTmp, NormalizerService.getSecondHeaderData(dataTmp));
    var elems = {
      exchange: ['apiExchange'],
      market: ['apiMarket'],
      sellOnlyMode: ['apiSellOnlyMode', 'sellOnlyModeClass'],
      sellOnlyModeOverride: ['apiSellOnlyModeOverride', 'sellOnlyModeOverrideClass'],
      passwordSet: ['apiPasswordSet', 'passwordSetClass'],
      configEnabled: ['apiConfigEnabled', 'configEnabledClass']
    };
    DomHelper.checkAndBindData(elems, data, PBConstants.POSSIBLE_BADGES, data);
    $('#apiSellOnlyModeLabel').attr('data-original-title', data.sellOnlyModeToolTip);
    data.isTestMode ? $testModeContainer.show() : $testModeContainer.hide();
  }



  // On window resize set ace editor height.
  function handleWindowResize () {
    var resized;
    $(window).on('resize orientationChanged', function () {
      clearTimeout(resized);
      resized = setTimeout(function () {
        setConfigurationContainerHeight();
        setMainContentMarginAndHeight();
      }, 400);
    });
  }

  // On click on save button call save api
  $('body').on('click', '.save-config', function () {
    var queryString = getUrlVars();
    var filename = queryString.file || 'configuration.properties';
    var updatedData = editor.getValue();
    // Set configuration data
    Service.saveConfigFile(filename, updatedData).done(function (data, textStatus, jqXHR) {
      if (jqXHR.status === PBConstants.SUCCESS_CODE) {
        hideConfigurationNotSaved();
        toastr.success(i18next.t('constantMsgs.configSuccess'));
      } else {
        toastr.info(i18next.t('constantMsgs.ajaxError'));
      }
    });
  });




  /**
   * It hides the configuration menu if enable config property
   * is false. It shows the configuration menu if enable config property
   * is true.
   * @param {*} data
   */
  function showOrHideConfigurationMenu (data) {
    if (data.hasOwnProperty('settings') && data.settings.hasOwnProperty('enableConfig') && data.settings.enableConfig) {
      $configurationMenu.show();
    } else {
      $configurationMenu.hide();
      // If a user is in configuration pages then redirect to monitoring page and
      // collapse the configuration menu
      var currentPath = window.history.state.path;
      if (currentPath.indexOf('config') !== -1) {
        $configurationMenu.find('a').trigger('click');
        // In lower resolutions
        var lowerResolutionsMenu = $('.smallscreen #configMenu a');
        if (lowerResolutionsMenu.length) {
          lowerResolutionsMenu.trigger('touchstart');
        }
        showMonitoring();
      }
    }
  }

  function cbLoadConfig () {
    if (editor) {
      editor.destroy();
    }
    // Get current path with query string
    var currentPath = 'config' + window.location.search;
    var $configurationLink = $('#sidebar-menu [href="' + currentPath + '"]');

    var isDesktopResolution = window.innerWidth > LOWEST_DESKTOP_RESOLUTION;

    // If a configuration link is not highlighted then trigger links click events.
    if ($configurationLink.length && $configurationLink.parents('.has_sub').find('.subdrop').length < 1 && !isDesktopResolution) {
      // Click on links.
      $('#sidebar-menu .config').trigger('touchstart').trigger('click');
      $configurationLink.trigger('touchstart').trigger('click');
      return;
    }

    // Set heading
    var currentConfiguration = isDesktopResolution ? $topNav.find('.submenu .active a').text() : $('.subdrop').last().text();
    currentConfiguration ? $('#configurationHeading').html(currentConfiguration) : '';
    // Set ace editor height
    setConfigurationContainerHeight();
    editor = DomHelper.getGlobalEditor();
    editor.focus();
    var queryString = getUrlVars();
    var filename = queryString.file || 'configuration.properties';
    // For some config files there is no get functionality only save functionality is there.
    if ($.inArray(filename, onlySaveConfigFiles) === -1) {
      // Get configuration data only
      Service.getConfigFile(filename).done(function (data) {
        if (data) {
          data = $.isArray(data) ? data.join('\n') : data;
          editor.setValue(data, -1);
          hideConfigurationNotSaved();
        } else {
          toastr.info(i18next.t('constantMsgs.ajaxError'));
        }
      });
    }
    handleEditorContentChange(editor);
  }

  /**
   * When a user changes some thing in ace editor then show not saved error message.
   * @param {*} editor
   */
  function handleEditorContentChange (editor) {
    editor.getSession().on('change', function () {
      $('.show-save-message').show().addClass('not-saved');
    });
  }

  /**
   * Set ace editor height
   */
  function setConfigurationContainerHeight () {
    var occupiedHeight = $('.editor-container').position().top + $('.footer').outerHeight() + PBConstants.HEIGHT_REMOVE_TO_FIX_SCROLLBAR;
    var remainingHeight = $(window).outerHeight() - occupiedHeight;
    $('.editor-container').css('height', remainingHeight + 'px');
    editor ? editor.resize() : '';
  }

  /** ******************************
   * END of page load callbacks
   *******************************/


  /**
   * Get tables summary.
   * @param {*} data
   */
  function getTablesInfo (data) {
    if (!data.settings) {
      return false;
    }

    var summaryTables = ['pairs-log', 'pending-log', 'dca-log', 'sales-log'];
    var returnObj = {};
    // Loop over the tables and get summary values.
    for (var i = 0; i < summaryTables.length; i++) {
      var summaryTable = summaryTables[i];
      var jsonProp = routes[summaryTable].json;
      // Some routes have two json properties, we have to concat both properties data.
      var summaryTableData = Array.isArray(jsonProp) && Array.isArray(data[jsonProp[1]]) ? data[jsonProp[0]].concat(data[jsonProp[1]]) : data[jsonProp];
      summaryTableData = summaryTableData ? summaryTableData : [];
      var currentValue = 0;
      var boughtCost = 0;
      var currentValueTmp;
      if (summaryTable === 'sales-log') {
        for (var j = 0; j < summaryTableData.length; j++) {
          var currentObjSalesLog = summaryTableData[j];
          currentValueTmp = (currentObjSalesLog.soldAmount * currentObjSalesLog.currentPrice);
          currentValue += DataTableHelper.getCurrentValueBsdOnfee(currentObjSalesLog, currentValueTmp);
          boughtCost += currentObjSalesLog.soldAmount * currentObjSalesLog.averageCalculator.avgPrice;
        }
      } else {
        for (var k = 0; k < summaryTableData.length; k++) {
          var currentObj = summaryTableData[k];
          currentValueTmp = (currentObj.averageCalculator.totalAmount * currentObj.currentPrice);
          currentValue += DataTableHelper.getCurrentValueBsdOnfee(currentObj, currentValueTmp);
          boughtCost += currentObj.averageCalculator.totalCost;
        }
      }
      returnObj[summaryTable] = {
        currentValueConvertedValue: DataTableHelper.normalizeValueWithCommas(currentValue, 'display', '', '', '', serverData.currentMarketPrecision),
        boughtCostConvertedValue: DataTableHelper.normalizeValueWithCommas(boughtCost, 'display', '', '', '', serverData.currentMarketPrecision),
        currentValue: currentValue,
        boughtCost: boughtCost
      };
    }
    return returnObj;
  }

  function addUTCTimer () {
    var utcTime = DateTimeHelper.getUTCTimeOnly();
    var currentTime = DateTimeHelper.getCurrentTimeZoneTime(serverData.timeZoneOffset);
    $utcTime.html(utcTime);
    $currentTime.html(currentTime);
    setTimeout(addUTCTimer, 500);
  }

  function getUrlVars () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  function reloadPageOnInactivity(duration) {
    var events = ['onclick', 'onmousemove', 'onmousedown', 'ontouchstart', 'onload', 'onscroll', 'onkeypress'];
    var lastActiveTime = new Date();
    for (var i = 0; i !== events.length; i++) {
      document[events[i]] = trackInactivity;
    }

    function trackInactivity() {
      lastActiveTime = new Date();      
    }

    function refreshPage() {
      if (duration * 60 < getTimeDiffInSeconds(lastActiveTime)) {
        location.reload();
      }
      setTimeout(refreshPage, 1000);
    }

    function getTimeDiffInSeconds(lastActiveTime) {
      return (new Date().getTime() - lastActiveTime.getTime()) / 1000;
    }

    refreshPage();
  }
});
