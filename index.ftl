<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="ProfitTrailer" content="The one and only ProfitTrailer Monitor">
  <meta name="Elroy" content="Creator and God of ProfitTrailer">
  <meta name="dj_crypto" content="Designer and lover of ProfitTrailer">
  <meta name="robots" content="noindex, nofollow">
  <link rel="shortcut icon" href="images/favicon-32x32.png">
  <title>ProfitTrailer Monitor</title>

  <link href="css/vendor/jquery.circliful.css" rel="stylesheet" type="text/css" />
  <link href="css/vendor/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
  <link href="css/vendor/fixedColumns.bootstrap4.min.css" rel="stylesheet" type="text/css"/>
  <link href="css/vendor/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
  <link href="css/vendor/responsive.bootstrap4.min.css" rel="stylesheet" type="text/css" />
  <link href="css/vendor/switchery.min.css" rel="stylesheet" />
  <link href="css/vendor/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/vendor/icons.css" rel="stylesheet" type="text/css">
  <link href="css/vendor/cryptofont.min.css" rel="stylesheet" type="text/css">
  <link href="css/vendor/toastr.min.css" rel="stylesheet" type="text/css">
  <link href="css/vendor/sweetalert.css" rel="stylesheet" type="text/css">
  <link href="css/vendor/flag-icon-css/css/flag-icon.min.css" rel="stylesheet" type="text/css">

  <link href="css/style.css?ver=2.0.30" rel="stylesheet" type="text/css">

  <!-- Theme css -->
  <link href="css/themes/dark/custom-dark.css?ver=2.0.30" rel="stylesheet" type="text/css" id="customTheme">

  <link href="css/custom.css?ver=2.0.30" rel="stylesheet" type="text/css">

  <script>
    // Timeago libraries locales file path lcoation
    var TIMEAGO_LOCALE_FILE_PATH = 'js/vendor/timeago/locales/';
    var THEME_CSS_FILE_PATH = 'css/themes/';
  </script>

  <script src="js/vendor/jquery.min.js"></script>
  <script src="js/vendor/modernizr.min.js"></script>
  <script src="js/vendor/i18next.min.js"></script>
  <script src="js/vendor/i18nextXHRBackend.min.js"></script>
  <script src="js/vendor/jquery-i18next.min.js"></script>
  <script src="locales/translations.js"></script>

  <script>
    // To use package.json version in js files.
    var APP_VERSION = '2.0.30';
  </script>


</head>

