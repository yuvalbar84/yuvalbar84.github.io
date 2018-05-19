var resizefunc = [];
var currentTheme = localStorage.getItem('currentTheme');
// By default we will load dark theme, if localstorage theme is light then 
// we will change theme to light.
if (currentTheme === 'light') {
    var lightThemePath = '../css/themes/light/template-style.css';
    var newCustomTheme = '<link rel="stylesheet" type="text/css" href="' + lightThemePath + '" id="customTheme">';
    $('link#customTheme').replaceWith(newCustomTheme);
}

