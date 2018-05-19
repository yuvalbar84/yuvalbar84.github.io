var DataTableHelper = (function () {

  // A cache for data that has a global impact on rendered columns
  // but changes whenever an AJAX call is made. For example - Marketing Site.
  var dtCache = {};
  var displayTypesArr = ['filter', 'display', 'export', 'sort'];
  var sortOperation = 'sort';
  var MAX_TAM_PRECISION = 4;
  var getOnlyCurrentValueForSalesLog = getCurrentValueForSalesLog(true);
  var handleOnlyTotalCstFrSalesLog = handleTotalCstFrSalesLog(true);
  var getOnlyCurrCurrencyValForSalesLog = getCurrentValueForSalesLog(false, true);
  var handleOnlyTotalCstCurrencyValFrSalesLog = handleTotalCstFrSalesLog(false, true);
  var handleOnlyAvgPrice = handleAvgPriceBoughtTimes(true);
  var scale = chroma.scale(['#FF9900', '#3bafda']);
  var POSITIVE_TRUE_VALUE = 1;
  var POSITIVE_TRUE_TRAILING_VALUE = 1.1;
  var MAX_BOUGHT_TIMES = 200;

  var stratValMaxPrecision = 2;
  var FIXED_COLUMN_MAX_RESOLUTION = '767';
  var isLowerResolution = false;
  var crntPaginationNumber = 0;

  // We have to show scrollbar and make first column fixed in lower resolutions.
  if ($(window).innerWidth() <= FIXED_COLUMN_MAX_RESOLUTION) {
    isLowerResolution = true;
  }
  /**
   * Date column should be split in excel
   * In excel we should show date, time. difference in three different columns.
   * @param {*} columns 
   * @param {*} index 
   * @param {*} property 
   * @param {*} parentProperty 
   */
  function getExportDateColumns (columns, index, property, parentProperty) {
    var exportDateColumns = [
      {
        title: i18next.t('dataTableSection.date.colName'),
        data: dateHandler(property, parentProperty, true),
        visible: false
      },
      {
        title: i18next.t('dataTableSection.time.colName'),
        data: dateHandler(property, parentProperty, false, true),
        visible: false
      }, {
        title: i18next.t('dataTableSection.timeSince.colName'),
        data: dateHandler(property, parentProperty, false, false, true),
        visible: false
      }
    ];

    for (var i = 0; i < exportDateColumns.length; i++) {
      columns.splice(index + i, 0, exportDateColumns[i]);
    }

    return columns;
  }

  function dateHandler (propName, parentProperty, onlyDate, onlyTime, onlyDiff) {
    // return the actual render function
    return function (row, type) {
      var colData = parentProperty ? row[parentProperty][propName] : row[propName];
      // TODO: Have to add '+00:00' to date to specify it is in UTC timezone.
      var dt = DateTimeHelper.getDateObj(colData, dtCache.timeZoneOffset);
      if (!dt) {
        return '--';
      }
      if (type === 'set') {
        return dt.getTime();
      } else if (type === 'display' || type === 'export' || type === 'export') {
        var date = DateTimeHelper.formatDate(dt);
        var dateAndTimeArr = date.split(' ');
        // Add time period(AM or PM) if exists.
        var timePeriod = dateAndTimeArr[2] ? ' ' + dateAndTimeArr[2] : '';
        var diffDays = getDaysDifferenceFromToday(dt);
        var diffDaysString = diffDays + 'D';
        if (onlyDate) {
          return dateAndTimeArr[0];
        }
        if (onlyTime) {
          return dateAndTimeArr[1] + timePeriod;
        }
        if (onlyDiff) {
          return diffDaysString;
        }
        var dateAndDaysDiff = '<span>' + dateAndTimeArr[0] + '</span><br><span class="dt-time">' + ' ' + dateAndTimeArr[1] + timePeriod + ' (' + diffDaysString + ')</span>';
        dateAndDaysDiff = replaceBreakTag(dateAndDaysDiff, type);
        return dateAndDaysDiff;
      } else if (type === 'filter') {
        return DateTimeHelper.formatDate(dt);
      }
      // 'sort', 'type' and undefined all just use the integer
      return dt.getTime();
    };
  }

  /**
   * This will return current date and time which will be added to exported file names.
   */
  function getCurrentDateForFileName () {
    return DateTimeHelper.getCurrentDateForFileName();
  }

  function getDaysDifferenceFromToday (date) {
    var currentDate = DateTimeHelper.getUTCDateWithOffset(dtCache.timeZoneOffset);
    var timeDiff = date.getTime() - currentDate.getTime();
    var diffDaysTmp = timeDiff / (1000 * 3600 * 24);
    var diffDays = diffDaysTmp < 0 ? Math.ceil(diffDaysTmp) : Math.floor(diffDaysTmp);
    return diffDays;
  }

  function handleProfit (data, type) {
    var profit = handleMoney(data, type);
    var profitClass = +profit < PBConstants.PROFIT_GREEN ? 'danger' : 'success';
    var profitString = '<span class="badge badge-' + profitClass + '">' + profit + '</span>';
    return profitString;
  }

  function handleProfitText (td, cellData) {
    // To add custom formatting to the cell based on the value.
    // https://datatables.net/reference/option/columns.createdCell
    if (cellData < PBConstants.PROFIT_GREEN) {
      $(td).addClass('loss-classtext').removeClass('profit-classtext');
    } else {
      $(td).addClass('profit-classtext').removeClass('loss-classtext');
    }
  }

  function renderMarketCol (data, type) {
    if (type === 'display' || type === 'export') {
      return '<a href="' + dtCache.marketingSite + data + '" target="_blank">' + data + '</a>';
    }
    return data;
  }

  function handleMoney (data, type) {
    if (type === 'display' || type === 'export') {
      // Determining the return value based on the data's type as toFixed() only works with number type.
      var returnValue = isNaN(parseInt(data, 10)) ? '' : parseFloat(data.toFixed(2)).toFixed(2);
      return returnValue;
    }
    return data;
  }

  function setIndex (dtApi) {
    dtApi.on('order.dt', function () {
      dtApi.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
      });
    }).draw();
  }

  function addPrecision (data, type) {
    return checkAndAddPrecision(data, type);
  }

  function getExcelColumns (totalColums, excludeInExcel, excludeOnCondition) {
    // Generate excel columns
    var columnsArrTmp = [];
    totalColums = totalColums - 1;
    for (var i = 0; i <= totalColums; i++) {
      // In excel we shouldn't show combined values
      if (excludeInExcel.indexOf(i) === -1) {
        columnsArrTmp.push(i);
      }
    }
    var columnsArr = columnsArrTmp;
    // If market is USDT and currency is USD then hide values in current currency.
    if (excludeOnCondition && excludeOnCondition.length > 0 &&
      dtCache.market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD && dtCache.currency === PBConstants.BASE_CURRENCY) {
      for (var j = 0; j < excludeOnCondition.length; j++) {
        columnsArr.splice(columnsArr.indexOf(excludeOnCondition[j]), 1);
      }
    }
    return columnsArr;
  }

  function getDataTableStructure (dtCustom) {
    var fixedColumns = isLowerResolution && dtCustom.fixedColumnsLength ? dtCustom.fixedColumnsLength : 0;
    delete dtCustom.fixedColumnsLength;
    return jQuery.extend(true, {
      paging: false,
      dom: 'frtipB',
      scrollX: isLowerResolution,
      responsive: !isLowerResolution,
      stateSave: true,
      language: {
        // changes the total records text shown at the bottom.
        info: i18next.t('dtMsgs.totalRecords') + ': _TOTAL_',
        infoEmpty: i18next.t('dtMsgs.totalRecords') + ': 0',
        emptyTable: i18next.t('dtMsgs.noRecords'),
        infoFiltered: i18next.t('dtMsgs.filtered')
      },
      searching: false,
      initComplete: function () {
        jQuery(document).trigger('evt.add-market-value');
      },
      fixedColumns: {
        leftColumns: fixedColumns
      },
      scrollCollapse: true,

    }, dtCustom);
  }

  function reBindData (table, data) {
    // if data is undefined, set it to an empty array
    // so that datatable doesn't crash.
    if (!data) {
      data = [];
    }
    table.clear().rows.add(data);
    table.draw(false);
  }

  function getCurrentValue (onlyCurrentValue, onlyConvertedCurrentValue) {
    return function (data, type) {
      var currentValue = data.averageCalculator.totalAmount * data.currentPrice;
      var nrmlsdCurrentValue = getCurrentValueBsdOnfee(data, currentValue);
      return getValueBasedOnParams(nrmlsdCurrentValue, type, onlyCurrentValue, onlyConvertedCurrentValue);
    };
  }

  function getCurrentValueBsdOnfee (data, currentValue) {
    var fee = data.averageCalculator.fee;
    currentValue = currentValue * (1 - (fee / 100));

    return currentValue;
  }

  function checkAndAddPrecision (data, type, precision) {
    if (type === 'display' || type === 'export' || type === 'sales' || type === 'filter') {
      // If precision is not a number then consider default precision.
      precision = parseInt(precision);
      var precisionTmp = isNaN(precision) ? PBConstants.DEFAULT_PRECISION : precision;
      // Determining the return value based on the data's type as toFixed() only works with number type.
      var returnValue = isNaN(parseInt(data, 10)) ? '' : parseFloat(data.toFixed(precisionTmp)).toFixed(precisionTmp);
      return returnValue;
    }
    return data;
  }

  function renderPercentageChange (data) {
    var percChange = data.percChange * 100;
    // Determining the return value based on the data's type as toFixed() only works with number type.
    var returnValue = isNaN(parseInt(percChange, 10)) ? '' : parseFloat(percChange.toFixed(2)).toFixed(2);
    return returnValue;
  }

  function handleTotalAmnt (data, type) {
    return checkMaxDecimalsAndAddPrecision(data.averageCalculator.totalAmount, type, MAX_TAM_PRECISION);
  }

  function removeTrailingZeros (data, type) {
    if (displayTypesArr.indexOf(type) !== -1) {
      return normalizeValueWithCommas(parseFloat(data), type, '', '', true);
    }
    return data;
  }

  function handleTotalCst (onlyCurrentValue, onlyConvertedCurrentValue) {
    return function (data, type) {
      var totalCst = data.averageCalculator.totalCost;
      return getValueBasedOnParams(totalCst, type, onlyCurrentValue, onlyConvertedCurrentValue);
    };
  }

  function getValueBasedOnParams (value, type, onlyCurrentValue, onlyConvertedCurrentValue) {
    var onlyValue = normalizeValueWithCommas(value, type, '', '', '', dtCache.currentMarketPrecision);
    if (onlyCurrentValue) {
      return onlyValue;
    }
    if (onlyConvertedCurrentValue) {
      return convertToCurrentCurrency(value, type);
    }
    return onlyValue + convertToCurrentCurrency(value, type);
  }


  function handleTotalCstFrSalesLog (onlyCurrentValue, onlyConvertedCurrentValue) {
    return function (data, type) {
      var totalCost = data.soldAmount * data.averageCalculator.avgPrice;
      return getValueBasedOnParams(totalCost, type, onlyCurrentValue, onlyConvertedCurrentValue);
    };
  }

  function getCurrentValueForSalesLog (onlyCurrentValue, onlyConvertedCurrentValue) {
    return function (data, type) {
      var currentValue = data.soldAmount * data.currentPrice;
      currentValue = getCurrentValueBsdOnfee(data, currentValue);
      return getValueBasedOnParams(currentValue, type, onlyCurrentValue, onlyConvertedCurrentValue);
    };
  }

  /**
   * It will return "BBLow" or "BBHigh" that has a value.
   * It will return zero if both have zero value.
   */
  function handleCurrentBB (data, type) {
    return checkAndAddPrecision(data.triggerValue, type);
  }

  function handleAvgPrice (data, type) {
    return currentMarketPrecision(data.averageCalculator.avgPrice, type, '', '', '', dtCache.currentMarketPrecision);
  }

  function handleAvgPriceDcaLog (onlyBid, onlyAvg) {
    return function (data, type) {
      if (type === 'display' || type === 'export') {
        var currentPrice = normalizeValueWithCommas(data.currentPrice, type, '', '', '', dtCache.currentMarketPrecision);
        var avgPrice = normalizeValueWithCommas(data.averageCalculator.avgPrice, type, '', '', '', dtCache.currentMarketPrecision);
        if (onlyBid) {
          return currentPrice;
        }
        if (onlyAvg) {
          return avgPrice + '<span class="dca-bought-times-container">(' + data.boughtTimes + ')</span></span>';
        }
        // Maximum bought times number count can be 2.
        // so to make one length and two length bought times aligned properly, adding invisible number before one length bought times.
        var invisibleNumString = data.boughtTimes.toString().length === 1 ? '<span class="invisible">0</span>' : '';
        // To get background color based on the boughtTimes value that we get from API. 
        var avgPriceContent;
        // Dont show bought times if it is zero.
        // To keep the alignment properly, we need to get invisible values if the boughttimes is equal to zero.
        if (data.boughtTimes !== 0) {
          avgPriceContent = avgPrice + invisibleNumString + getBoughtTimesHTML(data.boughtTimes, true);
        } else {
          avgPriceContent = avgPrice + invisibleNumString + getBoughtTimesHTML(data.boughtTimes, false);
        }
        return '<span class="dca-avg-current-price">' + currentPrice + invisibleNumString + getBoughtTimesHTML(data.boughtTimes, false)
          + '</br>' + avgPriceContent + '</span>';
      } else if (type === 'sort') {
        return data.boughtTimes;
      }
      return data.averageCalculator.avgPrice;
    };
  }

  /**
   * It will get current pagination number from localstorage and set to variable.
   * 
   */
  function getCurrentPaginationNumber (dataTableId) {
    var currentPath = window.location.pathname;
    crntPaginationNumber = 0;
    var tableLSData = JSON.parse(localStorage.getItem('DataTables_' + dataTableId + '_' + currentPath));
    if (tableLSData) {
      crntPaginationNumber = tableLSData.start && tableLSData.length ? tableLSData.start / tableLSData.length : 0;
    }
  }

  /**
   * Pagination was not being saved, everytime on page refresh it was showing from zero 
   * It was due to on page load we are intializing table with zero columns and adding
   * data after API call, because of initializing datatable with zero columns pagination was becoming
   * zero. To fix that we are storing pagination number before intializing and setting that page number
   * after data rebinding.
   */
  function setDTPagination (table) {
    crntPaginationNumber ? table.page(crntPaginationNumber).draw(false) : '';
  }

  function renderDCAEntryAndEntryLimit (data, type) {
    var entryLimitString = '';
    // TODO: Check why we are receiving type as a type.
    if (type === sortOperation || type === 'type') {
      return data[0].triggerValue;
    }
    for (var i = 0; i < data.length; i++) {
      var currentStrat = data[i];
      entryLimitString += currentStrat.anyValueExists ? '<span class="strat-trigger-value">' +
        currentStrat.triggerValue + '</span>' : '';
      entryLimitString += '<br>';
    }
    entryLimitString = replaceBreakTag(entryLimitString, type);
    return entryLimitString;
  }


  function getProfitBTCForSalesLog (row, type) {
    var profitValueTmp = getOnlyCurrentValueForSalesLog(row, '') - (handleOnlyAvgPrice(row, '') * row.soldAmount);
    var profitValue = normalizeValueWithCommas(profitValueTmp, type);
    if (type === 'display' || type === 'export' || type === 'filter') {
      var profitClass = getClassBasedOnValue(profitValueTmp);
      var profitString = '<span class="' + profitClass + '">' + profitValue + '</span>';
      return profitString;
    }
    return profitValue;
  }


  function getCurrentTrendprofit (row, type) {
    // If market is USDT then don't show the market profit value.
    if (dtCache.market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD && dtCache.currency === PBConstants.BASE_CURRENCY) {
      return '';
    }
    var currentValue = getOnlyCurrentValueForSalesLog(row, '');
    var profitValue = currentValue - (handleOnlyAvgPrice(row, '') * row.soldAmount);
    var currentTrendProfitTmp = (dtCache.marketPrice * dtCache.currencyValue * profitValue);
    var currentTrendProfit = normalizeValueWithCommas(currentTrendProfitTmp, type, '', '', '', 2);
    var currentTrendProfitClass = getClassBasedOnValue(currentTrendProfitTmp);
    return '<span class="sales-market-profit ' + currentTrendProfitClass + '"> ' + dtCache.currencySymbol + currentTrendProfit + '<span>';
  }


  function getClassBasedOnValue (value) {
    var valueClass = +value < PBConstants.PROFIT_GREEN ? 'loss-classtext' : 'profit-classtext';
    return valueClass;
  }

  function addButtons (dataTable, buttons, tableId) {
    new $.fn.dataTable.Buttons(dataTable, {
      buttons: buttons
    });
    $('#' + tableId + '_wrapper').find('.dt-buttons').remove();
    dataTable.buttons(0, null).container().last().appendTo(
      dataTable.table().container()
    );
  }

  function convertToCurrentCurrency (value, type) {
    // Converted value should be added only for type display and filter.
    if (displayTypesArr.indexOf(type) === -1) {
      return 0;
    }
    // If market is USDT and currency is USD then converted value should not be shown. 
    if ((dtCache.market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD && dtCache.currency === PBConstants.BASE_CURRENCY)) {
      return '';
    }
    value = normalizeValueWithCommas(value * dtCache.marketPrice * dtCache.currencyValue, type, '', '', '', 2);
    // Returns the value directly if the type of operation is sorting.
    if (type === sortOperation) {
      return value;
    }
    // Returns the value with prefixed currency symbol if the type of operation is not sorting.
    value = dtCache.currencySymbol + value;
    return value;
  }

  function renderStrategy (data, type) {
    var strategy = '';
    var positiveCls = '';

    // Loop over strategies array.
    for (var i = 0; i < data.length; i++) {
      var currentStrategy = data[i];
      data[i] = checkAnyValueExists(data[i]);
      strategy += currentStrategy.name;
      if (currentStrategy.positive && currentStrategy.positive !== 'false') {
        positiveCls = PBConstants.POSITIVE_CLASS;
        strategy += '<span class="' + positiveCls + '"> (' + currentStrategy.positive.toString()
          + ')</span><br>';
      } else {
        positiveCls = PBConstants.NEGATIVE_CLASS;
        strategy += '<br>';
      }
    }
    strategy = replaceBreakTag(strategy, type);
    return strategy;
  }

  function renderSellStrategy (data, type) {
    var sellStrategy = '';

    // Loop over sell strategy array.
    for (var j = 0; j < data.length; j++) {
      var currentSellStrategy = data[j];
      sellStrategy += currentSellStrategy.name + '<br>';
    }
    sellStrategy = replaceBreakTag(sellStrategy, type);
    return sellStrategy;
  }

  function renderBuyStrategy (data, type) {
    var strategy = 0;
    var weightage = 0;
    var currentPositiveValue = '';
    // We have to sort on positive value for buy strategies column.
    if (type === sortOperation) {
      // Loop over strategies array.
      for (var i = 0; i < data.length; i++) {
        var currentStrategy = data[i];
        currentPositiveValue = currentStrategy.positive.toString().toLowerCase();
        // Adding weightage based on positive value we are receiving from API. 
        if (currentPositiveValue !== 'false') {
          // Implementing sorting based on the sum for each row value we get from this function.
          weightage = currentPositiveValue === 'true' ? POSITIVE_TRUE_VALUE : POSITIVE_TRUE_TRAILING_VALUE;
          strategy = strategy + weightage;
        }
      }
      return strategy;
    }
    // Flow of control moves to renderStrategy function if the type of operation is not sort.
    return renderStrategy(data, type);
  }

  function handleTrigger (isNotPerc, considerDecimals) {
    var precision = 2;
    // If we have to show value in percentage then we have to add precision 2 otherwise we have to add precision 8.
    if (isNotPerc) {
      precision = PBConstants.DEFAULT_PRECISION;
    }

    return function (data, type) {
      var triggerString = data.length ? '' : checkAndAddPrecision(0, type, precision);
      // Loop over strategies array. 

      // In DCA logs if trigger value precision should not be greater than 2
      // if it is greater than 2 then we have to add precision 2.
      if (considerDecimals) {
        for (var i = 0; i < data.length; i++) {
          var currentStrat = data[i];
          var triggerValue = currentStrat.triggerValue;
          triggerString += '<span class="strat-trigger-value">' + checkMaxDecimalsAndAddPrecision(triggerValue, type, stratValMaxPrecision) + '</span>';
          triggerString += '<br>';
        }
      } else {
        for (var j = 0; j < data.length; j++) {
          triggerString += checkAndAddPrecision(data[j].triggerValue, type, precision) + '<br>';
        }
      }
      triggerString = replaceBreakTag(triggerString, type);
      return triggerString;
    };
  }


  function checkMaxDecimalsAndAddPrecision (value, type, maxPrecision) {
    var valueArr = value.toString().split('.');
    if (valueArr[1] && valueArr[1].length > maxPrecision) {
      value = checkAndAddPrecision(value, type, maxPrecision);
    }
    return value;
  }


  function checkAnyValueExists (strat) {
    if (strat.currentValue || strat.triggerValue || strat.entryValue || strat.entryValueLimit) {
      strat.anyValueExists = true;
    }
    return strat;
  }

  function renderCombinedMarketCol (data, type, row) {
    var percentageValue = renderPercentageChange(row);
    var percentageClass = getClassBasedOnValue(percentageValue);
    var marketAndPercString = renderMarketCol(data, type) + '<br>' + '<span class="' + percentageClass + '">' + percentageValue + ' %</span>';
    marketAndPercString = replaceBreakTag(marketAndPercString, type);
    return marketAndPercString;
  }

  // In exported files also we have to show in two lines.
  // Break tag(<br>) will not work in excel.
  function replaceBreakTag (string, type) {
    if (type === 'export') {
      string = string.replace(/<br>/ig, '\r');
    }
    return string;
  }

  function handleStratEntryVal (data, type, row, set, checkAnyValueExists) {
    var entryValString = '';
    // TODO: Check why we are receiving type as a type.
    if (type === sortOperation || type === 'type') {
      return checkAndAddPrecision(data[0].entryValue, type, data[0].decimals);
    }
    // Loop over strategies array. 
    for (var i = 0; i < data.length; i++) {
      var currentStrat = data[i];
      var money = checkAndAddPrecision(currentStrat.entryValue, type, currentStrat.decimals);
      // In DCA table we have to render strategy data if atleast one value is not zero.
      if (checkAnyValueExists) {
        money = currentStrat.anyValueExists ? money : '';
      }
      entryValString += money + '<br>';
    }
    entryValString = replaceBreakTag(entryValString, type);
    return entryValString;
  }

  function checkAllValAndHandleStratEntryVal (data, type) {
    return handleStratEntryVal(data, type, '', '', true);
  }

  function handlePBEntryLimit (data, type) {
    var pbEntryLimitString = '';
    // TODO: Check why we are receiving type as a type.
    if (type === sortOperation || type === 'type') {
      return data[0]['entryValueLimit'];
    }
    // Loop over strategies array. 
    for (var i = 0; i < data.length; i++) {
      var entryValLimit = data[i].anyValueExists ? data[i]['entryValueLimit'] : '';
      pbEntryLimitString += entryValLimit + '<br>';
    }
    pbEntryLimitString = replaceBreakTag(pbEntryLimitString, type);
    return pbEntryLimitString;
  }

  function handleStratCurrentVal (data, type, row, set, checkAnyValueExists) {
    var currentValString = '';
    // TODO: Check why we are receiving type as a type.
    if (type === sortOperation || type === 'type') {
      return checkAndAddPrecision(data[0].currentValue, type, data[0].decimals);
    }
    // Loop over strategies array. 
    for (var i = 0; i < data.length; i++) {
      var currentVal = checkAndAddPrecision(data[i]['currentValue'], type, data[i].decimals);
      // In DCA table we have to render strategy data if atleast one value is not zero.
      if (checkAnyValueExists) {
        currentVal = data[i].anyValueExists ? currentVal : '';
      }
      currentValString += currentVal + '<br>';
    }
    currentValString = replaceBreakTag(currentValString, type);
    return currentValString;
  }

  function renderVolume (data) {
    return Math.round(data);
  }

  function checkAllValAndHandleStratCurVal (data, type) {
    return handleStratCurrentVal(data, type, '', '', true);
  }

  function handleAvgPriceBoughtTimes (onlyBoughtPrice, onlySoldPrice) {
    return function (data, type) {
      // Returns the first value in the column's row if the type of opertaion is sorting.
      if (type === sortOperation) {
        return data.averageCalculator.avgPrice;
      }
      if (displayTypesArr.indexOf(type) !== -1) {
        var avgPriceBroughtTimes = normalizeValueWithCommas(data.averageCalculator.avgPrice, type, '', '', '', dtCache.currentMarketPrecision);
        var currentPrice = normalizeValueWithCommas(data.currentPrice, type, '', '', '', dtCache.currentMarketPrecision);
        var avgPriceBroughtTimesCount = '';
        // Maximum bought times number count can be 2.
        // so to make one length and two length bought times aligned properly, adding invisible number before one length bought times.
        var invisibleNumString = data.boughtTimes.toString().length === 1 ? '<span class="invisible">0</span>' : '';
        // Rendering data when user exports excel.
        if (type === 'export') {
          if (onlyBoughtPrice) {
            avgPriceBroughtTimesCount = '(' + data.boughtTimes + ')';
            return avgPriceBroughtTimes + avgPriceBroughtTimesCount;
          }
          if (onlySoldPrice) {
            return currentPrice;
          }
        }
        // Don't show bought times if it is zero
        // To keep the alignment properly, we need to get invisible values if the boughttimes is equal to zero.
        if (+data.boughtTimes !== 0) {
          avgPriceBroughtTimesCount = invisibleNumString + getBoughtTimesHTML(data.boughtTimes, true);
        } else {
          avgPriceBroughtTimesCount = invisibleNumString + getBoughtTimesHTML(data.boughtTimes, false);
        }
        if (onlyBoughtPrice) {
          return avgPriceBroughtTimes + avgPriceBroughtTimesCount;
        }
        if (onlySoldPrice) {
          return currentPrice;
        }
        return avgPriceBroughtTimes + avgPriceBroughtTimesCount + '<br><span class="sold-price">' +
          currentPrice + invisibleNumString + '</span>' + getBoughtTimesHTML(data.boughtTimes, false);
      }
      return data.averageCalculator.avgPrice;
    };
  }

  function getBoughtTimesHTML (boughtTimes, withoutInvisibleBlock) {
    var ColorIndex = boughtTimes * 0.005;
    var BGColor = boughtTimes <= MAX_BOUGHT_TIMES ? scale(ColorIndex).hex() : '#ffffff';
    var styleString = 'style="background-color:' + BGColor + '"';
    var contentString = boughtTimes;
    if (withoutInvisibleBlock) {
      contentString = '<span class="bought-badge-number" ' + styleString + '>' + boughtTimes + '</span>';
    } else {
      contentString = '<span class="bought-badge-number invisible" ' + styleString + '>' + boughtTimes + '</span>';
    }
    return contentString;
  }

  function getCurrentValAndTotalCost (onlyValue, onlyConvertedValue) {
    return function (data, type, row) {
      var currentValue = getCurrentValue(onlyValue, onlyConvertedValue)(data, type, row);
      if (type === 'display' || type === 'export') {
        var totalCost = handleTotalCst(onlyValue, onlyConvertedValue)(data, type, row);
        return '<span class="current-value blue-color">' + currentValue + '</span><br><span class="bought-cost blue-color">' + totalCost + '</span>';
      } else {
        return currentValue;
      }
    };
  }

  function handleBoughtSoldCstFrSalesLog (data, type) {
    var totalCst = handleOnlyTotalCstFrSalesLog(data, type);
    // Returns totalCst if the type of operation is sorting.
    if (type === sortOperation) {
      return totalCst;
    }
    if (displayTypesArr.indexOf(type) !== -1) {
      return totalCst + '<br>'
        + getOnlyCurrentValueForSalesLog(data, type);
    } else {
      return totalCst;
    }
  }

  function handleAvgValAndCurrentPrice (onlyCurentPrice, onlyAvgPrice) {
    return function (data, type, row) {
      var avgPrice = handleAvgPrice(data, type, row);
      if (type === 'display' || type === 'export') {
        var currentPrice = normalizeValueWithCommas(data.currentPrice, type, '', '', '', dtCache.currentMarketPrecision);
        if (onlyCurentPrice) {
          return currentPrice;
        }
        if (onlyAvgPrice) {
          return avgPrice;
        }
        return currentPrice + '<br>' + avgPrice;
      } else {
        return avgPrice;
      }
    };
  }

  function currentMarketPrecision (value, type, row) {
    return normalizeValueWithCommas(value, type, row, '', '', dtCache.currentMarketPrecision);
  }

  /**
   * This will add comma after three digits to the passed value parameter
   * and doesn't add comma number after decimals.
   * @param {*} value - Value to be converted. 
   * @param {*} type  - It adds precision and comma only if type is 'display' or 'filter'.
   * @param {*} row 
   * @param {*} set 
   * @param {*} noPrecision - It will add precision to the given value if noPrecision parameter value is false value or undefined.
   * @param {*} precision - It will add passed parameter precision(if precision parameter is not passed then it adds default precision).
   */
  function normalizeValueWithCommas (value, type, row, set, noPrecision, precision) {
    precision = precision || PBConstants.DEFAULT_PRECISION;
    if (!noPrecision) {
      value = checkAndAddPrecision(value, type, precision);
    }
    // Comma should be added only for type display and filter.
    if (displayTypesArr.indexOf(type) === -1) {
      return value;
    }

    value = value.toString();
    var valueArr = value.split('.');
    // Don't add comma for number after decimal.
    if (valueArr[1]) {
      valueArr[0] = valueArr[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      value = valueArr.join('.');
    } else {
      value = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }
    return value;
  }

  function setDataCache (cache) {
    if (cache) {
      dtCache = cache;
    }
  }

  function handleBoughtSoldCstCrncy (data, type) {
    // Returns the first value directly if the operation is sort.
    if (type === sortOperation) {
      return handleOnlyTotalCstCurrencyValFrSalesLog(data, type);
    }
    return handleOnlyTotalCstCurrencyValFrSalesLog(data, type) +
      '<br><span class="sold-value">' +
      getOnlyCurrCurrencyValForSalesLog(data, type) + '</span>';
  }

  function hideCurrencyValues (dataTable, hideColumnsArr) {
    var showCurrencyColumns = true;
    // If market is USDT and currency is USD then hide the currency columns.
    if (dtCache.market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD && dtCache.currency === PBConstants.BASE_CURRENCY) {
      showCurrencyColumns = false;
    }
    for (var i = 0; i < hideColumnsArr.length; i++) {
      dataTable.column(hideColumnsArr[i]).visible(showCurrencyColumns);
    }
    // After changing visibility, add current currency and market as header values.
    $(document).trigger('evt.add-market-value');
  }

  function handleOrderBookProfit (data, type) {
    // TODO: Check why we are receiving type as a type.
    if (type === sortOperation || type === 'type') {
      return handleMoney(data.profit, type);
    }
    var profit = handleMoney(data.profit, type);
    var orderbookProfit = +data.orderbookProfit > 0 ? data.orderbookProfit : '';
    orderbookProfit = handleMoney(orderbookProfit, type);
    var profitClass = +profit < PBConstants.PROFIT_GREEN ? 'danger' : 'success';
    var profitString = '<span class="badge badge-' + profitClass + '">' +
      profit + '</span><br><span class="badge badge-success order-profit">' + orderbookProfit + '</span>';
    profitString = replaceBreakTag(profitString, type);
    return profitString;
  }

  // Function to initialize datatable and check if it is present or not.
  function initDataTable($datatable, datatableObj) {    
    if ($.fn.DataTable.isDataTable($datatable)) {
      $datatable.DataTable().destroy();
      console.error('Undefined state occurred for DataTable. The application has recovered but '
        + 'please report the issue with this message if you see undefined behavior.');
    } 
    return $datatable.DataTable(datatableObj);
  }

  // public methods
  return {
    dateHandler: dateHandler,
    renderMarketCol: renderMarketCol,
    handleMoney: handleMoney,
    setIndex: setIndex,
    getDataTableStructure: getDataTableStructure,
    getCurrentValue: getCurrentValue,
    renderStrategy: renderStrategy,
    renderSellStrategy: renderSellStrategy,
    renderBuyStrategy: renderBuyStrategy,
    renderVolume: renderVolume,
    addPrecision: addPrecision,
    handleProfit: handleProfit,
    handleProfitText: handleProfitText,
    reBindData: reBindData,
    getProfitBTCForSalesLog: getProfitBTCForSalesLog,
    renderDCAEntryAndEntryLimit: renderDCAEntryAndEntryLimit,
    handleAvgPrice: handleAvgPrice,
    handleTotalAmnt: handleTotalAmnt,
    handleTotalCst: handleTotalCst,
    handleCurrentBB: handleCurrentBB,
    renderPercentageChange: renderPercentageChange,
    handleTotalCstFrSalesLog: handleTotalCstFrSalesLog,
    handleAvgPriceDcaLog: handleAvgPriceDcaLog,
    handleAvgPriceBoughtTimes: handleAvgPriceBoughtTimes,
    getCurrentValueForSalesLog: getCurrentValueForSalesLog,
    setDataCache: setDataCache,
    getCurrentValAndTotalCost: getCurrentValAndTotalCost,
    handleAvgValAndCurrentPrice: handleAvgValAndCurrentPrice,
    getCurrentValueBsdOnfee: getCurrentValueBsdOnfee,
    getCurrentTrendprofit: getCurrentTrendprofit,
    addButtons: addButtons,
    getExcelColumns: getExcelColumns,
    normalizeValueWithCommas: normalizeValueWithCommas,
    handleBoughtSoldCstFrSalesLog: handleBoughtSoldCstFrSalesLog,
    handleBoughtSoldCstCrncy: handleBoughtSoldCstCrncy,
    getCurrentDateForFileName: getCurrentDateForFileName,
    getExportDateColumns: getExportDateColumns,
    hideCurrencyValues: hideCurrencyValues,
    currentMarketPrecision: currentMarketPrecision,
    handleTrigger: handleTrigger,
    handleStratEntryVal: handleStratEntryVal,
    handlePBEntryLimit: handlePBEntryLimit,
    handleStratCurrentVal: handleStratCurrentVal,
    removeTrailingZeros: removeTrailingZeros,
    checkAllValAndHandleStratCurVal: checkAllValAndHandleStratCurVal,
    checkAllValAndHandleStratEntryVal: checkAllValAndHandleStratEntryVal,
    renderCombinedMarketCol: renderCombinedMarketCol,
    handleOrderBookProfit: handleOrderBookProfit,
    getCurrentPaginationNumber: getCurrentPaginationNumber,
    setDTPagination: setDTPagination,
    initDataTable: initDataTable
  };
}());
