var PBConstants = {
  // Script.js constants
  // URLS
  BASE_API_URL: 'http://cloud.profittrailer.com:8080',
  DATA_API_URL: '/monitoring/data',
  CURRENCIES_API_URL: 'https://api.fixer.io/latest?base=USD',

  MARKET_CAP_LIMIT: 21,
  MARKET_CAP_CONVERT: 'usd',

  MIN_WIDTH_TO_SHOW_MENU: 770,
  HEIGHT_REMOVE_TO_FIX_SCROLLBAR: 26,
  SUCCESS_CODE: 200,

  // Configurations
  REFRESH_TIMER: 10000, // 10 seconds
  INACTIVITY_REFRESH_TIMER: 120, // 120 minutes
  COIN_MARKET_REFRESH: (20 * 60 * 1000), // 20 minutes
  CURRENCY_API_CALL_FREQUENCY: (24 * 60 * 60 * 1000), // 24 hours

  MARKET_CAP_CURRENCY: 'BTC',
  POSITIVE_CLASS_TEXT: 'text-success',
  NEGATIVE_CLASS_TEXT: 'text-danger',
  POSITIVE_BADGE: 'badge-success',
  NEGATIVE_BADGE: 'badge-danger',
  HIDE_MARKET_PRICE_ROW_COMPARISION: 'USDT',
  HIDE_PROFIT_MARKET_AND_ESTIMATED_USD: 'USDT',
  BASE_CURRENCY: 'USD',
  BASE_CURRENCY_SYMBOL: '$',
  // Currency symbols codes
  CURRENCY_SYMBOLS: {
    AUD: '&#36;', BGN: '&#1083;&#1074;', BRL: '&#82;&#36;',
    CAD: '&#36;', CHF: '&#67;&#72;&#70;', CNY: '&#165;',
    CZK: '&#75;&#269;', DKK: '&#107;&#114;', GBP: '&#163;',
    HKD: '&#36;', HRK: '&#107;&#110;', HUF: '&#70;&#116;',
    IDR: '&#82;&#112;', ILS: '&#8362;', INR: '&#x20B9;',
    JPY: '&#165;', KRW: '&#8361;', MXN: '&#36;', MYR: '&#82;&#77;',
    NOK: '&#107;&#114;', NZD: '&#36;', PHP: '&#8369;', PLN: '&#122;&#322;',
    RON: '&#108;&#101;&#105;', RUB: '&#8381;', SEK: '&#107;&#114;', SGD: '&#36;',
    THB: '&#3647;', TRY: '&#x20BA;', ZAR: '&#82;', EUR: '&#8364;'
  },
  DEFAULT_PRECISION: 8,
  
  // DT helper constants
  PROFIT_GREEN: 0,
  POSITIVE_CLASS: 'tdgreen',
  NEGATIVE_CLASS: 'tdred',
  FEE_LESS_THAN_ONE: 0.005,
  FEE_GREATER_THAN_ONE: 0.0025,

  ENABLE_CHNGE_PSWRD_ROLE: 'A',

  // NOTIFICATION
  NOTIFICATIONS: {
    MAX: 20,
    DEFAULT: 5,
    NOTIFICATIONS_CUT_OFF: 1500
  },
  MARKET_USDT_PRECISION: 2,
  DEFAULT_THEME: 'dark',
  DEFAULT_EDITOR_THEME: 'twilight',
  // URLs
  MARKET_CAP_API_URL: 'https://api.coinmarketcap.com/v1/ticker/?convert=',
  GLOBAL_MARKET_CAP_API_URL: 'https://api.coinmarketcap.com/v1/global/?convert='
};

// DT helper constants
PBConstants.POSSIBLE_CLASSES = PBConstants.POSITIVE_CLASS_TEXT + ' ' + PBConstants.NEGATIVE_CLASS_TEXT;

PBConstants.POSSIBLE_BADGES = PBConstants.POSITIVE_BADGE + ' ' + PBConstants.NEGATIVE_BADGE;

