var Translations = (function () {
  var DEFAULT_LANGUAGE = 'engb';
  var LANGUAGE_TO_LOAD_LS_KEY = 'languageToLoad';
  var defaultLang = localStorage.getItem('languageToLoad') ? localStorage.getItem('languageToLoad') : DEFAULT_LANGUAGE;
  var $langFlag = null;
  var $lastUpdatedOn = null;

  // For loading flags based on language
  var flagClass = {
    enus: {
      class: 'us',
      title: 'American English - US',
      dateFormat: 'm/d/yyyy',
      is12HourFormat: true
    },
    engb: {
      class: 'gb',
      title: 'European English - UK',
      dateFormat: 'dd/mm/yyyy'
    },
    fr: {
      class: 'fr',
      title: 'French - France',
      dateFormat: 'dd/mm/yyyy'
    },
    br: {
      class: 'br',
      title: 'Brazilian Portuguese  - Brazil',
      dateFormat: 'dd/mm/yyyy'
    },
    ja: {
      class: 'jp',
      title: 'Japanese - Japan',
      dateFormat: 'yyyy/mm/dd'
    },
    es: {
      class: 'es',
      title: 'Spanish - Spain',
      dateFormat: 'd/mm/yyyy'
    },
    ru: {
      class: 'ru',
      title: 'Russian - Russia',
      dateFormat: 'dd.mm.yyyy'
    },
    vi: {
      class: 'vn',
      title: 'Vietnamese - Vietnam',
      dateFormat: 'dd/mm/yyyy'
    },
    chs: {
      class: 'cn',
      title: 'Simplified Chinese - China',
      dateFormat: 'yyyy-m-d'
    },
    cht: {
      class: 'tw',
      title: 'Traditional Chinese - Taiwan',
      dateFormat: 'yyyy/m/d'
    },
    el: {
      class: 'gr',
      title: 'Greek - Greece',
      dateFormat: 'd/m/yyyy'
    },
    tr: {
      class: 'tr',
      title: 'Turkish - Turkey',
      dateFormat: 'dd.mm.yyyy'
    },
    it: {
      class: 'it',
      title: 'Italian - Italy',
      dateFormat: 'dd/mm/yyyy'
    },
    de: {
      class: 'de',
      title: 'German - Germany',
      dateFormat: 'dd.mm.yyyy'
    },
    no: {
      class: 'no',
      title: 'Norwegian - Norway',
      dateFormat: 'dd.mm.yyyy'
    },
    nl: {
      class: 'nl',
      title: 'Dutch - Netherlands',
      dateFormat: 'd-m-yyyy'
    },
    pt: {
      class: 'pt',
      title: 'Portuguese - Portugal',
      dateFormat: 'dd-mm-yyyy'
    },
    ar: {
      class: 'il',
      title: 'Arabic - Israel',
      dateFormat: 'dd/mm/yyyy'
    },
    ko: {
      class: 'kr',
      title: 'Korean - South Korea',
      dateFormat: 'yyyy.m.d'
    }
  };

  // Saves API language value in local storage
  function setLanguageInLocalStorage (lang) {
    localStorage.setItem(LANGUAGE_TO_LOAD_LS_KEY, lang);
  }

  // Returns date format based on the language
  function getDateFormatByLang () {
    var languageToLoad = (defaultLang && flagClass.hasOwnProperty(defaultLang)) ? defaultLang : DEFAULT_LANGUAGE.toLowerCase();
    return flagClass[languageToLoad];
  }

  function init () {
    $langFlag = $('.language-flag');
    $lastUpdatedOn = $('#dvLastUpdatedOn');
    i18next.use(i18nextXHRBackend);
    i18next.init({
      lng: defaultLang,
      fallbackLng: DEFAULT_LANGUAGE,
      initImmediate: false,
      backend: {
        loadPath: 'locales/{{lng}}/{{lng}}.json?ver=' + APP_VERSION
      }
    }, function (err, t) {
      jqueryI18next.init(i18next, $);
      $('body').localize();

      // Trigger event after the page load
      $(document).trigger('evt.after-lang-file-load');
    });
  }

  function loadCurrentLanguage (data) {
    // Check whether we are supporting given language and load labels of given language.
    var languageFromAPI = data.settings.language ? data.settings.language.toLowerCase() : '';
    var languageToLoad = (languageFromAPI && flagClass.hasOwnProperty(languageFromAPI)) ? languageFromAPI : DEFAULT_LANGUAGE.toLowerCase();
    if (localStorage.getItem(LANGUAGE_TO_LOAD_LS_KEY) !== languageToLoad) {
      setLanguageInLocalStorage(languageToLoad);
      location.reload();  // Reload the page if the localstorage language & API returned language are not same
    }
    // Add corresponding flag class.
    $langFlag.addClass('flag-icon-' + flagClass[languageToLoad].class)
      .attr('data-original-title', flagClass[languageToLoad].title);
  }

  function loadTimeAgoTranslations () {
    // Load timeago language file based on API response
    $lastUpdatedOn.html(i18next.t('summaryItems.updated', { 'timeAgo': '<time class="time-ago" id="spnTimeAgo"></time>' }));
    loadRelatedTimeagoMsgs(localStorage.getItem(LANGUAGE_TO_LOAD_LS_KEY));
    $('#spnTimeAgo').timeago();
  }

  // Loads timeago locale files based on given api language.
  function loadRelatedTimeagoMsgs (lang) {
    var filePath = TIMEAGO_LOCALE_FILE_PATH + 'jquery.timeago.' + lang + '.js';
    $.getScript(filePath)
      .fail(function (jqxhr, settings, exception) {
        console.log(exception);
      });
  }

  return {
    loadCurrentLanguage: loadCurrentLanguage,
    loadTimeAgoTranslations: loadTimeAgoTranslations,
    getDateFormatByLang: getDateFormatByLang,
    init: init
  };

})();
