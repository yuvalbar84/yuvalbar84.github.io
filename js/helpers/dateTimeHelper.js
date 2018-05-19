var DateTimeHelper = (function () {
  function getDateObj (data, timeZoneOffset, isUTC) {
    if (!data) {
      return '';
    }
    var offset = getOffset(timeZoneOffset);
    var date = null;
    if (data instanceof Date) {
      if (isUTC) {
        date = new Date(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate(), data.getUTCHours(),
          data.getUTCMinutes(), data.getUTCSeconds());
      } else {
        date = new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours(),
          data.getMinutes(), data.getSeconds());
      }
    } else {
      date = new Date(data.date.year, data.date.month - 1, data.date.day, data.time.hour,
        data.time.minute, data.time.second);
    }
    date.setTime(date.getTime() + offset);
    return date;
  }

  function getOffset (timeZoneOffset) {
    var offset = 0;
    if (timeZoneOffset) {
      var hrsAndMin = timeZoneOffset.split(':');
      var hrs = +hrsAndMin[0];
      var mins = +hrsAndMin[1] ? +hrsAndMin[1] : 0;
      offset = hrs * 60 * 60 * 1000 + mins * 60 * 1000;
    }
    return offset;
  }

  function getDateAndTimeAgoForNotifications (date, serverOffset) {
    // To specify date is in UTC time zone.
    date = getUTCSuffixDate(date);
    var dtObj = getDateObj(new Date(date), serverOffset, true);
    var dateStr = formatDate(dtObj, false);

    var timeAgoStr = jQuery.timeago(date);
    return [dateStr, timeAgoStr];
  }

  function formatDate (dateObj, showSeconds) {
    if (!dateObj) {
      return '';
    }
    var dateFormat = Translations.getDateFormatByLang();
    var dateStr = convertToFormat(dateObj, dateFormat.dateFormat);
    var timeStr = converTimeToFormat(dateObj, showSeconds, dateFormat.is12HourFormat);
    return dateStr + ' ' + timeStr;
  }

  function converTimeToFormat (dateObj, showSeconds, is12HourFormat) {
    var hours = dateObj.getHours();
    var timePeriod = '';
    // For some countries we have to show in 12 hours format.
    if (is12HourFormat) {
      hours = hours > 12 ? hours - 12 : hours;
      timePeriod = dateObj.getHours() >= 12 && dateObj.getHours() !== 24 ? i18next.t('dataTableSection.PM.label') : i18next.t('dataTableSection.AM.label');
    }
    var timeStr = _makeTwoDigits(hours) + ':' +
      _makeTwoDigits(dateObj.getMinutes()) + timePeriod;
    if (showSeconds) {
      timeStr += ':' + _makeTwoDigits(dateObj.getSeconds());
    }
    return timeStr;
  }

  // Converts given date to specified format
  function convertToFormat (dateObj, dateFormat) {
    var month = dateObj.getMonth() + 1;
    var date = dateObj.getDate();
    var year = dateObj.getFullYear();
    var dateString;
    switch (dateFormat) {
      case 'yyyy.m.d':
        dateString = year + '.' + month + '.' + date;
        break;
      case 'yyyy-m-d':
        dateString = year + '-' + month + '-' + date;
        break;
      case 'yyyy/m/d':
        dateString = year + '/' + month + '/' + date;
        break;
      case 'yyyy/mm/dd':
        dateString = year + '/' + _makeTwoDigits(month) + '/' + _makeTwoDigits(date);
        break;
      case 'dd/mm/yyyy':
        dateString = _makeTwoDigits(date) + '/' + _makeTwoDigits(month) + '/' + year;
        break;
      case 'dd-mm-yyyy':
        dateString = _makeTwoDigits(date) + '-' + _makeTwoDigits(month) + '-' + year;
        break;
      case 'd-m-yyyy':
        dateString = date + '-' + month + '-' + year;
        break;
      case 'd/m/yyyy':
        dateString = date + '/' + month + '/' + year;
        break;
      case 'd/mm/yyyy':
        dateString = date + '/' + _makeTwoDigits(month) + '/' + year;
        break;
      case 'dd.mm.yyyy':
        dateString = _makeTwoDigits(date) + '.' + _makeTwoDigits(month) + '.' + year;
        break;
      case 'm/d/yyyy':
        dateString = month + '/' + date + '/' + year;
        break;
      default:
        dateString = _makeTwoDigits(date) + '.' + _makeTwoDigits(month) + '.' + year;
    }
    return dateString;
  }

  function formatTime (dateObj) {
    var currentLangFormat = Translations.getDateFormatByLang();
    var timeStr = converTimeToFormat(dateObj, false, currentLangFormat.is12HourFormat);
    return timeStr;
  }

  function getCurrentDateForFileName () {
    var currentDate = new Date();
    return String(currentDate.getFullYear()) + String(_makeTwoDigits(currentDate.getMonth() + 1))
      + String(_makeTwoDigits(currentDate.getDate())) + '-' + String(_makeTwoDigits(currentDate.getHours())) +
      String(_makeTwoDigits(currentDate.getMinutes())) + String(_makeTwoDigits(currentDate.getSeconds()));
  }

  function _makeTwoDigits (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value.toString();
  }

  function getUTCTime () {
    var now = new Date();
    var utcTimeStamp = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    return DateTimeHelper.formatDate(utcTimeStamp);
  }

  function addTimeZoneOffset (timeZoneOffset, date) {
    var offset = DateTimeHelper.getOffset(timeZoneOffset);
    var dateObj = new Date(date);
    dateObj.setTime(dateObj.getTime() + offset);
    return DateTimeHelper.formatDate(dateObj, true);
  }

  function getUTCTimeOnly () {
    var utcTimeStamp = _getUTCDateObj();
    return DateTimeHelper.formatTime(utcTimeStamp);
  }

  function getUTCDateWithOffset (timeZoneOffset) {
    var offset = getOffset(timeZoneOffset);
    var utcTimeStamp = _getUTCDateObj();
    utcTimeStamp.setTime(utcTimeStamp.getTime() + offset);
    return utcTimeStamp;
  }

  function _getUTCDateObj () {
    var now = new Date();
    var utcTimeStamp = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    return utcTimeStamp;
  }

  function getCurrentTimeZoneTime (timeZoneOffset) {
    var offset = DateTimeHelper.getOffset(timeZoneOffset);
    var utcTimeStamp = _getUTCDateObj();
    utcTimeStamp.setTime(utcTimeStamp.getTime() + offset);
    return DateTimeHelper.formatTime(utcTimeStamp);
  }

  function getUTCSuffixDate (date) {
    return date + '+00:00';
  }

  return {
    formatTime: formatTime,
    getDateObj: getDateObj,
    formatDate: formatDate,
    getOffset: getOffset,
    getUTCTime: getUTCTime,
    getUTCTimeOnly: getUTCTimeOnly,
    getCurrentTimeZoneTime: getCurrentTimeZoneTime,
    addTimeZoneOffset: addTimeZoneOffset,
    getUTCDateWithOffset: getUTCDateWithOffset,
    getUTCSuffixDate: getUTCSuffixDate,
    getCurrentDateForFileName: getCurrentDateForFileName,
    getDateAndTimeAgoForNotifications: getDateAndTimeAgoForNotifications
  };
})();