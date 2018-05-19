var Settings = (function () {

  var $switcheryElements = null;
  var $settingsLink = null;
  var $heartBeatsTab = null;
  var $settingsTabContainer = null;
  var themeObject = {
    dark: 'twilight',
    light: 'chrome'
  };

  var switcheryArr = [];
  var Service = null;
  var isSwitcheryElemClickedEvent = true;
  var lsCurrentTheme = 'currentTheme';
  var possibleThemesArr = ['dark', 'light'];
  var $wrapper = null;
  var $bodyLoadingSymbol = null;

  var switcherySettings = {
    color: '#3BAFDA',
    size: 'small',
    secondaryColor: '#FF9900'
  };

  function init () {
    $switcheryElements = $('.js-switchery');
    $settingsLink = $('#settingsLink');
    Service = Services(PBConstants.BASE_API_URL, PBConstants.MARKET_CAP_API_URL);
    $heartBeatsTab = $('#heartsBeatsTab');
    $settingsTabContainer = $('#settingsTabContainer');
    $wrapper = $('#wrapper');
    $bodyLoadingSymbol = $('#bodyLoadingSymbol');
    addEvents();
    initializeSwitchery();
  }

  function setSwitcheryElemsValue (data) {
    isSwitcheryElemClickedEvent = false;
    var idsArr = ['SOMSwitchery', 'SOMOSwitchery'];
    var valuesArr = [];
    data && data.settings && data.settings.hasOwnProperty('sellOnlyMode') ? valuesArr.push(data.settings.sellOnlyMode) : '';
    data && data.settings && data.settings.hasOwnProperty('sellOnlyModeOverride') ? valuesArr.push(data.settings.sellOnlyModeOverride) : '';

    for (var i = 0; i < idsArr.length; i++) {
      var $switcheryElement = $('#' + idsArr[i]);

      // Check whether current value and API data value are same or not.
      if ($switcheryElement[0].checked !== valuesArr[i]) {

        // If password set is false then som and somo will be disabled.
        // If they are disabled then enable, trigger click event and again disable.
        var isDisalbed = $switcheryElement[0].hasAttribute('disabled');
        isDisalbed ? switcheryArr[i].enable() : '';
        $switcheryElement.trigger('click');
        isDisalbed ? switcheryArr[i].disable() : '';
      }
    }
    isSwitcheryElemClickedEvent = true;
  }

  function hideBodyLoadingSymbol () {
    $bodyLoadingSymbol.hide();
    $wrapper.show();
  }

  function setTheme (isPageLoad, serverData) {
    var storedTheme = localStorage.getItem(lsCurrentTheme);
    // On page load we have to get theme from local storage current theme and show the portal in that theme.
    if (isPageLoad) {
      // If local storage theme is not set then wait untill first API call completes.
      if (storedTheme) {
        changeTheme(storedTheme);
        hideBodyLoadingSymbol();
      }
      return;
    }

    // This will get executed after every API call.
    if (serverData && serverData.settings) {
      // If server data has skin property and local storage theme value and API skin value is not same
      // then show portal in API skin color and update local storage theme value.
      var currentTheme = serverData.settings.skin;
      if (currentTheme && currentTheme === storedTheme && possibleThemesArr.indexOf(currentTheme) !== -1) {
        return;
      }
      if (currentTheme && currentTheme !== storedTheme && possibleThemesArr.indexOf(currentTheme) !== -1) {
        localStorage.setItem(lsCurrentTheme, serverData.settings.skin);
        hideBodyLoadingSymbol();
        changeTheme(currentTheme);
        return;
      }
    }

    // If API call fails then show portal in default theme.
    localStorage.setItem(lsCurrentTheme, PBConstants.DEFAULT_THEME);
    hideBodyLoadingSymbol();
  }

  // To change the theme of portal on function call. 
  function changeTheme (themeName) {
    var themeCustomHref = THEME_CSS_FILE_PATH + themeName + '/custom-' + themeName + '.css';

    // To get the href of the present theme css link.
    var hrefOld = $('link#customTheme').attr('href');
    var hrefOldArr = hrefOld ? hrefOld.split('?') : [];
    if (hrefOldArr[0] === themeCustomHref) {

      // To not change the theme if the current theme is same as the stored theme and will return back to the calling function.
      return;
    }

    // The theme will be applied based on the current theme.
    var newCustomTheme = '<link rel="stylesheet" type="text/css" href="' + themeCustomHref + '" id="customTheme">';
    $('link#customTheme').replaceWith(newCustomTheme);

    // To change the theme of configuration console.
    var editorTheme = themeObject[themeName] ? themeObject[themeName] : PBConstants.DEFAULT_EDITOR_THEME;
    DomHelper.setEditorTheme(editorTheme);
    return;
  }

  function displayHeartBeats (heartBeats, serverOffset) {
    $heartBeatsTab.empty();
    if (!heartBeats || heartBeats.length === 0) {

      // No heartbeats found.
      $heartBeatsTab.html(
        '<div class="text-center">' + i18next.t('constantMsgs.noHeartbeats') +
        '</div>'
      );
      return;
    }

    var heartBeatsHTML = '';
    var currentTheme = localStorage.getItem('currentTheme');
    currentTheme = currentTheme ? currentTheme : PBConstants.DEFAULT_THEME;
    var iconColor = currentTheme + '-theme-color';

    // Loop over through heartbeats and generate html
    for (var i = 0; i < heartBeats.length; i++) {
      var currentHeartbeat = heartBeats[i];
      var dateArr = DateTimeHelper.getDateAndTimeAgoForNotifications(currentHeartbeat.date, serverOffset);

      heartBeatsHTML += '<div>' +
        '<div class="notify-icon">' +
        '<i class="mdi ' + currentHeartbeat.icon.class
        + '" style="color:' + currentHeartbeat.icon[iconColor] + '"></i></div>' +
        '<div class="item-info">'
        + '<small class="text-muted">' + dateArr[0] + '</small>' +
        '<p class="heartbeat-details">' +
        currentHeartbeat.heartbeat
        + '</p>' +
        '<small class="text-muted">' +
        dateArr[1] +
        '</small></div></div>';
    }
    $heartBeatsTab.html(heartBeatsHTML);
  }

  function addEvents () {
    $settingsLink.click(function () {
      $('body').toggleClass('right-bar-enabled');
    });

    // Hide settings on click on body.
    $('body,  #appNotificationContainer a').click(function (e) {
      // Return if already settings tab is hidden.
      if (!$wrapper.hasClass('right-bar-enabled')) {
        return;
      }
      // Should not hide settings when the current target is settings link or settings tab or stop button alert.
      if (!$settingsTabContainer.has(e.target).length && !$settingsLink.has(e.target).length &&
        $settingsLink[0] !== e.target && $settingsTabContainer[0] !== e.target &&
        !$('.stop-button-alert').has(e.target).length) {
        $wrapper.removeClass('right-bar-enabled');
      }
    });

    // This will trigger two times when a user clicks
    // on switchery element and on setting switchery value after api call.
    // Below code should get executed only when a user clicks on switchery element.
    $wrapper.on('change', '.js-switchery', function () {
      if (isSwitcheryElemClickedEvent) {
        var somType = $(this).data('som-type');
        var value = this.checked;

        // Save value.
        Service[somType](value).done(function (data, textStatus, jqXHR) {
          if (jqXHR.status !== PBConstants.SUCCESS_CODE) {
            toastr.error(i18next.t('constantMsgs.ajaxError'));
          }
        });
      }
    });

    isSwitcheryElemClickedEvent = true;
  }

  function initializeSwitchery () {
    for (var j = 0; j < $switcheryElements.length; j++) {
      var switchery = new Switchery($switcheryElements[j], switcherySettings);
      switcheryArr.push(switchery);
    }
  }
  function getSwitchery () {
    return switcheryArr;
  }

  return {
    init: init,
    getSwitchery: getSwitchery,
    setSwitcheryElemsValue: setSwitcheryElemsValue,
    displayHeartBeats: displayHeartBeats,
    setTheme: setTheme
  };
})();
