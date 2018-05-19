var AppNotification = (function () {

  // elements
  var $appNotifications = null;
  var $lnkViewNotification = null;
  var $lnkToggleNotification = null;

  var notificationCopy = [];
  var serverOffset = null;

  // show default # of notifications
  var currentlyShown = toggleShown(PBConstants.NOTIFICATIONS.MAX);

  var localStorageKey = 'notificationLastSeen';

  var ICONS = {
    'cache-heartbeat': {
      class: 'mdi-heart-pulse',
      color: '#3bafda'
    },
    'dca-heartbeat': {
      class: 'mdi-heart-pulse',
      color: 'rgba(133, 187, 101, 0.75)'
    },
    'normal-heartbeat': {
      class: 'mdi-heart-pulse',
      color: '#ef5350'
    },
    'detected configuration changes': {
      class: 'mdi-settings',
      color: 'rgba(176, 196, 222, 0.75)'
    },
    'default': {
      class: 'mdi-alert-circle-outline',
      color: '#FF9900'
    }
  };

  function init() {
    $appNotifications = jQuery('#appNotifications');
    $lnkViewNotification = jQuery('#lnkViewNotification');
    $lnkToggleNotification = jQuery('#lnkToggleNotification');

    // show empty notification list
    showEmpty();
    // Add the events
    addEvents();
  }

  function display(notificationList, timezoneOffset) {
    serverOffset = timezoneOffset;

    if (!Array.isArray(notificationList)) {
      notificationList = [];
    }

    // generate default notification html, reversing the array since notifications are being sent
    // in ascending order.
    showNotifications(notificationList.slice(-currentlyShown.count).reverse(), serverOffset);
    $lnkViewNotification.text(currentlyShown.text);

    // keep a copy of the first X notifications for "View all"
    notificationCopy = notificationList.slice(-PBConstants.NOTIFICATIONS.MAX).reverse();
  }

  function addEvents() {
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

  function toggleShown(count) {
    if (count === PBConstants.NOTIFICATIONS.MAX) {
      return {
        count: PBConstants.NOTIFICATIONS.DEFAULT,
        text: 'View all'
      };
    } else {
      return {
        count: PBConstants.NOTIFICATIONS.MAX,
        text: 'View less'
      };
    }
  }

  function showNotifications(notifications, serverOffset) {
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
    for (var i = 0; i !== notifications.length; ++i) {
      var currNotification = notifications[i];
      var icon = getIconType(currNotification.notification);
      var date = new Date(DateTimeHelper.getUTCSuffixDate(currNotification.date));
      if (date.getTime() > lastSeenDt.getTime()) {
        ++unseenNotification;
      }
      var time = getTime(currNotification.date, serverOffset);
      notificationHtml += getNotificationHtml(icon, currNotification.notification, time);
    }

    $appNotifications.append(notificationHtml);

    // update the last seen value.
    displayUnseenCount(unseenNotification);
  }

  function getIconType(text) {
    var lowerText = text.toLowerCase();
    var icon = null;
    if (ICONS.hasOwnProperty(lowerText)) {
      icon = ICONS[lowerText];
    } else {
      icon = ICONS.default;
    }
    return icon;
  }

  function getTime(date, serverOffset) {
    var dtObj = DateTimeHelper.getDateObj(new Date(date), serverOffset);

    // doing this to make timeago treat the date as UTC time.
    var timeAgoStr = jQuery.timeago(DateTimeHelper.getUTCSuffixDate(date));
    var dateStr = DateTimeHelper.formatDate(dtObj, false);

    return dateStr + ' (' + timeAgoStr + ')';
  }

  function getNotificationHtml(icon, text, time) {
    return '<div class="dropdown-item notify-item">' +
      '<div class="notify-icon">' +
      '<i class="mdi ' + icon.class
      + '" style="color:' + icon.color + '"></i>' +
      '</div>' +
      '<p class="notify-details" title="' + text + '">' + text +
      '<small class="text-muted">' + time + '</small>' +
      '</p>' +
      '</div>';
  }

  function getLastSeen() {
    var lastSeen = localStorage.getItem(localStorageKey);
    if (!lastSeen) {
      // dummy value.
      lastSeen = '2010-07-09T00:00:00+00:00';
    }
    return lastSeen;
  }

  function setLastSeen() {
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

  function showEmpty() {
    $appNotifications.html(
      '<div class="dropdown-item notify-item text-center">' +
      'No notifications.' +
      '</div>'
    );
    $lnkViewNotification.hide();
  }

  function displayUnseenCount(count) {
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