<body class="fixed-left">
  <div id="bodyLoadingSymbol">
    <span class="fa fa-spinner fa-spin"></span>
  </div>
  <!-- Begin page -->
  <div id="wrapper">
    <!-- Top Bar Start -->
    <div class="topbar">
      <!-- LOGO -->
      <div class="topbar-left">
        <div>
          <h1 class="main-heading">
            <a href="monitoring" class="logo">
              <img src="images/Logo.png" alt="ProfitTrailer" height="35" width="35">
              <span class="heading-text">
                <span class="trailer" data-i18n="logo.trailer"></span>
                <span class="tdbitcoin" data-i18n="logo.profit"></span>
              </span>
            </a>
          </h1>
        </div>
      </div>
      <!-- Button mobile view to collapse sidebar menu -->
      <nav class="navbar-custom">
        <ul class="list-inline float-right mb-0">
          <li class="list-inline-item notification-list">
            <span id="selectedLng"></span>
          </li>
        </ul>
        <ul class="list-inline float-right mb-0">
          <li class="list-inline-item notification-list hide-phone">
            <a class="nav-link waves-light waves-effect" href="#" id="btn-fullscreen" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]summaryItems.imageTitles.fullScreen">
              <i class="fa fa-expand noti-icon text-primary"></i>
            </a>
          </li>
          <div class="dropdown-menu dropdown-menu-right profile-dropdown" aria-labelledby="Preview">
            <!-- item-->
            <a href="javascript:void(0);" class="dropdown-item notify-item">
              <i class="fa fa-unlock"></i>
            </a>
          </div>
        </ul>
        <ul class="list-inline float-right mb-0 text-primary">
          <li class="list-inline-item notification-list">
            <a class="nav-link right-bar-toggle waves-light waves-effect" id="settingsLink">
              <i class="mdi mdi-settings noti-icon"></i>
            </a>
          </li>
        </ul>
        <ul class="list-inline float-right mb-0 text-primary updated-on-container ">
          <li class="list-inline-item notification-list spinner text-primary">
            <i class="fa fa-spinner fa-spin text-primary" aria-hidden="true"></i>
          </li>
          <li class="list-inline-item notification-list last-updated-on-container text-primary" id="dvLastUpdatedOn">
          </li>
        </ul>
        <ul class="list-inline menu-left float-left mb-0">
          <li class="float-left">
            <button class="button-menu-mobile open-left waves-light waves-effect">
              <i class="fa fa-bars text-primary"></i>
            </button>
          </li>
        </ul>
        <ul class="list-inline mb-0 monitor-summary hide-phone">
          <li class="list-inline-item tdbitcoin font-16 ticker-text">
            <label data-toggle="tooltip" data-placement="bottom" data-i18n="[title]summaryItems.balance.title;summaryItems.balance.label"></label>:
            <span id="nBalanceVal">--</span>
          </li>
          <li class="list-inline-item text-primary font-16 ticker-text">
            <label data-toggle="tooltip" data-placement="bottom" data-i18n="[title]summaryItems.tcv.title;summaryItems.tcv.label"></label>:
            <span id="nTotalCurrentVal">--</span>
          </li>
          <li class="list-inline-item text-success font-16 ticker-text">
            <label data-toggle="tooltip" data-placement="bottom" data-i18n="[title]summaryItems.sb.title;summaryItems.sb.label"></label>:
            <span id="nStartBalance">--</span>
          </li>
          <li class="list-inline-item text-muted font-16 ticker-text">
            <label data-toggle="tooltip" data-placement="bottom" data-i18n="[title]summaryItems.profit.title">
              <span class="full-text" data-i18n="summaryItems.profit.fullText"></span>
              <span class="short-text" data-i18n="summaryItems.profit.label"></span>
            </label>:</li>
          <li class="list-inline-item text-profitlw font-16 ticker-text">
            <span>
              <span id="nLastWeekProfit" class="open-brackets">-</span>
              <span data-toggle="tooltip" data-placement="bottom" class="close-brackets" data-i18n="[title]summaryItems.lw.title;summaryItems.lw.label"></span>
            </span>
          </li>
          <li class="list-inline-item text-profityd font-16 ticker-text">
            <span>
              <span id="nYesterdayProfit" class="open-brackets">-</span>
              <span data-toggle="tooltip" data-placement="bottom" data-i18n="[title]summaryItems.yd.title;summaryItems.yd.label" class="close-brackets"></span>
            </span>
          </li>
          <li class="list-inline-item text-profittd font-16 ticker-text">
            <span>
              <span id="nTodayProfit" class="open-brackets">-</span>
              <span data-toggle="tooltip" data-placement="bottom" data-i18n="[title]summaryItems.td.title;summaryItems.td.label" class="close-brackets"></span>
            </span>
          </li>
          <li class="list-inline-item font-16 text-btctrend ticker-text">
            <label id="nMarketTrendLabel" data-toggle="tooltip" data-placement="bottom" title="">
              <span class="full-text" data-i18n="summaryItems.trend.title"></span>
              <span class="short-text" data-i18n="summaryItems.trend.label"></span>
            </label>:
            <span class="trend-val">
              <span id="nMarketTrend" class="open-brackets close-brackets">-</span></span>
          </li>
          <li class="list-inline-item tdbitcoin font-16 ticker-text">
            <label id="nMarket" data-toggle="tooltip" data-placement="bottom" title="">-</label>:
            <span id="nMarketPrice">-</span>&nbsp;
            <span id="nMarketPercChange">N/A</span>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Top Bar End -->
    <!-- ========== Left Sidebar Start ========== -->
    <div class="left side-menu">
      <div class="sidebar-inner slimscrollleft">
        <!--- Divider -->
        <div id="sidebar-menu">
          <ul>
            <li id="defaultPage">
              <a href="monitoring" class="waves-effect waves-primary monitoring">
                <i class="fa fa-home"></i>
                <span data-i18n="sidebar.monitoring"></span>
              </a>
            </li>
            <li>
              <a href="possible-buys-log" class="waves-effect waves-primary possible-buys-log">
                <i class="fa fa-optin-monster"></i>
                <span data-i18n="sidebar.buyLog"></span>
                <span class="text-dark pull-right m-t-4 records-count badge badge-primary" id="possibleBuyLogLength">--</span>
              </a>
            </li>
            <li>
              <a href="pairs-log" class="waves-effect waves-primary pairs-log">
                <i class="fa fa-houzz"></i>
                <span data-i18n="sidebar.pairsLog"></span>
                <span class="text-dark pull-right m-t-4 records-count badge badge-primary" id="pairsLogLength">--</span>
              </a>
            </li>
            <li>
              <a href="dca-log" class="waves-effect waves-primary dca-log">
                <i class="fa fa-hand-peace-o"></i>
                <span data-i18n="sidebar.dcaLog"></span>
                <span class="text-dark pull-right m-t-4 records-count badge badge-primary" id="dcLogLength">--</span>
              </a>
            </li>
            <li>
              <a href="pending-log" class="waves-effect waves-primary pending-log">
                <i class="fa fa-gg"></i>
                <span data-i18n="sidebar.pendingLog"></span>
                <span class="text-dark pull-right m-t-4 records-count badge badge-primary" id="pendingLogLength">--</span>
              </a>
            </li>
            <li>
              <a href="sales-log" class="waves-effect waves-primary sales-log">
                <i class="fa fa-balance-scale"></i>
                <span data-i18n="sidebar.salesLog"></span>
                <span class="text-dark pull-right m-t-4 records-count badge badge-primary" id="salesLogLength">--</span>
              </a>
            </li>
            <li>
              <a href="dust-log" class="waves-effect waves-primary dust-log">
                <i class="fa fa-recycle"></i>
                <span data-i18n="sidebar.dustLog"></span>
                <span class="text-dark pull-right m-t-4 records-count badge badge-primary" id="dustLogLength">--</span>
              </a>
            </li>
            <li class="has_sub" id="configMenu">
              <a href="javascript:void(0);" class="waves-effect waves-primary config">
                <i class="fa fa-wrench"></i>
                <span data-i18n="sidebar.config"></span>
                <span class="menu-arrow"></span>
              </a>
              <ul class="list-unstyled">
                <li>
                  <a href="config?file=PAIRS" data-i18n="configOptions.pairs"></a>
                </li>
                <li>
                  <a href="config?file=DCA" data-i18n="configOptions.dca"></a>
                </li>
                <li>
                  <a href="config?file=INDICATORS" data-i18n="configOptions.indicators"></a>
                </li>
                <li>
                  <a href="config?file=HOTCONFIG" data-i18n="configOptions.hotConfig"></a>
                </li>
              </ul>
            </li>
          </ul>
          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="row sub-header" id="subHeader">
        <div class="col-sm-12 sub-header-content">
          <div class="page-title-box font-13 second-header-container">
            <h2 class="page-title tab-heading" data-i18n="monitoringSection.heading"></h2>
            <!-- Top nav -->
            <div id="topNav">
              <ul class="navigation-menu">
                <!-- Monitoring -->
                  <li class="has-submenu">
                    <a href="monitoring">
                      <i class="fa fa-home"></i>
                      <p class="title">
                        <!-- We are applying font weight bold style to active menu item
                        which will increase below span width and move other other menu items.
                        To fix that we have added visibility hidden font weight bold span. -->
                        <span data-i18n="sidebar.monitoring"></span>
                        <span data-i18n="sidebar.monitoring"></span> 
                      </p>
                    </a>
                  </li>
                  <!-- Possible buy log -->
                  <li class="has-submenu">
                  <a href="possible-buys-log">
                    <i class="fa fa-optin-monster"></i>
                    <p class="title">
                      <span data-i18n="sidebar.buyLog"></span> 
                      <span data-i18n="sidebar.buyLog"></span> 
                    </p>                               
                    <span class="records-count badge badge-primary" id="topPossibleBuyLogLength">--</span></a>
                  </li>
                  <!-- Pairs log -->
                  <li class="has-submenu">
                    <a href="pairs-log">
                      <i class="fa fa-houzz"></i>
                      <p class="title">
                        <span data-i18n="sidebar.pairsLog"></span>
                        <span data-i18n="sidebar.pairsLog"></span>
                      </p>
                      <span class="records-count badge badge-primary" id="topPairsLogLength">--</span>
                    </a>
                  </li>
                  <!-- DCA log -->
                  <li class="has-submenu">
                    <a href="dca-log">
                      <i class="fa fa-hand-peace-o"></i>
                      <p class="title">
                        <span data-i18n="sidebar.dcaLog"></span>
                        <span data-i18n="sidebar.dcaLog"></span>
                      </p>
                      
                      <span class="records-count badge badge-primary" id="topDcLogLength">--</span>
                    </a>
                  </li>
                  <!-- Pending log -->
                  <li class="has-submenu">
                  <a href="pending-log">
                    <i class="fa fa-gg"></i>
                    <p class="title">
                      <span data-i18n="sidebar.pendingLog"></span>
                      <span data-i18n="sidebar.pendingLog"></span>
                    </p>
                    <span class="records-count badge badge-primary" id="topPendingLogLength">--</span>
                  </a>
                  </li>
                  <!-- Sales log -->
                  <li class="has-submenu">
                  <a href="sales-log">
                    <i class="fa fa-balance-scale"></i>
                    <p class="title">
                      <span data-i18n="sidebar.salesLog"></span>
                      <span data-i18n="sidebar.salesLog"></span>
                    </p>
                    <span class="records-count badge badge-primary" id="topSalesLogLength">--</span>
                  </a>
                  </li>
                  <!-- Dust log -->
                  <li class="has-submenu">
                  <a href="dust-log">
                    <i class="fa fa-recycle"></i>
                    <p class="title">
                      <span data-i18n="sidebar.dustLog"></span>
                      <span data-i18n="sidebar.dustLog"></span>
                    </p>
                    <span class="records-count badge badge-primary" id="topDustLogLength">--</span>
                  </a>
                  </li>
                  <!-- Config -->
                  <li class="has-submenu" id="topConfigMenu">
                    <a href="javascript:void(0);"><i class="fa fa-wrench"></i>  <span data-i18n="sidebar.config"></span></a>
                    <ul class="submenu">
                        <li><a href="config?file=PAIRS" data-i18n="configOptions.pairs"></a></li>
                        <li><a href="config?file=DCA" data-i18n="configOptions.dca"></a></li>
                        <li><a href="config?file=INDICATORS" data-i18n="configOptions.indicators"></a></li>
                        <li><a href="config?file=HOTCONFIG" data-i18n="configOptions.hotConfig"> </a></li>
                    </ul>
                  </li>
              </ul>
            </div>

            <ul id="appNotificationContainer" class="list-inline mb-0 notifications-container navbar-custom">
              <li class="list-inline-item dropdown notification-list">
                <a class="nav-link dropdown-toggle arrow-none waves-light waves-effect" data-toggle="dropdown" href="#" role="button" aria-haspopup="false"
                  aria-expanded="false" id="lnkToggleNotification">
                  <i class="mdi mdi-bell noti-icon"></i>
                  <span class="badge badge-danger noti-icon-badge"></span>
                </a>
                <div class="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg" aria-labelledby="Preview">
                  <!-- item-->
                  <div class="dropdown-item noti-title">
                    <h5 class="font-16" data-i18n="monitoringSection.notification"></h5>
                  </div>
                  <!-- item-->
                  <div id="appNotifications">
                  </div>
                  <!-- All-->
                  <a id="lnkViewNotification" href="#" class="dropdown-item notify-item notify-all">
                  </a>
                </div>
              </li>
            </ul>

            <!-- Test mode -->
            <span id="testModeContainer">
              <span class="badge badge-danger" data-i18n="summaryItems.testMode.label"></span>
            </span>

            <div class="clearfix"></div>
          </div>
        </div>
      </div>
    <!-- Left Sidebar End -->
    <!-- ============================================================== -->
    <!-- Start right Content here -->
    <!-- ============================================================== -->
    <div class="content-page" id="contentPage">
      <!-- Start content -->
      <div class="content">
        <div class="container-fluid">
          <!-- Page-Title -->
         
          <div id="dvPageContent" class="page-content">
          </div>
        </div>
      </div>
    </div>
    <!-- MONITORING -->
    <div id="tmplMonitoring" class="hide">
      <!-- MONITORING 1st ROW -->
      <div class="row monitoring-row">
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.balance.title">
            <div class="bg-icon bg-icon-tdbitcoin pull-left">
              <i class="fa fa-btc text-info market-icon"></i>
            </div>
            <div class="text-right">
              <h3 class="m-t-10 tdbitcoin main-text">
                <b class="counter" id="mBalanceVal">--</b>
                <span class="market m-l-5">--</span>
              </h3>
              <p class="mb-0 tdbitcoin main-text" data-i18n="[append]monitoringSection.balance.mainText">
                <span class="js-exchange">--</span>
              </p>
              <span class="market-price-calculations">
                <label class="text-warning usd-value js-usd-value">
                  <span class="full-text"></span>
                  <span class="short-text"></span>
                </label>
                <span class="mb-0 text-warning main-text" id="mBalUSDValue">--</span>
              </span>
              <!-- Pairs balance -->
              <p class="mb-0 monitor-smaller-fonts text-warning">
                <span data-i18n="monitoringSection.pairsBal.label">
                </span>
                <span id="mPairsBalanceVal">
                --
                </span>
              </p>
              <!-- DCA balance -->
              <p class="mb-0 monitor-smaller-fonts text-warning">
                <span data-i18n="monitoringSection.dcaBal.label">
                </span>
                <span id="mDCABalanceVal">
                --
                </span>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.tcv.title">
            <div class="bg-icon bg-icon-primary pull-left">
              <i class="fa fa-btc text-info market-icon"></i>
            </div>
            <div class="text-right">
              <h3 class=" m-t-10 text-primary main-text">
                <b class="counter" id="mTotalCurrentVal">--</b>
                <span class="market m-l-5">--</span>
              </h3>
              <p class="mb-0 text-primary main-text" data-i18n="monitoringSection.tcv.mainText"></p>
              <span class="market-price-calculations">
                <label class="text-primary usd-value js-usd-value">
                  <span class="full-text"></span>
                  <span class="short-text"></span>
                </label>
                <span class="mb-0 text-primary main-text" id="mTCVUSDValue">--</span>
              </span>
              <p class="monitor-smaller-fonts text-primary main-text mb-0 js-dust-values" data-toggle="tooltip" data-placement="bottom"
                data-i18n="[title]monitoringSection.tcvDust.title">
                <label class="mb-0" data-i18n="monitoringSection.tcvDust.label">
                </label>
                <span id="mTCVDustValue">
                  --
                </span>
                <span class="market">--</span>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.sb.title">
            <div class="bg-icon bg-icon-success pull-left">
              <i class="fa fa-btc text-info  market-icon"></i>
            </div>
            <div class="text-right">
              <h3 class=" m-t-10 text-success main-text">
                <b class="counter" id="mStartBalance">--</b>
                <span class="market m-l-5">--</span>
              </h3>
              <p class="mb-0 text-success main-text" data-i18n="monitoringSection.sb.mainText"></p>
              <span class="market-price-calculations">
                <label class="text-success usd-value js-usd-value">
                  <span class="full-text"></span>
                  <span class="short-text"></span>
                </label>
                <span class="mb-0 text-success main-text" id="mTPVUSDValue">--</span>
              </span>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated" id="mMarketTrendContainer" data-toggle="tooltip" data-placement="bottom"
            title="">
            <div class="bg-icon bg-icon-btctrend pull-left">
              <i class="fa fa-btc text-info  market-icon"></i>
            </div>
            <div class="text-right">
              <h3 class="counter m-t-10 percentage-text">
                <b class="counter" id="mMarketTrend">--</b>
              </h3>
              <p id="mMarketTrendLabel" class="mb-0 text-btctrend main-text"></p>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- MONITORING 2nd ROW -->
      <div class="row monitoring-row">
        <div class="col-lg-3 col-md-6" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.btcUsd.title">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-btcusd pull-left">
              <i class="fa fa-usd text-info"></i>
            </div>
            <div class="text-right">
              <h3 class="tdbitcoin counter m-t-10 font-bold main-text">
                <span id="mBtcPrice">--</span>&nbsp;
                <span title="BTC trend last 24h" id="mBtc24h"></span>
              </h3>
              <p class="mb-0 text-btcusd main-text" data-i18n="[append]monitoringSection.btcUsd.mainText">
                <span class="js-exchange">--</span>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 top-market" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.coinTopMarket.title">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-trend1h pull-left">
              <i class="fa fa-space-shuttle text-info"></i>
            </div>
            <div class="text-right">

              <!-- Top market prices -->
              <div class="top-market-prices top-market">
                <span class="counter" id="mTrendPrice0">--</span>
                <span class="counter" id="mTrendPrice1">--</span>
                <span class="counter" id="mTrendPrice2">--</span>
                <span class="counter" id="mTrendPrice3">--</span>
                <span class="counter" id="mTrendPrice4">--</span>
              </div>

              <!-- Top market percentage changes -->
              <div class="top-market-perc top-market">
                <span class="counter m-l-0" id="mTrendPerChnge0">--</span>
                <span class="counter m-l-5" id="mTrendPerChnge1">--</span>
                <span class="counter m-l-5" id="mTrendPerChnge2">--</span>
                <span class="counter m-l-5" id="mTrendPerChnge3">--</span>
                <span class="counter m-l-5" id="mTrendPerChnge4">--</span>
              </div>

              <!-- Top market labels -->
              <div class="top-market-labels top-market">
                <span class="market-label coin-market-text" id="mTrendMarket0">--</span>
                <span class="market-label coin-market-text" id="mTrendMarket1">--</span>
                <span class="market-label coin-market-text" id="mTrendMarket2">--</span>
                <span class="market-label coin-market-text" id="mTrendMarket3">--</span>
                <span class="market-label coin-market-text" id="mTrendMarket4">--</span>
              </div>

            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 global-market" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.globalMarket.title">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-trend24h pull-left">
              <i class="fa fa-moon-o text-info"></i>
            </div>
            <div class="text-right">

              <!-- Total Market Cap -->
              <p class="mb-0  m-t-5 main-text coin-market-text">
                <span class="market-label" data-i18n="[prepend]monitoringSection.globalMarket.totalMarketCap"></span>
                <span class="counter" id="mTrendtotalMarketCap">--</span>
              </p>

              <!-- Total 24 Hour Volume -->
              <p class="mb-0 main-text  m-t-5 coin-market-text">
                <span class="market-label" data-i18n="[prepend]monitoringSection.globalMarket.total24HrsVol"></span>
                <span class="counter" id="mTrendtotal24HrsVol">--</span>
              </p>

              <!-- Bitcoin % of Market Cap -->
              <p class="mb-0 main-text  m-t-5 coin-market-text">
                <span class="market-label" data-i18n="[prepend]monitoringSection.globalMarket.bitcoinMarketCap"></span>
                <span class="counter" id="mTrendbitcoinMarketCap">--</span>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.trendUsdTill7D.title">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-trend7d pull-left">
              <i class="fa fa-usd text-info"></i>
            </div>
            <div class="text-right">
              <div class="trend-market">
                  <p class="mb-0 m-t-10 text-trend1h main-text">
                    <span data-i18n="monitoringSection.trendUsd1H.mainText"></span>
                    <span class="m-l-10 counter" id="mTrend1h">--</span>
                  </p>
                  <p class="mb-0  m-t-5 text-trend24h main-text">
                    <span data-i18n="monitoringSection.trendUsd24H.mainText"></span>
                    <span class="m-l-10 counter" id="mTrend24h">--</span>
                  </p>
                  <p class="mb-0 text-trend7d main-text  m-t-5" >
                    <span data-i18n="monitoringSection.trendUsd7D.mainText"></span>
                    <span class="m-l-10 counter" id="mTrend7d">--</span>
                  </p>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- MONITORING 3rd Row-->
      <div class="row monitoring-row">
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.profitLW.title">
            <div class="bg-icon bg-icon-profitlw pull-left">
              <i class="fa fa-line-chart text-info"></i>
            </div>
            <div class="text-right">
              <h3 class=" m-t-10 text-profitlw main-text">
                <b class="counter" id="mLastWeekProfit">--</b>
                <span class="market m-l-5">--</span>
              </h3>
              <p class="mb-0 text-profitlw main-text" data-i18n="monitoringSection.profitLW.mainText"></p>
              <span class="market-price-calculations text-profitlw">
                <label class="usd-value js-usd-value">
                  <span class="full-text"></span>
                  <span class="short-text"></span>
                </label>
                <span class="mb-0 main-text" id="mLastWeekProfitUSDValue">--</span>
              </span>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.profitYday.title">
            <div class="bg-icon bg-icon-profityd pull-left">
              <i class="fa fa-line-chart text-info"></i>
            </div>
            <div class="text-right">
              <h3 class=" m-t-10 text-profityd main-text">
                <b class="counter" id="mYesterdayProfit">--</b>
                <span class="market m-l-5">--</span>
              </h3>
              <p class="mb-0 text-profityd main-text" data-i18n="monitoringSection.profitYday.mainText"></p>
              <span class="market-price-calculations text-profityd">
                <label class="usd-value js-usd-value">
                  <span class="full-text"></span>
                  <span class="short-text"></span>
                </label>
                <span class="mb-0 main-text" id="mYesterdayProfitUSDValue">--</span>
              </span>
              <div class="market-price-calculations text-profityd js-estimated-gain">
                <label class="usd-value">
                  <span class="full-text" data-i18n="monitoringSection.gainFullText"></span>
                  <span class="short-text" data-i18n="monitoringSection.gainShortText"></span>
                </label>
                <span class="mb-0 main-text" id="mYesterdayProfitPercent">--</span>
                <span> %</span>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.profitToday.title">
            <div class="bg-icon bg-icon-profittd pull-left">
              <i class="fa fa-line-chart text-info"></i>
            </div>
            <div class="text-right">
              <h3 class=" m-t-10 text-profittd main-text">
                <b class="counter" id="mTodayProfit">--</b>
                <span class="market m-l-5">--</span>
              </h3>
              <p class="mb-0 text-profittd main-text" data-i18n="monitoringSection.profitToday.mainText"></p>
              <span class="market-price-calculations text-profittd">
                <label class="usd-value js-usd-value">
                  <span class="full-text"></span>
                  <span class="short-text"></span>
                </label>
                <span class="mb-0  main-text" id="mTodayProfitUSDValue">--</span>
              </span>
              <div class="market-price-calculations text-profittd js-estimated-gain">
                <label class="usd-value">
                  <span class="full-text" data-i18n="monitoringSection.gainFullText"></span>
                  <span class="short-text" data-i18n="monitoringSection.gainShortText"></span>
                </label>
                <span class="mb-0  main-text" id="mTodayProfitPercent">--</span>
                <span> %</span>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-inverse pull-left">
              <i class="fa fa-cog text-info"></i>
            </div>
            <div class="text-right">
              <p class="mb-0 text-muted font-13 settings-text m-t-10" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pot.title;[prepend]monitoringSection.pot.label">
                <span class="m-l-5 text-strange text-strange" id="mPendingOrderTime">--</span>
              </p>
              <p class="m-b-5 m-t-5 text-muted font-13 settings-text">
                <!-- Monitoring password set -->
                <span data-i18n="[title]monitoringSection.pot.pwTitle;monitoringSection.pot.pwText" data-toggle="tooltip" data-placement="bottom"></span>
                <span class="m-l-5 text-strange badge" id="mPasswordSet">--</span>
                <!-- Monitoring config enabled -->
                <span class="m-l-5" data-i18n="[title]monitoringSection.pot.pwTitle;monitoringSection.pot.conText" data-toggle="tooltip"
                  data-placement="bottom"></span>
                <span class="m-l-5 text-strange badge" id="mConfigEnabled">--</span>
              </p>
              <p class="m-b-5 m-t-10 text-muted font-13 settings-text">
                <span id="mSOMContainer">
                  <span data-toggle="tooltip" data-placement="bottom" id="mSellOnlyModeLabel" data-i18n="monitoringSection.pot.somText"></span>
                  <span class="m-l-5 text-strange badge" id="mSellOnlyMode">--</span>
                </span>
                <span class="m-l-5 red-tooltip" data-i18n="[title]monitoringSection.pot.somoTitle;monitoringSection.pot.somoText" data-toggle="tooltip"
                  data-placement="bottom"></span>
                <span class="m-l-5 text-strange badge" id="mSellOnlyModeOverride">--</span>
              </p>
              <p class="mb-0 text-muted font-13 settings-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pot.ptvTitle">
                <span class="tdbitcoin" data-i18n="monitoringSection.pot.pLetter"></span>
                <span class="text-primary" data-i18n="monitoringSection.pot.tLetter"></span>
                <span data-i18n="monitoringSection.pot.ver"></span>
                <span class="m-l-5 text-strange" id="mVersion">--</span>
              </p>
              <p class="mb-0 text-muted font-13 settings-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pot.marketTitle;[prepend]monitoringSection.pot.marketLabel">
                <span class="m-l-5 text-strange js-exchange">--</span>
                <span class="m-l-5 text-strange" id="mMarket">--</span>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- MONITORING 4th Row-->
      <div class="row monitoring-row">
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-pairs pull-left">
              <i class="fa fa-houzz text-info"></i>
            </div>
            <div class="text-right">
              <h5 class="mt-0 m-b-5 font-16 text-primary totals-text m-t-10" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pairsLog.title">
                <span class="full-text" data-i18n="monitoringSection.pairsLog.fullText"></span>
                <span class="short-text" data-i18n="monitoringSection.pairsLog.shortText"></span>
                <span class="text-primary m-l-5" id="mPairsLogCurrentValue">--</span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-dark totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pairsLog.diffTitle">
                <span class="text-dark m-l-5" id="mPairsLogDifference">
                  <span class="percentage">--</span>
                  <span class="full-text" data-i18n="monitoringSection.pairsLog.diffFullText"></span>
                  <span class="short-text"> </span>
                  <span class="value m-l-5">--</span>
                </span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-success totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pairsLog.boughtCostTitle">
                <span class="full-text" data-i18n="monitoringSection.pairsLog.bcFullText"></span>
                <span class="short-text" data-i18n="monitoringSection.pairsLog.bcShortText"></span>
                <span class="text-success m-l-5" id="mPairsLogBoughtCost">--</span>
              </h5>
              <small class="text-pairs mb-0 font-14 totals-title">
                <b data-i18n="monitoringSection.pairsLog.label"></b>
              </small>
              <div class="clearfix"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-dca pull-left">
              <i class="fa fa-hand-peace-o text-info"></i>
            </div>
            <div class="text-right">
              <h5 class="mt-0 m-b-5 font-16 m-t-10 text-primary totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.dcaLog.title">
                <span class="full-text" data-i18n="monitoringSection.dcaLog.fullText"></span>
                <span class="short-text" data-i18n="monitoringSection.dcaLog.shortText"></span>
                <span class="text-primary m-l-5" id="mDcLogCurrentValue">--</span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-dark totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.dcaLog.diffTitle">
                <span class="text-dark m-l-5" id="mDcLogDifference">
                  <span class="percentage">--</span>
                  <span class="full-text" data-i18n="monitoringSection.dcaLog.diffFullText"></span>
                  <span class="short-text"> </span>
                  <span class="value m-l-5">--</span>
                </span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-success totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.dcaLog.totalCostTitle">
                <span class="full-text" data-i18n="monitoringSection.dcaLog.tcFullText"></span>
                <span class="short-text" data-i18n="monitoringSection.dcaLog.tcShortText"></span>
                <span class="text-success m-l-5" id="mDcLogBoughtCost">--</span>
              </h5>
              <small class="text-dca mb-0 font-14 totals-title">
                <b data-i18n="monitoringSection.dcaLog.label"></b>
              </small>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-pending pull-left">
              <i class="fa fa-gg text-info"></i>
            </div>
            <div class="text-right">
              <h5 class="mt-0 m-b-5 font-16 m-t-10 text-primary totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pendingLog.title">
                <span class="full-text" data-i18n="monitoringSection.pendingLog.fullText"></span>
                <span class="short-text" data-i18n="monitoringSection.pendingLog.shortText"></span>
                <span class="text-primary m-l-5" id="mPendingLogCurrentValue">--</span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-dark totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pendingLog.diffTitle">
                <span class="text-dark m-l-5" id="mPendingLogDifference">
                  <span class="percentage">--</span>
                  <span class="full-text" data-i18n="monitoringSection.pendingLog.diffFullText"></span>
                  <span class="short-text"> </span>
                  <span class="value m-l-5">--</span>
                </span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-success totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.pendingLog.targetValueTitle">
                <span class="full-text" data-i18n="monitoringSection.pendingLog.tvFullText"></span>
                <span class="short-text" data-i18n="monitoringSection.pendingLog.tvShortText"></span>
                <span class="text-success m-l-5" id="mPendingLogBoughtCost">--</span>
              </h5>
              <small class="text-pending mb-0 font-14 totals-title">
                <b data-i18n="monitoringSection.pendingLog.label"></b>
              </small>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="widget-bg-color-icon card-box fadeInDown animated">
            <div class="bg-icon bg-icon-sales pull-left">
              <i class="fa fa-balance-scale text-info"></i>
            </div>
            <div class="text-right">
              <h5 class="mt-0 m-b-5 font-16 m-t-10 text-primary totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.salesLog.title">
                <span class="full-text" data-i18n="monitoringSection.salesLog.fullText"></span>
                <span class="short-text" data-i18n="monitoringSection.salesLog.shortText"></span>
                <span class="text-primary m-l-5" id="mSalesLogBoughtCost">--</span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-dark totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.salesLog.diffTitle">
                <span class="text-dark m-l-5" id="mSalesLogDifference">
                  <span class="percentage">--</span>
                  <span class="full-text" data-i18n="monitoringSection.salesLog.diffFullText"></span>
                  <span class="short-text"> </span>
                  <span class="value m-l-5">--</span>
                </span>
              </h5>
              <h5 class="mt-0 m-b-5 font-16 text-success totals-text" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]monitoringSection.salesLog.soldValueTitle">
                <span class="full-text" data-i18n="monitoringSection.salesLog.svFullText"></span>
                <span class="short-text" data-i18n="monitoringSection.salesLog.svShortText"></span>
                <span class="text-success m-l-5" id="mSalesLogCurrentValue">--</span>
              </h5>
              <small class="text-sales mb-0 font-14 totals-title">
                <b data-i18n="monitoringSection.salesLog.label"></b>
              </small>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- end MONITORING -->
    <!-- DCA LOG -->
    <div id="tmplDcaLog" class="hide">
      <div class="row">
        <div class="col-12">
          <div class="card-box table-responsive">
            <table class="table table-striped table-bordered dt-dca-logs" id="dtDcaLogs" cellspacing="0" width="100%">
            </table>
            <table class="col-md-3 col-sm-5 summary-table">
              <tr>
                <td class="text-primary table-nowrap">
                  <span class="full-text" data-i18n="dcaLogSection.summaryTable.currVal"></span>
                  <span class="short-text" data-i18n="dcaLogSection.summaryTable.cv"></span>
                </td>
                <td id="dcLogTotalCurrentVal" class="text-primary table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]dcaLogSection.summaryTable.currVal"></td>
              </tr>
              <tr>
                <td class="text-dark table-nowrap">
                  <span class="full-text" data-i18n="dcaLogSection.summaryTable.diff"></span>
                  <span class="short-text" data-i18n="dcaLogSection.summaryTable.d"></span>
                </td>
                <td id="dcLogDifference" class="text-dark table-nowrap">
                  <span class="percentage"></span>
                  <span class="value" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]dcaLogSection.summaryTable.diff"></span>
                </td>
              </tr>
              <tr>
                <td class="text-success table-nowrap">
                  <span class="full-text" data-i18n="dcaLogSection.summaryTable.totalCost"></span>
                  <span class="short-text" data-i18n="dcaLogSection.summaryTable.tc"></span>
                </td>
                <td id="dcLogRealCost" class="text-success table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]dcaLogSection.summaryTable.totalCost"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end DCA LOG -->
    <!-- PAIRS LOG -->
    <div id="tmplPairsLog" class="hide">
      <div class="row">
        <div class="col-12">
          <div class="card-box table-responsive">
            <table class="table table-striped table-bordered dt-pairs-logs" id="dtPairsLogs" cellspacing="0" width="100%">
            </table>
            <table class="col-md-3 col-sm-5 summary-table">
              <tr>
                <td class="text-primary table-nowrap">
                  <span class="full-text" data-i18n="pairsLogSection.summaryTable.currVal"></span>
                  <span class="short-text" data-i18n="pairsLogSection.summaryTable.cv"></span>
                </td>
                <td id="pairsLogTotalCurrentVal" class="text-primary table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]pairsLogSection.summaryTable.currVal"></td>
              </tr>
              <tr>
                <td class="text-dark table-nowrap">
                  <span class="full-text" data-i18n="pairsLogSection.summaryTable.diff"></span>
                  <span class="short-text" data-i18n="pairsLogSection.summaryTable.d"></span>
                </td>
                <td id="pairsLogDifference" class="text-dark table-nowrap">
                  <span class="percentage"></span>
                  <span class="value" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]pairsLogSection.summaryTable.diff"></span>
                </td>
              </tr>
              <tr>
                <td class="text-success table-nowrap">
                  <span class="full-text" data-i18n="pairsLogSection.summaryTable.boughtCost"></span>
                  <span class="short-text" data-i18n="pairsLogSection.summaryTable.bc"></span>
                </td>
                <td id="pairsLogRealCost" class="text-success table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="pairsLogSection.summaryTable.boughtCost"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end PAIRS LOG  -->
    <!-- PENDING LOG -->
    <div id="tmplPendingLog" class="hide">
      <div class="row">
        <div class="col-12">
          <div class="card-box table-responsive">
            <table class="table table-striped table-bordered dt-pending-logs" id="dtPendingLogs" cellspacing="0" width="100%">
            </table>
            <table class="col-md-3 col-sm-5 summary-table">
              <tr>
                <td class="text-primary table-nowrap">
                  <span class="full-text" data-i18n="pendingLogSection.summaryTable.currVal"></span>
                  <span class="short-text" data-i18n="pendingLogSection.summaryTable.cv"></span>
                </td>
                <td id="pendingLogTotalCurrentVal" class="text-primary table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]pendingLogSection.summaryTable.currVal"></td>
              </tr>
              <tr>
                <td class="text-dark table-nowrap">
                  <span class="full-text" data-i18n="pendingLogSection.summaryTable.diff"></span>
                  <span class="short-text" data-i18n="pendingLogSection.summaryTable.d"></span>
                </td>
                <td id="pendingLogDifference" class="text-dark table-nowrap">
                  <span class="percentage"></span>
                  <span class="value" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]pendingLogSection.summaryTable.diff"></span>
                </td>
              </tr>
              <tr>
                <td class="text-success table-nowrap">
                  <span class="full-text" data-i18n="pendingLogSection.summaryTable.targetVal"></span>
                  <span class="short-text" data-i18n="pendingLogSection.summaryTable.tv"></span>
                </td>
                <td id="pendingLogRealCost" class="text-success table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]pendingLogSection.summaryTable.targetVal"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end POSSIBLE BUYS -->
    <!-- POSSIBLE BUYS -->
    <div id="tmplPossibleBuys" class="hide">
      <div class="row">
        <div class="col-12">
          <div class="card-box table-responsive">
            <table class="table table-striped table-bordered dt-possible-buys-Log" id="dtPossibleBuysLog" cellspacing="0" width="100%">
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end POSSIBLE BUYS-->
    <!-- SALES LOG -->
    <div id="tmplSalesLog" class="hide">
      <div class="row">
        <div class="col-12">
          <div class="card-box table-responsive">
            <table class="table table-striped table-bordered dt-sales-log" id="dtSalesLog" cellspacing="0" width="100%">
            </table>
            <table class="col-md-3 col-sm-5 summary-table">
              <tr>
                <td class="text-primary table-nowrap">
                  <span class="full-text" data-i18n="salesLogSection.summaryTable.boughtCost"></span>
                  <span class="short-text" data-i18n="salesLogSection.summaryTable.bc"></span>
                </td>
                <td id="salesLogBoughtCost" class="text-primary table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]salesLogSection.summaryTable.boughtCost"></td>
              </tr>
              <tr>
                <td class="text-dark table-nowrap">
                  <span class="full-text" data-i18n="salesLogSection.summaryTable.diff"></span>
                  <span class="short-text" data-i18n="salesLogSection.summaryTable.d"></span>
                </td>
                <td id="salesLogDifference" class="text-dark table-nowrap">
                  <span class="percentage"></span>
                  <span class="value" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]salesLogSection.summaryTable.diff"></span>
                </td>
              </tr>
              <tr>
                <td class="text-success table-nowrap">
                  <span class="full-text" data-i18n="salesLogSection.summaryTable.soldVal"></span>
                  <span class="short-text" data-i18n="salesLogSection.summaryTable.sv"></span>
                </td>
                <td id="salesLogTotalCurrentVal" class="text-success table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]salesLogSection.summaryTable.soldVal"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end SALES LOG -->
    <!-- Dust LOG -->
    <div id="tmplDustLog" class="hide">
      <div class="row">
        <div class="col-12">
          <div class="card-box table-responsive">
            <table class="table table-striped table-bordered dt-dust-logs" id="dtDustLogs" cellspacing="0" width="100%">
            </table>
            <table class="col-md-3 col-sm-5 summary-table">
              <tr>
                <td class="text-primary table-nowrap">
                  <span class="full-text" data-i18n="dustLogSection.summaryTable.currVal"></span>
                  <span class="short-text" data-i18n="dustLogSection.summaryTable.cv"></span>
                </td>
                <td id="dustLogTotalCurrentVal" class="text-primary table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]dustLogSection.summaryTable.currVal"></td>
              </tr>
              <tr>
                <td class="text-dark table-nowrap">
                  <span class="full-text" data-i18n="dustLogSection.summaryTable.diff"></span>
                  <span class="short-text" data-i18n="dustLogSection.summaryTable.d"></span>
                </td>
                <td id="dustLogDifference" class="text-dark table-nowrap">
                  <span class="percentage"></span>
                  <span class="value" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]dustLogSection.summaryTable.diff"></span>
                </td>
              </tr>
              <tr>
                <td class="text-success table-nowrap">
                  <span class="full-text" data-i18n="dustLogSection.summaryTable.boughtCost"></span>
                  <span class="short-text" data-i18n="dustLogSection.summaryTable.bc"></span>
                </td>
                <td id="dustLogRealCost" class="text-success table-nowrap" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]dustLogSection.summaryTable.boughtCost"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end Dust LOG  -->
    <!-- SETTINGS -->
    <div id="tmplConfig" class="hide">
      <div id="configurationContainer" class="row">
        <div class="col-12 configuration-heading-container">
          <h3 id="configurationHeading"></h3>
          <span class="show-save-message text-danger" data-i18n="constantMsgs.unsaveChange"></span>
          <span class="tab-specific-loading">
            <i class="fa fa-spinner fa-spin text-primary" aria-hidden="true"></i>
          </span>
          <div class="pull-right ace-editor-buttons">
            <button type="button " class="btn btn-success btn-sm" data-i18n="[append]dtMsgs.search" id="aceEditorSearch">
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>
            <button type="button " class="btn btn-success btn-sm save-config" data-i18n="[append]constantMsgs.save">
              <i class="fa fa-floppy-o" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="editor-container col-12">
          <div class="editor-inner-container">
            <div id="PBConfigEditor"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- end SETTINGS -->
    <footer class="footer">
      <span class="version-container pull-left font-13 lr-no-float" data-toggle="tooltip" data-placement="Top" data-i18n="[title]footer.ptVersion">
        <label class="m-l-10">
          <span class="tdbitcoin">P</span>
          <span class="text-primary">T</span>
          <span data-i18n="footer.ver"></span>
        </label>
        <span id="apiVersion">--</span>
      </span>
      <span class="float-left hide-phone font-13 lr-no-float">
        <label class="m-l-10" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.market.title;settingInfo.market.label"></label>
        <span id="apiExchange">--</span>
        <span id="apiMarket">--</span>
        <label class="hide-phone time-hdr" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.time.title;settingInfo.time.label"></label>
        <span id="dvCurrentTime">--</span>
        <label class="time-hdr hide-phone" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.utc.title">
          <span class="full-text" data-i18n="settingInfo.utc.labelFullText"></span>
          <span class="short-text" data-i18n="settingInfo.utc.labelShortText"></span>
        </label>
        <span id="dvCurrentUTCTime">--</span>
        <span data-toggle="tooltip" data-placement="bottom" class="m-l-10" id="apiCurrency"></span>
        <span data-toggle="tooltip" data-placement="bottom" class="m-l-10 flag-icon language-flag"></span>
      </span>
      <span class="hide-phone footer-link">
        <a href="https://profittrailer.com" target="_blank">
          <span class="full-text">ProfitTrailer.com</span>
          <span class="short-text">PT.com </span>
        </a> -
        <a href="https://wiki.profittrailer.com" target="_blank" data-i18n="footer.wiki"></a>
      </span>
      <div class="pull-right text-muted  font-13 lr-no-float">
          <span class="hide-phone">
            <span id="apiSOMContainer">
              <label class="m-l-10" data-toggle="tooltip" data-placement="bottom" id="apiSellOnlyModeLabel" data-i18n="settingInfo.som.label"></label>
              <span id="apiSellOnlyMode" class="badge">--</span>
            </span>
            <label class="m-l-10" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.somo.title;settingInfo.somo.label"></label>
            <span id="apiSellOnlyModeOverride" class="badge">--</span>
            <!-- Config enabled -->
            <label class="m-l-10" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.config.title;settingInfo.config.label"></label>
            <span id="apiConfigEnabled" class="badge">--</span>
            <!-- Password set -->
            <label class="m-l-10" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.password.title;settingInfo.password.label"></label>
            <span id="apiPasswordSet" class="badge">--</span>
          </span>
        </div>
    </footer>
    <!-- Notifications and settings -->
    <div class="side-bar right-bar settings-tab" id="settingsTabContainer">
      <div class="">
        <ul class="nav nav-tabs tabs-bordered nav-justified">
          <li class="nav-item">
            <a href="#heartsBeatsTab" class="nav-link active" data-toggle="tab" aria-expanded="false" data-i18n="settingInfo.heartbeats.label">
            </a>
          </li>
          <li class="nav-item">
            <a href="#settingsTab" class="nav-link" data-toggle="tab" aria-expanded="true" data-i18n="settingInfo.settings.label">
            </a>
          </li>
        </ul>
        <div class="tab-content">

          <!-- Notifications tab -->
          <div class="tab-pane fade show active" id="heartsBeatsTab">
            <div class="text-center">
              <p data-i18n="constantMsgs.noHeartbeats">
              </p>
            </div>
          </div>

          <!-- Settings tab -->
          <div class="tab-pane" id="settingsTab">
            <!-- SOM and SOMO buttons -->
            <div class="row m-t-20 hide">
              <div class="col-8">
                <h5 class="m-0 font-15" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.somOnOff.title;settingInfo.somOnOff.label"></h5>
                <p class="text-muted m-b-0">
                  <small data-i18n="settingInfo.somOnOff.subLabel"></small>
                </p>
              </div>
              <div class="col-4 text-right">
                <input class="js-switchery switchery-buttons" type="checkbox" checked="" data-switchery="true" data-som-type="saveSOM" disabled
                  id="SOMSwitchery">
              </div>
            </div>

            <div class="row m-t-20 hide">
              <div class="col-8">
                <h5 class="m-0 font-15" data-toggle="tooltip" data-placement="bottom" data-i18n="[title]settingInfo.somo.title;settingInfo.somoOnOff.label"></h5>
                <p class="text-muted m-b-0">
                  <small data-i18n="settingInfo.somoOnOff.subLabel"></small>
                </p>
              </div>
              <div class="col-4 text-right">
                <input data-som-type="saveSOMO" class="js-switchery switchery-buttons" type="checkbox" checked="" data-switchery="true" disabled
                  id="SOMOSwitchery">
              </div>
            </div>

            <!-- Logout button -->
            <div class="btns-container">
              <div class="btn-container disabled" data-toggle="tooltip" data-placement="top" data-i18n="[title]settingInfo.noPswrd.title;"
                id="btnLogoutContainer">
                <a class="btn btn-dark link disabled" href="logout">
                  <i class="mdi mdi-logout"></i>
                  <span data-i18n="settingInfo.logout.label"></span>
                </a>
              </div>

              <!-- Stop button -->
              <div class="btn-container disabled" data-toggle="tooltip" data-placement="top" data-i18n="[title]settingInfo.noEnableShutdown.title;"
                id="btnStopContainer">
                <button class="btn btn-dark disabled" data-toggle="tooltip">
                  <i class="mdi mdi-close-circle-outline"></i>
                  <span data-i18n="footer.stopPFTrailer"></span>
                </button>
              </div>

              <!-- Change passwords button -->
              <div class="btn-container disabled" data-toggle="tooltip" data-placement="top" data-i18n="[title]settingInfo.chngePswrd.title;"
                id="btnChngePswrdContainer">
                <a class="btn btn-dark link disabled" href="login/changePassword">
                  <i class="mdi mdi-key"></i>
                  <span data-i18n="settingInfo.chngePswrd.label"></span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ============================================================== -->
    <!-- End Right content here -->
    <!-- ============================================================== -->
    <script>
      var resizefunc = [];
    </script>
    <!-- Plugins  -->

    <script src="js/vendor/popper.min.js"></script>
    <script src="js/vendor/bootstrap.min.js"></script>
    <script src="js/vendor/detect.min.js"></script>
    <script src="js/vendor/fastclick.js"></script>
    <script src="js/vendor/jquery.slimscroll.js"></script>
    <script src="js/vendor/waves.js"></script>
    <script src="js/vendor/jquery.scrollTo.min.js"></script>
    <script src="js/vendor/skycons.min.js"></script>
    <script src="js/vendor/switchery.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/jquery.dataTables.min.js"></script>
    <script src="js/vendor/dataTables.bootstrap4.min.js"></script>
    <script src="js/vendor/dataTables.buttons.min.js"></script>
    <script src="js/vendor/buttons.bootstrap4.min.js"></script>
    <script src="js/vendor/dataTables.fixedColumns.min.js"></script>
    <script type="text/javascript" src="js/vendor/dataTables.responsive.min.js"></script>
    <script type="text/javascript" src="js/vendor/responsive.bootstrap4.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/page.js"></script>
    <script src="js/vendor/jquery.app.js"></script>
    <script src="js/vendor/timeago/jquery.timeago.js"></script>
    <script src="js/vendor/toastr.min.js"></script>
    <script src="js/vendor/jquery.core.js"></script>
    <script src="js/vendor/sweetalert.min.js"></script>
    <script src="js/vendor/ace/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/vendor/ace/src-noconflict/theme-twilight.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/vendor/ace/src-noconflict/mode-properties.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/vendor/ace/src-noconflict/ext-searchbox.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/vendor/chroma.min.js" type="text/javascript"></script>

    <script src="js/constants.js?ver=2.0.30"></script>
    <script src="js/helpers/dateTimeHelper.js?ver=2.0.30"></script>
    <script src="js/helpers/dataTableHelper.js?ver=2.0.30"></script>
    <script src="js/helpers/routeHelper.js?ver=2.0.30"></script>
    <script src="js/custom/tableDefs.js?ver=2.0.30"></script>
    <script src="js/custom/notification.js?ver=2.0.30"></script>
    <script src="js/custom/services.js?ver=2.0.30"></script>
    <script src="js/helpers/domHelper.js?ver=2.0.30"></script>
    <script src="js/custom/settings.js?ver=2.0.30"></script>
    <script src="js/custom/coinMarket.js?ver=2.0.30"></script>
    <script src="js/custom/script.js?ver=2.0.30"></script>

  </div>
  
</body>

</html>
