var AppNotification = (function () {

  // elements
  var $appNotifications = null;
  var $lnkViewNotification = null;
  var $lnkToggleNotification = null;

  var notificationCopy = [];
  var serverOffset = null;
  var currentlyShown;

  var localStorageKey = 'notificationLastSeen';


  function init () {
    $appNotifications = jQuery('#appNotifications');
    $lnkViewNotification = jQuery('#lnkViewNotification');
    $lnkToggleNotification = jQuery('#lnkToggleNotification');
    // show default # of notifications
    currentlyShown = toggleShown(PBConstants.NOTIFICATIONS.MAX);

    // show empty notification list
    showEmpty();
    // Add the events
    addEvents();
  }

  function display (notificationList, timezoneOffset) {
    serverOffset = timezoneOffset;

    if (!Array.isArray(notificationList)) {
      notificationList = [];
    }

    // generate default notification html, reversing the array since notifications are being sent
    // in ascending order.
    showNotifications(notificationList.slice(-currentlyShown.count), serverOffset);
    $lnkViewNotification.text(currentlyShown.text);

    // keep a copy of the first X notifications for "View all"
    notificationCopy = notificationList.slice(-PBConstants.NOTIFICATIONS.MAX);
  }

  function addEvents () {
    $lnkViewNotification.click(function () {
      currentlyShown = toggleShown(currentlyShown.count);

      showNotifications(notificationCopy.slice(0, currentlyShown.count), serverOffset);
      $lnkViewNotification.text(currentlyShown.text);

      return false;
    });

    $lnkToggleNotification.click(function (event) {
      event.preventDefault();
      displayUnseenCount(0);
      if (notificationCopy.length > 0) {
        setLastSeen();
      }
    });
  }

  function toggleShown (count) {
    if (count === PBConstants.NOTIFICATIONS.MAX) {
      return {
        count: PBConstants.NOTIFICATIONS.DEFAULT,
        text: i18next.t('constantMsgs.viewAll')
      };
    } else {
      return {
        count: PBConstants.NOTIFICATIONS.MAX,
        text: i18next.t('constantMsgs.viewLess')
      };
    }
  }

  function showNotifications (notifications, serverOffset) {
    $appNotifications.empty();
    if (!notifications || notifications.length === 0) {
      // no notifications found, show empty and hide the "view all / view less" button
      showEmpty();
      return;
    }

    // notifications found, show the "view all / view less" button.
    $lnkViewNotification.show();

    var lastSeen = getLastSeen();
    var lastSeenDt = new Date(lastSeen);
    var unseenNotification = 0;

    var notificationHtml = '';
    var currentTheme = localStorage.getItem('currentTheme');
    currentTheme = currentTheme ? currentTheme : PBConstants.DEFAULT_THEME;
    var iconColor = currentTheme + '-theme-color';
    for (var i = 0; i !== notifications.length; ++i) {
      var currNotification = notifications[i];
      var date = new Date(DateTimeHelper.getUTCSuffixDate(currNotification.date));
      if (date.getTime() > lastSeenDt.getTime()) {
        ++unseenNotification;
      }
      var time = DateTimeHelper.getDateAndTimeAgoForNotifications(currNotification.date, serverOffset);
      time = time[0] + ' (' + time[1] + ')';
      notificationHtml += getNotificationHtml(currNotification.icon, currNotification.notification, time, iconColor);
    }

    $appNotifications.append(notificationHtml);

    // update the last seen value.
    displayUnseenCount(unseenNotification);
  }



  function getNotificationHtml (icon, text, time, iconColor) {
    return '<div class="dropdown-item notify-item">' +
      '<div class="notify-icon">' +
      '<i class="mdi ' + icon.class
      + '" style="color:' + icon[iconColor] + '"></i>' +
      '</div>' +
      '<p class="notify-details" title="' + text + '">' + text +
      '<small class="text-muted">' + time + '</small>' +
      '</p>' +
      '</div>';
  }

  function getLastSeen () {
    var lastSeen = localStorage.getItem(localStorageKey);
    if (!lastSeen) {
      // dummy value.
      lastSeen = '2010-07-09T00:00:00+00:00';
    }
    return lastSeen;
  }

  function setLastSeen () {
    var dateStr = '';
    if (notificationCopy.length > 0) {
      // set the date of the last notification.
      dateStr = DateTimeHelper.getUTCSuffixDate(notificationCopy[0].date);
    } else {
      // since notification list is empty, lets set this to the current time.
      dateStr = DateTimeHelper.getUTCSuffixDate(new Date().toISOString());
    }
    localStorage.setItem(localStorageKey, dateStr);
  }

  function showEmpty () {
    $appNotifications.html(
      '<div class="dropdown-item notify-item text-center">' + i18next.t('constantMsgs.noNotifications') +
      '</div>'
    );
    $lnkViewNotification.hide();
  }

  function displayUnseenCount (count) {
    if ($appNotifications.is(':visible')) {
      // notification dropdown is visible nothing to update, so the latest notification
      // must have already been seen ... the last seen.
      setLastSeen();
      return;
    }
    $lnkToggleNotification.find('span.badge').hide();
    if (count === 0) {
      return;
    }
    $lnkToggleNotification.find('span.badge').html(count).show();
  }

  return {
    display: display,
    init: init
  };
})();