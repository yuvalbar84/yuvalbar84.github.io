var DomHelper = (function () {

  var $stopBtnContainer = $('#btnStopContainer');
  var $logoutBtnContainer = $('#btnLogoutContainer');
  var $chngePswrdBtnContainer = $('#btnChngePswrdContainer');
  var $switcheryInputs = $('.js-switchery');
  var editor;
  var currentEditorTheme;

  // To make the editor variable's property be available to global scope.
  function getGlobalEditor () {
    editor = ace.edit('PBConfigEditor');
    editor.focus();
    // TODO: change the below code.
    currentEditorTheme = currentEditorTheme ? currentEditorTheme : PBConstants.DEFAULT_EDITOR_THEME;
    // To set editor theme on page load.
    editorConfiguration(editor, currentEditorTheme);
    return editor;
  }

  // Function to set the editor when we have properties in editor variable
  function setEditorTheme (editorTheme) {
    currentEditorTheme = editorTheme;

    // Generates editor when editor has required properties.
    if (editor) {
      editorConfiguration(editor, currentEditorTheme);
    }

  }

  function editorConfiguration (editor, currentEditorTheme) {
    currentEditorTheme = 'ace/theme/' + currentEditorTheme;
    editor.setTheme(currentEditorTheme);
    editor.getSession().setMode('ace/mode/properties');
  }

  /**
   * It checks whether data exists or not and bind the data to the given id element.
   */
  function checkAndBindData (elems, data, possibleClasses, classesObj) {
    // Loop over the elements
    for (var prop in elems) {
      var elemId = '#' + elems[prop][0];
      var $elem = $(elemId);
      // Check if data has given property.
      if (data.hasOwnProperty(prop)) {
        // Bind the data.
        $elem.html(data[prop]);
        addClassesAndTitles($elem, prop, elems, data, possibleClasses, classesObj);
      } else {
        $elem.html('--');
      }
    }
  }

  function addClassesAndTitles ($elem, prop, elems, data, possibleClasses, classesObj) {
    // Remove possible classes and add given class.
    var elementClass = elems[prop][1];
    possibleClasses = possibleClasses ? possibleClasses : '';
    $elem.removeClass(possibleClasses);
    elementClass ? $elem.addClass(classesObj[elementClass]) : '';
    // Check whether title is there, if it's there then add it.
    var elementTitle = elems[prop][2];
    elementTitle ? $elem.attr('title', data[elementTitle]) : '';
  }

  /**
   * Removes all the possible classes and adds the current class.
   */
  function replaceClasses ($element, possibleClassesArr, currentClass) {
    var possibleClasses = possibleClassesArr.join(' ');
    $element.removeClass(possibleClasses).addClass(currentClass);
  }

  function toggleBtns (enable, setttingsDetails) {
    if (!setttingsDetails) {
      return;
    }
    // Enable Logout button only when AJAX calls succeed and password is set.
    var enableLogoutBtn = enable && setttingsDetails.password;
    // Enable stop button only when AJAX calls succeed and enable shutdown is true.
    var enableStpBtn = enable && setttingsDetails.enableShutdown;
    toggleBtn($stopBtnContainer, enableStpBtn, 'settingInfo.noEnableShutdown.title');
    toggleBtn($logoutBtnContainer, enableLogoutBtn, 'settingInfo.noPswrd.title');
    toggleBtn($chngePswrdBtnContainer, setttingsDetails.enableChngePswrd, 'settingInfo.chngePswrd.title', { role: PBConstants.ENABLE_CHNGE_PSWRD_ROLE });
    toggleSwitcheryBtns(enable, setttingsDetails);
  }

  function updatePageTitle (title) {
    document.title = title;
  }

  function toggleBtn ($btnContainer, enable, label, labelParams) {
    if (enable) {
      $btnContainer.removeClass('disabled').attr('data-original-title', '');
      $btnContainer.find('.btn').removeClass('disabled').attr('disabled', false);
    } else {
      $btnContainer.addClass('disabled').attr('data-original-title', i18next.t(label, labelParams));
      $btnContainer.find('.btn').addClass('disabled').attr('disabled', true);
    }
  }

  function toggleSwitcheryBtns (enable, setttingsDetails) {
    var $switchery = $('#settingsTab .switchery');
    enable = enable && setttingsDetails.passwordAndConfig;
    var switcheryArr = Settings.getSwitchery();
    $switchery.tooltip('dispose').tooltip({
      placement: 'bottom'
    });
    // Enable switchery buttons only when AJAX calls succeed and password and config are set.
    if (enable) {
      for (var i = 0; i < switcheryArr.length; i++) {
        switcheryArr[i].element.disabled ? switcheryArr[i].enable() : '';
      }
      $switchery.attr('data-original-title', '');
      $switcheryInputs.attr('disabled', false);
    } else {
      for (var j = 0; j < switcheryArr.length; j++) {
        !switcheryArr[j].element.disabled ? switcheryArr[j].disable() : '';
      }
      $switchery.attr('data-original-title', i18next.t('settingInfo.noPswrdAndConfig.title'));
      $switcheryInputs.attr('disabled', true);
    }
  }

  return {
    checkAndBindData: checkAndBindData,
    replaceClasses: replaceClasses,
    toggleBtns: toggleBtns,
    updatePageTitle: updatePageTitle,
    setEditorTheme: setEditorTheme,
    getGlobalEditor: getGlobalEditor
  };
}());
