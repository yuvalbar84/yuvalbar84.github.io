function getTableRefs ($) {
  var tables = {
    dtSellLogs: null,
    dtPossibleBuys: null,
    dtDcaLogs: null,
    dtPairsLogs: null,
    dtPendingLogs: null,
    dtDustLogs: null
  };
  var cache = null;
  var Service = Services(PBConstants.BASE_API_URL, PBConstants.MARKET_CAP_API_URL);
  var NormalzerService = Service.Normalizer;

  function destroyTable () {
    for (var table in tables) {
      if (!tables[table]) {
        continue;
      }
      // destroy the table.
      if (tables[table].destroy) {
        tables[table].destroy(true);
        tables[table] = null;
      }
    }
  }

  /**
   * Called to render the sell log datatable.
   * @param {any} sellLogData
   * @returns
   */
  function loadSellLogData (sellLogData) {
    var excelColumns = DataTableHelper.getExcelColumns(19, [0, 10, 13, 17], [8, 15, 18]);
    var salesLogButtons = [
      {
        extend: 'excel',
        className: 'btn btn-dark',
        title: i18next.t('sidebar.salesLog'),
        exportOptions: {
          columns: excelColumns,
          orthogonal: 'export'
        },
        filename: 'sales-log-' + DataTableHelper.getCurrentDateForFileName(),
        text: i18next.t('dtMsgs.excel')
      }
    ];
    var boughtCostIndex = 14;
    var soldValueIndex = 16;
    var hideCurrencyValueIndex = [8, 17];
    var $salesLogDataTable = $('#dtSalesLog');
    if (tables.dtSellLogs) {
      DataTableHelper.addButtons(tables.dtSellLogs, salesLogButtons, 'dtSalesLog');
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtSellLogs, sellLogData);
      DataTableHelper.setDTPagination(tables.dtSellLogs);
      addTooltips(tables.dtSellLogs);
      DataTableHelper.hideCurrencyValues(tables.dtSellLogs, hideCurrencyValueIndex);
      return colTotals(tables.dtSellLogs, {
        boughtCost: boughtCostIndex,
        soldValue: soldValueIndex
      });
    }
    var columns = [{
      title: i18next.t('salesLogSection.date.colName'),
      data: DataTableHelper.dateHandler('soldDate'),
      tooltip: 'salesLogSection.date.colTitle',
      responsivePriority: 1,
      className: 'date'
    }, {
      title: i18next.t('salesLogSection.coin.colName'),
      data: 'market',
      tooltip: 'salesLogSection.coin.colTitle',
      className: 'market',
      responsivePriority: 1,
      render: DataTableHelper.renderMarketCol
    }, {
      title: i18next.t('salesLogSection.sellStrat.colName'),
      data: 'sellStrategies',
      tooltip: 'salesLogSection.sellStrat.colTitle',
      responsivePriority: 1,
      render: DataTableHelper.renderSellStrategy,
      className: 'sell-strategy'
    }, {
      title: i18next.t('salesLogSection.profit.colName'),
      data: 'profit',
      tooltip: 'salesLogSection.profit.colTitle',
      responsivePriority: 1,
      className: 'text-center profit',
      /**
       * Display only the last 2 digits
       * https://datatables.net/reference/option/columns.render
       */
      render: DataTableHelper.handleProfit
    }, {
      title: i18next.t('salesLogSection.profitSolo.colName', {'market': ' <span class="api-market"> </span>'}),
      tooltip: 'salesLogSection.profitSolo.colTitle',
      data: DataTableHelper.getProfitBTCForSalesLog,
      className: 'text-right profit-btc',
      responsivePriority: 1
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'salesLogSection.profitCurrency.colTitle',
      data: DataTableHelper.getCurrentTrendprofit,
      responsivePriority: 1,
      className: 'text-right profit-btc',
    }, {
      title: i18next.t('salesLogSection.soldAmount.colName'),
      data: 'soldAmount',
      tooltip: i18next.t('salesLogSection.soldAmount.colTitle'),
      responsivePriority: 5,
      // Will be visible in all the resolutions (all class will take precedence over other classes)
      className: 'text-right sold-amount'
    }, {
      title: i18next.t('salesLogSection.boughtSoldPrice.colName'),
      data: DataTableHelper.handleAvgPriceBoughtTimes(),
      tooltip: 'salesLogSection.boughtSoldPrice.colName',
      responsivePriority: 4,
      className: 'text-right bought-price blue-color'
    }, {
      title: i18next.t('salesLogSection.boughtPrice.colName'),
      data: DataTableHelper.handleAvgPriceBoughtTimes(true),
      visible: false,

    }, {
      title: i18next.t('salesLogSection.soldPrice.colName'),
      data: DataTableHelper.handleAvgPriceBoughtTimes(false, true),
      visible: false
    }, {
      title: i18next.t('salesLogSection.boughtSoldValue.colName'),
      data: DataTableHelper.handleBoughtSoldCstFrSalesLog,
      tooltip: 'salesLogSection.boughtSoldValue.colName',
      responsivePriority: 3,
      // Will be visible only on table and desktop
      className: 'text-right sold-value'
    }, {
      title: i18next.t('salesLogSection.boughtCost.colName'),
      data: DataTableHelper.handleTotalCstFrSalesLog(true),
      visible: false
    }, {
      title: '<span class="api-currency"> </span>',
      data: DataTableHelper.handleTotalCstFrSalesLog(false, true),
      class: 'hide'
    }, {
      title: i18next.t('salesLogSection.soldValue.colName'),
      data: DataTableHelper.getCurrentValueForSalesLog(true),
      visible: false
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'salesLogSection.boughtSoldValueCurrency.colTitle',
      data: DataTableHelper.handleBoughtSoldCstCrncy,
      responsivePriority: 2,
      className: 'text-right sold-value',
    }, {
      title: '<span class="api-currency"> </span>',
      data: DataTableHelper.getCurrentValueForSalesLog(false, true),
      class: 'hide'
    }];
    columns = DataTableHelper.getExportDateColumns(columns, 1, 'soldDate');
    DataTableHelper.getCurrentPaginationNumber('dtSalesLog');
    // Initialize the table.
    // We have to give below classes to show in that particular resolution
    // Classes:
    // not-mobile : Only in Tablets and desktop
    // min-tablet-l: Only in landscape tablet and desktop
    // min-tablet-p: Only in portrait tablet and desktop
    // tablet: Only in tablet
    // desktop: Only in desktop
    // all: In all the resolutions, takes precedence over other classes
    // mobile-l : Only in landscape mobiles

    // Reference: https://datatables.net/extensions/responsive/classes#Logic-reference
    // Note : Responsiveness will not work if we want to show more columns than window width
    // Landscape(l) and Portrait(p) applies to tablet, mobile and desktop
    tables.dtSellLogs = DataTableHelper.initDataTable($salesLogDataTable, DataTableHelper.getDataTableStructure({
      data: sellLogData,
      fixedColumnsLength: 5,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, i18next.t('dtMsgs.all')]],
      pageLength: 25,
      searching: true,
      dom: 'lfrtipB',
      order: [[0, 'desc']],
      paging: true,
      buttons: salesLogButtons,
      language: {
        search: i18next.t('dtMsgs.search'),
        lengthMenu: i18next.t('dtMsgs.showEntries'),
        paginate: {
          previous: i18next.t('dtMsgs.previous'),
          next: i18next.t('dtMsgs.next')
        }
      },
      className: 'btn btn-dark',
      columns: columns
    }));
    addTooltips(tables.dtSellLogs);
    DataTableHelper.hideCurrencyValues(tables.dtSellLogs, hideCurrencyValueIndex);
    return colTotals(tables.dtSellLogs, {
      boughtCost: boughtCostIndex,
      soldValue: soldValueIndex
    });

  }

  /**
   * It adds tooltip for datatable headers.
   * @param {*} dataTable 
   * @param {*}  $table
   */
  function addTooltips (dataTable) {
    var currency = '';
    var market = '';
    if (cache) {
      currency = cache.currency;
      market = cache.market;
    }
    dataTable.columns().iterator('column', function (settings, column) {
      if (settings.aoColumns[column].tooltip !== undefined) {
        var title = i18next.t(settings.aoColumns[column].tooltip, { currency: currency, market: market });
        $(dataTable.column(column).header()).attr('title', title);
      }
    });
    $(dataTable.tables().table().header()).find('th').tooltip('dispose').tooltip({
      placement: 'top',
      html: true,
      fixTitle: true
    });
  }

  function cbUpdateDtCache (data) {
    cache = {
      marketingSite: data.exchangeUrl,
      timeZoneOffset: data.timeZoneOffset,
      market: data.market,
      marketPrice: data[data.market + 'USDTPrice'] ? data[data.market + 'USDTPrice'] : 1,
      currency: data.currency,
      currencyValue: data.currencyValue,
      currencySymbol: data.currencySymbol,
      currentMarketPrecision: data.currentMarketPrecision
    };
    cache[data.market + 'USDTPrice'] = data[data.market + 'USDTPrice'];
    DataTableHelper.setDataCache(cache);
  }

  /**
   * Called to render the possible buys datatable
   * @param {any} possibleBuyData
   */
  function loadPossibleBuyData (possibleBuyData) {
    var $possibleLogDataTable = $('#dtPossibleBuysLog');
    if (tables.dtPossibleBuys) {
      addTooltips(tables.dtPossibleBuys);
      // table is already initialized, just rebind the data.
      return DataTableHelper.reBindData(tables.dtPossibleBuys, possibleBuyData);
    }

    // initialize the table.
    tables.dtPossibleBuys = DataTableHelper.initDataTable($possibleLogDataTable, DataTableHelper.getDataTableStructure({
      order: [[3, 'desc']],
      data: possibleBuyData,
      fixedColumnsLength: 1,
      buttons: [
        {
          extend: 'excel',
          exportOptions: { orthogonal: 'export' },
          className: 'btn btn-dark',
          title: i18next.t('sidebar.buyLog'),
          filename: 'possible-buy-log-' + DataTableHelper.getCurrentDateForFileName(),
          text: i18next.t('dtMsgs.excel')
        }],
      columns: [{
        title: i18next.t('psbSection.coin.colName'),
        data: 'market',
        tooltip: 'psbSection.coin.colTitle',
        className: 'market',
        render: DataTableHelper.renderCombinedMarketCol
      }, {
        title: i18next.t('psbSection.currPrice.colName'),
        data: 'currentPrice',
        tooltip: 'psbSection.currPrice.colTitle',
        className: 'text-right blue-color current-price',
        render: DataTableHelper.currentMarketPrecision
      }, {
        title: i18next.t('psbSection.vol.colName'),
        data: 'volume',
        tooltip: 'psbSection.vol.colTitle',
        className: 'text-right volume',
        responsivePriority: 2,
        render: DataTableHelper.renderVolume
      }, {
        title: i18next.t('psbSection.buyStrat.colName'),
        data: 'buyStrategies',
        tooltip: 'psbSection.buyStrat.colTitle',
        className: 'buy-strategy',
        render: DataTableHelper.renderBuyStrategy
      }, {
        title: i18next.t('psbSection.currVal.colName'),
        data: 'buyStrategies',
        tooltip: 'psbSection.currVal.colTitle',
        className: 'text-right blue-color current-value',
        render: DataTableHelper.checkAllValAndHandleStratCurVal
      }, {
        title: i18next.t('psbSection.buyVal.colName'),
        data: 'buyStrategies',
        tooltip: 'psbSection.buyVal.colTitle',
        className: 'text-right buy-value',
        render: DataTableHelper.checkAllValAndHandleStratEntryVal
      },
      {
        title: i18next.t('psbSection.buyLimit.colName'),
        data: 'buyStrategies',
        tooltip: 'psbSection.buyLimit.colTitle',
        className: 'text-right',
        responsivePriority: 1,
        render: DataTableHelper.handlePBEntryLimit
      }]
    }));
    addTooltips(tables.dtPossibleBuys);
  }

  function loadPendingLogsData (pendingLogsData) {
    var $dtPendingLogs = $('#dtPendingLogs');
    var excelColumns = DataTableHelper.getExcelColumns(14, [2, 8, 13], [12, 10]);
    var hideCurrencyValueIndex = 13;
    var currentValueIndex = 9;
    var totalCostIndex = 11;
    var pendingLogsButtons = [
      {
        extend: 'excel',
        exportOptions: {
          columns: excelColumns,
          orthogonal: 'export'
        },
        className: 'btn btn-dark',
        title: i18next.t('sidebar.pendingLog'),
        filename: 'pending-log-' + DataTableHelper.getCurrentDateForFileName(),
        text: i18next.t('dtMsgs.excel')
      }];
      if (tables.dtPendingLogs) {
        DataTableHelper.addButtons(tables.dtPendingLogs, pendingLogsButtons, 'dtPendingLogs');
        // table is already initialized, just rebind the data.
        DataTableHelper.reBindData(tables.dtPendingLogs, pendingLogsData);
        DataTableHelper.hideCurrencyValues(tables.dtPendingLogs, [hideCurrencyValueIndex]);
        addTooltips(tables.dtPendingLogs);
        return colTotals(tables.dtPendingLogs, {
          currentValue: currentValueIndex,
          totalCost: totalCostIndex
        });
      }
    // initialize the table.
    tables.dtPendingLogs = DataTableHelper.initDataTable($dtPendingLogs, DataTableHelper.getDataTableStructure({
      data: pendingLogsData,
      fixedColumnsLength: 1,
      order: [[5, 'desc']],
      buttons: pendingLogsButtons,
      columns: [{
        title: i18next.t('pendingLogSection.coin.colName'),
        data: 'market',
        tooltip: 'pendingLogSection.coin.colTitle',
        className: 'market',
        responsivePriority: 1,
        render: DataTableHelper.renderCombinedMarketCol
      }, {
        title: i18next.t('pendingLogSection.sellStrat.colName'),
        data: 'sellStrategies',
        tooltip: 'pendingLogSection.sellStrat.colTitle',
        render: DataTableHelper.renderStrategy,
        responsivePriority: 1,
        className: 'sell-strategy'
      }, {
        title: i18next.t('pendingLogSection.currPriceTargetPrice.colName'),
        data: DataTableHelper.handleAvgValAndCurrentPrice(),
        tooltip: 'pendingLogSection.currPriceTargetPrice.colTitle',
        responsivePriority: 1,
        className: 'text-right target-price'
      }, {
        title: i18next.t('dataTableSection.currPrice.colName'),
        data: DataTableHelper.handleAvgValAndCurrentPrice(true),
        visible: false
      }, {
        title: i18next.t('dataTableSection.targetPrice.colName'),
        data: DataTableHelper.handleAvgValAndCurrentPrice(false, true),
        visible: false
      }, {
        title: i18next.t('pendingLogSection.profit.colName'),
        data: 'profit',
        tooltip: 'pendingLogSection.profit.colTitle',
        className: 'text-center profit',
        responsivePriority: 1,
        render: DataTableHelper.handleProfit
      }, {
        title: i18next.t('pendingLogSection.comboProfit.colName'),
        data: 'combinedProfit',
        tooltip: 'pendingLogSection.comboProfit.colTitle',
        className: 'text-center profit',
        responsivePriority: 1,
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: i18next.t('pendingLogSection.totalAmount.colName'),
        data: DataTableHelper.handleTotalAmnt,
        tooltip: 'pendingLogSection.totalAmount.colTitle',
        responsivePriority: 3,
        className: 'text-right total-amount'
      }, {
        title: i18next.t('pendingLogSection.currVal.colName'),
        data: DataTableHelper.getCurrentValAndTotalCost(true),
        tooltip: 'pendingLogSection.currVal.colTitle',
        responsivePriority: 2,
        className: 'text-right blue-color current-value'
      }, {
        title: i18next.t('dataTableSection.currVal.colName'),
        data: DataTableHelper.getCurrentValue(true),
        visible: false
      }, {
        title: '<span class="api-currency"> </span>',
        data: DataTableHelper.getCurrentValue(false, true),
        class: 'hide'
      }, {
        title: i18next.t('pendingLogSection.targetVal.colName'),
        data: DataTableHelper.handleTotalCst(true),
        tooltip: 'pendingLogSection.targetVal.colTitle',
        responsivePriority: 1,
        className: 'text-right target-value hide'
      }, {
        title: '<span class="api-currency"> </span>',
        data: DataTableHelper.handleTotalCst(false, true),
        class: 'hide'
      }, {
        title: '<span class="api-currency"> </span>',
        tooltip: 'pendingLogSection.targetCurrentValCurrency.colTitle',
        data: DataTableHelper.getCurrentValAndTotalCost(false, true),
        responsivePriority: 1,
        className: 'text-right blue-color current-value'
      }]
    }));
    addTooltips(tables.dtPendingLogs);
    DataTableHelper.hideCurrencyValues(tables.dtPendingLogs, hideCurrencyValueIndex);
    return colTotals(tables.dtPendingLogs, {
      currentValue: currentValueIndex,
      totalCost: totalCostIndex
    });
  }

  function loadDcaLogsData (dcaLogData) {
    var excelColumns = DataTableHelper.getExcelColumns(25, [0, 5, 19, 21], [22, 24]);
    var $dtDcaLogs = $('#dtDcaLogs');
    var currentValueIndex = 20;
    var totalCostIndex = 23;
    var hideCurrencyValueIndex = [21];
    var dcaLogsButtons = [
      {
        extend: 'excel',
        className: 'btn btn-dark',
        exportOptions: {
          columns: excelColumns,
          orthogonal: 'export'
        },
        title: i18next.t('sidebar.dcaLog'),
        filename: 'dca-log-' + DataTableHelper.getCurrentDateForFileName(),
        text: i18next.t('dtMsgs.excel')
      }];
      if (tables.dtDcaLogs) {
        DataTableHelper.addButtons(tables.dtDcaLogs, dcaLogsButtons, 'dtDcaLogs');
        // table is already initialized, just rebind the data.
        DataTableHelper.reBindData(tables.dtDcaLogs, dcaLogData);
        DataTableHelper.hideCurrencyValues(tables.dtDcaLogs, hideCurrencyValueIndex);
        addTooltips(tables.dtDcaLogs);
        return colTotals(tables.dtDcaLogs, {
          currentValue: currentValueIndex,
          totalCost: totalCostIndex
        });
      }

    var columns = [{
      title: i18next.t('dcaLogSection.date.colName'),
      data: DataTableHelper.dateHandler('firstBoughtDate', 'averageCalculator'),
      tooltip: 'dcaLogSection.date.colTitle',
      responsivePriority: 1,
      className: 'date'
    }, {
      title: i18next.t('dcaLogSection.coin.colName'),
      data: 'market',
      tooltip: 'dcaLogSection.coin.colTitle',
      className: 'market',
      responsivePriority: 1,
      render: DataTableHelper.renderCombinedMarketCol
    }, {
      title: i18next.t('dcaLogSection.currPrice.colName'),
      data: DataTableHelper.handleAvgPriceDcaLog(),
      tooltip: 'dcaLogSection.currPrice.colTitle',
      responsivePriority: 2,
      className: 'text-right blue-color avg-price current-price'
    }, {
      title: i18next.t('dataTableSection.currPrice.colName'),
      data: DataTableHelper.handleAvgPriceDcaLog(true),
      visible: false
    }, {
      title: i18next.t('dataTableSection.avgPrice.colName'),
      data: DataTableHelper.handleAvgPriceDcaLog(false, true),
      visible: false
    }, {
      title: i18next.t('dcaLogSection.buyStrat.colName'),
      data: 'buyStrategies',
      responsivePriority: 1,
      tooltip: 'dcaLogSection.buyStrat.colName',
      className: 'buy-strategy',
      render: DataTableHelper.renderBuyStrategy
    }, {
      title: i18next.t('dcaLogSection.buyStratVal.colName'),
      data: 'buyStrategies',
      responsivePriority: 1,
      tooltip: 'dcaLogSection.buyStratVal.colTitle',
      render: DataTableHelper.checkAllValAndHandleStratCurVal,
      className: 'text-right current-value strat-current-val '
    }, {
      title: i18next.t('dcaLogSection.buyEntryVal.colName'),
      data: 'buyStrategies',
      tooltip: 'dcaLogSection.buyEntryVal.colTitle',
      render: DataTableHelper.checkAllValAndHandleStratEntryVal,
      responsivePriority: 4,
      className: 'text-right strat-entry-val'
    }, {
      title: i18next.t('dcaLogSection.buyEntryTrigger.colName'),
      data: 'buyStrategies',
      tooltip: 'dcaLogSection.buyEntryTrigger.colTitle',
      responsivePriority: 1,
      render: DataTableHelper.renderDCAEntryAndEntryLimit,
      className: 'text-right'
    }, {
      title: i18next.t('dcaLogSection.bt.colName'),
      data: 'buyProfit',
      tooltip: 'dcaLogSection.bt.colTitle',
      className: 'text-center buy-profit',
      render: DataTableHelper.handleMoney,
      responsivePriority: 1,
      createdCell: DataTableHelper.handleProfitText
    }, {
      title: i18next.t('dcaLogSection.sellStrat.colName'),
      data: 'sellStrategies',
      tooltip: 'dcaLogSection.sellStrat.colTitle',
      render: DataTableHelper.renderStrategy,
      responsivePriority: 1,
      className: 'sell-strategy'
    }, {
      title: i18next.t('dcaLogSection.sellStratVal.colName'),
      data: 'sellStrategies',
      tooltip: 'dcaLogSection.sellStratVal.colTitle',
      render: DataTableHelper.checkAllValAndHandleStratCurVal,
      responsivePriority: 1,
      className: 'text-right current-value strat-current-val '
    }, {
      title: i18next.t('dcaLogSection.sellEntryVal.colName'),
      data: 'sellStrategies',
      tooltip: 'dcaLogSection.sellEntryVal.colTitle',
      render: DataTableHelper.checkAllValAndHandleStratEntryVal,
      rresponsivePriority: 3,
      className: 'text-right strat-entry-val'
    }, {
      title: i18next.t('dcaLogSection.profit.colName'),
      data: DataTableHelper.handleOrderBookProfit,
      tooltip: 'dcaLogSection.profit.colTitle',
      responsivePriority: 1,
      className: 'text-center profit'
    }, {
      title: i18next.t('dcaLogSection.vol.colName'),
      data: 'volume',
      tooltip: 'dcaLogSection.vol.colTitle',
      className: 'text-right volume',
      responsivePriority: 8,
      render: DataTableHelper.renderVolume
    }, {
      title: i18next.t('dcaLogSection.totalAmount.colName'),
      data: DataTableHelper.handleTotalAmnt,
      tooltip: 'dcaLogSection.totalAmount.colTitle',
      responsivePriority: 7,
      className: 'text-right total-amount'
    }, {
      title: i18next.t('dcaLogSection.currVal.colName'),
      data: DataTableHelper.getCurrentValAndTotalCost(true),
      tooltip: 'dcaLogSection.currVal.colTitle',
      responsivePriority: 6,
      className: 'text-right blue-color current-value'
    },
    {
      title: i18next.t('dataTableSection.currVal.colName'),
      data: DataTableHelper.getCurrentValue(true),
      visible: false
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'dcaLogSection.currentTotalCstValCurrency.colTitle',
      data: DataTableHelper.getCurrentValAndTotalCost(false, true),
      responsivePriority: 5,
      className: 'text-right blue-color current-value'
    }, {
      title: '<span class="api-currency"> </span>',
      data: DataTableHelper.getCurrentValue(false, true),
      class: 'hide'
    }, {
      title: i18next.t('dcaLogSection.totalCost.colName'),
      data: DataTableHelper.handleTotalCst(true),
      tooltip: 'dcaLogSection.totalCost.colTitle',
      className: 'text-right total-cost hide'
    }, {
      title: '<span class="api-currency"> </span>',
      data: DataTableHelper.handleTotalCst(false, true),
      class: 'hide'
    }];
    columns = DataTableHelper.getExportDateColumns(columns, 1, 'firstBoughtDate', 'averageCalculator');
    // initialize the table.
    tables.dtDcaLogs = DataTableHelper.initDataTable($dtDcaLogs, DataTableHelper.getDataTableStructure({
      data: dcaLogData,
      fixedColumnsLength: 5,
      order: [[16, 'desc']],
      buttons: dcaLogsButtons,
      columns: columns
    }));

    DataTableHelper.hideCurrencyValues(tables.dtDcaLogs, hideCurrencyValueIndex);
    addTooltips(tables.dtDcaLogs);

    return colTotals(tables.dtDcaLogs, {
      currentValue: currentValueIndex,
      totalCost: totalCostIndex
    });
  }

  function loadDustLogsData (gainLogData, watchModeLogData) {
    var $dtDustLogs = $('#dtDustLogs');
    var excelColumns = DataTableHelper.getExcelColumns(17, [0, 3, 6, 9, 13], [11, 14]);
    var finalData = gainLogData;
    var hideCurrencyValueIndex = [13];
    var currentValueIndex = 10;
    var totalCostIndex = 12;
    var dustLogsBtns = [
      {
        extend: 'excel',
        className: 'btn btn-dark',
        title: i18next.t('sidebar.dustLog'),
        exportOptions: {
          columns: excelColumns,
          orthogonal: 'export'
        },
        filename: 'dust-log-' + DataTableHelper.getCurrentDateForFileName(),
        text: i18next.t('dtMsgs.excel'),
      }];
    if (Array.isArray(watchModeLogData)) {
      finalData = gainLogData.concat(watchModeLogData);
    }
    if (tables.dtDustLogs) {
      DataTableHelper.addButtons(tables.dtDustLogs, dustLogsBtns, 'dtDustLogs');
      DataTableHelper.hideCurrencyValues(tables.dtDustLogs, hideCurrencyValueIndex);
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtDustLogs, finalData);
      addTooltips(tables.dtDustLogs);
      return colTotals(tables.dtDustLogs, {
        currentValue: currentValueIndex,
        totalCost: totalCostIndex
      });
    }
    var columns = [{
      title: i18next.t('dustLogSection.date.colName'),
      data: DataTableHelper.dateHandler('firstBoughtDate', 'averageCalculator'),
      tooltip: 'dustLogSection.date.colTitle',
      className: 'date'
    }, {
      title: i18next.t('dustLogSection.coin.colName'),
      data: 'market',
      tooltip: 'dustLogSection.coin.colTitle',
      className: 'market',
      render: DataTableHelper.renderCombinedMarketCol
    }, {
      title: i18next.t('dustLogSection.profit.colName'),
      data: 'profit',
      tooltip: 'dustLogSection.profit.colTitle',
      className: 'text-center profit',
      /**
       * Display only the last 2 digits
       * https://datatables.net/reference/option/columns.render
       */
      render: DataTableHelper.handleProfit
    }, {
      title: i18next.t('dustLogSection.currPriceBoughtPrice.colName'),
      data: DataTableHelper.handleAvgValAndCurrentPrice(),
      tooltip: 'dustLogSection.currPriceBoughtPrice.colTitle',
      className: 'text-right blue-color current-price',
    }, {
      title: i18next.t('dustLogSection.currPrice.colName'),
      data: DataTableHelper.handleAvgValAndCurrentPrice(true),
      className: 'hide'
    }, {
      title: i18next.t('dustLogSection.boughtPrice.colName'),
      data: DataTableHelper.handleAvgValAndCurrentPrice(false, true),
      className: 'hide'
    }, {
      title: i18next.t('dustLogSection.currValBoughtCost.colName'),
      data: DataTableHelper.getCurrentValAndTotalCost(true),
      tooltip: 'dustLogSection.currValBoughtCost.colTitle',
      className: 'text-right blue-color current-value'
    }, {
      title: i18next.t('dustLogSection.currVal.colName'),
      data: DataTableHelper.getCurrentValue(true),
      className: 'hide'
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'dataTableSection.currValCurrency.colTitle',
      data: DataTableHelper.getCurrentValue(false, true),
      className: 'text-right blue-color current-value hide',
    }, {
      title: i18next.t('dustLogSection.boughtCost.colName'),
      data: DataTableHelper.handleTotalCst(true),
      className: 'hide'
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'dustLogSection.boughtCostCurrency.colTitle',
      data: DataTableHelper.getCurrentValAndTotalCost(false, true),
      className: 'text-right bought-cost',
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'dataTableSection.boughtCostCurrency.colTitle',
      data: DataTableHelper.handleTotalCst(false, true),
      className: 'hide',
    }, {
      title: i18next.t('dustLogSection.vol.colName'),
      data: 'volume',
      tooltip: 'dustLogSection.vol.colTitle',
      className: 'text-right volume',
      render: DataTableHelper.renderVolume
    }, {
      title: i18next.t('dustLogSection.totalAmount.colName'),
      data: DataTableHelper.handleTotalAmnt,
      tooltip: 'dustLogSection.totalAmount.colTitle',
      className: 'text-right total-amount'
    }];
    columns = DataTableHelper.getExportDateColumns(columns, 1, 'firstBoughtDate', 'averageCalculator');
    // initialize the table.
    tables.dtDustLogs = DataTableHelper.initDataTable($dtDustLogs, DataTableHelper.getDataTableStructure({
      data: finalData,
      fixedColumnsLength: 5,
      order: [[5, 'desc']],
      buttons: dustLogsBtns,
      language: {
        buttons: {
          copyTitle: 'Dust Log',
        }
      },
      columns: columns
    }));
    DataTableHelper.hideCurrencyValues(tables.dtDustLogs, hideCurrencyValueIndex);
    addTooltips(tables.dtDustLogs);

    return colTotals(tables.dtDustLogs, {
      currentValue: currentValueIndex,
      totalCost: totalCostIndex
    });
  }

  function loadPairLogsData (gainLogData, watchModeLogData) {
    var $dtPairsLogs = $('#dtPairsLogs');
    var excelColumns = DataTableHelper.getExcelColumns(20, [0, 9, 12, 17], [14, 16]);
    var hideCurrentValueIndex = [17];
    var currentValueIndex = 13;
    var totalCostIndex = 15;
    var pairsLogButtons = [
      {
        extend: 'excel',
        className: 'btn btn-dark',
        title: i18next.t('sidebar.pairsLog'),
        exportOptions: {
          columns: excelColumns,
          orthogonal: 'export'
        },
        filename: 'pairs-log-' + DataTableHelper.getCurrentDateForFileName(),
        text: i18next.t('dtMsgs.excel')
      }
    ];

    var finalData = gainLogData;
    if (Array.isArray(watchModeLogData)) {
      finalData = gainLogData.concat(watchModeLogData);
    }
    if (tables.dtPairsLogs) {
      DataTableHelper.addButtons(tables.dtPairsLogs, pairsLogButtons, 'dtPairsLogs');
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtPairsLogs, finalData);
      DataTableHelper.hideCurrencyValues(tables.dtPairsLogs, hideCurrentValueIndex);
      addTooltips(tables.dtPairsLogs);
      // Current value, Total cost
      return colTotals(tables.dtPairsLogs, {
        currentValue: currentValueIndex,
        totalCost: totalCostIndex
      });
    }
    var columns = [{
      title: i18next.t('pairsLogSection.date.colName'),
      data: DataTableHelper.dateHandler('firstBoughtDate', 'averageCalculator'),
      tooltip: 'pairsLogSection.date.colTitle',
      className: 'date ',
      responsivePriority: 1
    }, {
      title: i18next.t('pairsLogSection.coin.colName'),
      data: 'market',
      tooltip: 'pairsLogSection.coin.colTitle',
      className: 'market',
      render: DataTableHelper.renderCombinedMarketCol,
      responsivePriority: 1
    }, {
      title: i18next.t('pairsLogSection.sellStrat.colName'),
      data: 'sellStrategies',
      tooltip: 'pairsLogSection.sellStrat.colTitle',
      render: DataTableHelper.renderStrategy,
      className: 'sell-strategy',
      responsivePriority: 1
    }, {
      title: i18next.t('dataTableSection.stratVal.colName'),
      data: 'sellStrategies',
      tooltip: 'dataTableSection.stratVal.colTitle',
      render: DataTableHelper.handleStratCurrentVal,
      className: 'text-right current-value ',
      responsivePriority: 1
    }, {
      title: i18next.t('dataTableSection.stratTrigger.colName'),
      data: 'sellStrategies',
      tooltip: 'dataTableSection.stratTrigger.colTitle',
      render: DataTableHelper.handleStratEntryVal,
      responsivePriority: 1,
      className: 'text-right trigger'
    }, {
      title: i18next.t('pairsLogSection.profit.colName'),
      data: DataTableHelper.handleOrderBookProfit,
      tooltip: 'pairsLogSection.profit.colTitle',
      responsivePriority: 1,
      className: 'text-center profit',
    }, {
      title: i18next.t('pairsLogSection.currPriceBoughtPrice.colName'),
      data: DataTableHelper.handleAvgValAndCurrentPrice(),
      tooltip: 'pairsLogSection.currPriceBoughtPrice.colTitle',
      className: 'text-right blue-color current-price',
      responsivePriority: 1,
    }, {
      title: i18next.t('pairsLogSection.currPrice.colName'),
      data: DataTableHelper.handleAvgValAndCurrentPrice(true, false),
      responsivePriority: 1,
      className: 'hide'
    }, {
      title: i18next.t('pairsLogSection.boughtrPrice.colName'),
      data: DataTableHelper.handleAvgValAndCurrentPrice(false, true),
      responsivePriority: 1,
      className: 'hide'
    }, {
      title: i18next.t('pairsLogSection.currValBoughtCost.colName'),
      data: DataTableHelper.getCurrentValAndTotalCost(true),
      tooltip: 'pairsLogSection.currValBoughtCost.colTitle',
      className: 'text-right blue-color current-value',
      responsivePriority: 1
    }, {
      title: i18next.t('pairsLogSection.currVal.colName'),
      data: DataTableHelper.getCurrentValue(true),
      responsivePriority: 1,
      className: 'hide'
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'dataTableSection.currValCurrency.colTitle',
      data: DataTableHelper.getCurrentValue(false, true),
      responsivePriority: 1,
      className: 'text-right blue-color current-value  hide',
    }, {
      title: i18next.t('pairsLogSection.boughtCost.colName'),
      data: DataTableHelper.handleTotalCst(true),
      responsivePriority: 1,
      className: 'hide'
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'pairsLogSection.boughtCostCurrency.colTitle',
      data: DataTableHelper.handleTotalCst(false, true),
      responsivePriority: 1,
      className: 'text-right blue-color bought-cost  hide',
    }, {
      title: '<span class="api-currency"> </span>',
      tooltip: 'pairsLogSection.boughtCostCurrency.colTitle',
      data: DataTableHelper.getCurrentValAndTotalCost(false, true),
      className: 'text-right bought-cost',
      responsivePriority: 3
    }, {
      title: i18next.t('pairsLogSection.vol.colName'),
      data: 'volume',
      tooltip: 'pairsLogSection.vol.colTitle',
      className: 'text-right volume',
      responsivePriority: 6,
      render: DataTableHelper.renderVolume
    }, {
      title: i18next.t('pairsLogSection.totalAmount.colName'),
      data: DataTableHelper.handleTotalAmnt,
      tooltip: 'pairsLogSection.totalAmount.colTitle',
      responsivePriority: 5,
      className: 'text-right total-amount'
    }];

    columns = DataTableHelper.getExportDateColumns(columns, 1, 'firstBoughtDate', 'averageCalculator');
    // initialize the table.
    tables.dtPairsLogs = DataTableHelper.initDataTable($dtPairsLogs, DataTableHelper.getDataTableStructure({
      data: finalData,
      fixedColumnsLength: 5,
      order: [[8, 'desc']],
      buttons: pairsLogButtons,
      columns: columns
    }));
    addTooltips(tables.dtPairsLogs);
    DataTableHelper.hideCurrencyValues(tables.dtPairsLogs, hideCurrentValueIndex);
    // Current value, Total cost
    return colTotals(tables.dtPairsLogs, {
      currentValue: currentValueIndex,
      totalCost: totalCostIndex
    });
  }

  function colTotals (table, dataset) {
    var response = {};
    var currentMarketPrecision = cache && cache.hasOwnProperty('currentMarketPrecision') && cache.currentMarketPrecision || PBConstants.DEFAULT_PRECISION;
    for (var data in dataset) {
      var colNum = +dataset[data];
      if (isNaN(colNum)) {
        response[data] = 0;
        continue;
      }
      response[data] = table.column(colNum).data().sum();
      var currentCurrencyValue = NormalzerService.getInCurrencyValue(response[data], cache, 2, true);
      currentCurrencyValue = currentCurrencyValue ? '<span class="current-currency-values"> (' + cache.currencySymbol + currentCurrencyValue + ')<span>' : '';
      response[data + 'ConvertedValue'] = DataTableHelper.normalizeValueWithCommas(response[data], 'display', '', '', '', currentMarketPrecision) + currentCurrencyValue;
    }
    return response;
  }

  // https://datatables.net/plug-ins/api/sum()
  jQuery.fn.dataTable.Api.register('sum()', function () {
    return this.flatten().reduce(function (a, b) {
      return a + b;
    }, 0);
  });

  return {
    destroyTable: destroyTable,
    loadPairLogsData: loadPairLogsData,
    loadDustLogsData: loadDustLogsData,
    loadDcaLogsData: loadDcaLogsData,
    loadPendingLogsData: loadPendingLogsData,
    loadPossibleBuyData: loadPossibleBuyData,
    loadSellLogData: loadSellLogData,
    cbUpdateDtCache: cbUpdateDtCache
  };
}
