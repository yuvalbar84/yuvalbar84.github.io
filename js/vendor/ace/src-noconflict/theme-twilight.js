/ Modified by us to meet the required UI /
ace.define("ace/theme/twilight",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-twilight";
exports.cssText = ".ace-twilight .ace_gutter {\
background: #36404a;\
color: #ffffff\
}\
.ace-twilight .ace_print-margin {\
width: 1px;\
background: #323b44\
}\
.ace-twilight {\
background-color: #323b44;\
color: #F8F8F8\
}\
.ace-twilight .ace_cursor {\
color: #F8F8F8\
}\
.ace-twilight .ace_marker-layer .ace_selection {\
background: rgba(221, 240, 255, 0.20)\
}\
.ace-twilight.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #141414;\
}\
.ace-twilight .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-twilight .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(255, 255, 255, 0.25)\
}\
.ace-twilight .ace_marker-layer .ace_active-line {\
background: rgba(255, 255, 255, 0.031)\
}\
.ace-twilight .ace_gutter-active-line {\
background-color: rgba(255, 255, 255, 0.031)\
}\
.ace-twilight .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(221, 240, 255, 0.20)\
}\
.ace-twilight .ace_invisible {\
color: rgba(255, 255, 255, 0.25)\
}\
.ace-twilight .ace_keyword,\
.ace-twilight .ace_meta {\
color: #ffd700\
}\
.ace-twilight .ace_constant,\
.ace-twilight .ace_constant.ace_character,\
.ace-twilight .ace_constant.ace_character.ace_escape,\
.ace-twilight .ace_constant.ace_other,\
.ace-twilight .ace_heading,\
.ace-twilight .ace_markup.ace_heading,\
.ace-twilight .ace_support.ace_constant {\
color: #CF6A4C\
}\
.ace-twilight .ace_invalid.ace_illegal {\
color: #F8F8F8;\
background-color: rgba(86, 45, 86, 0.75)\
}\
.ace-twilight .ace_invalid.ace_deprecated {\
text-decoration: underline;\
font-style: italic;\
color: #D2A8A1\
}\
.ace-twilight .ace_support {\
color: #9B859D\
}\
.ace-twilight .ace_fold {\
background-color: #AC885B;\
border-color: #F8F8F8\
}\
.ace-twilight .ace_support.ace_function {\
color: #da9f85\
}\
.ace-twilight .ace_list,\
.ace-twilight .ace_markup.ace_list,\
.ace-twilight .ace_storage {\
color: #fde94a\
}\
.ace-twilight .ace_entity.ace_name.ace_function,\
.ace-twilight .ace_meta.ace_tag,\
.ace-twilight .ace_variable {\
color: #AC885B\
}\
.ace-twilight .ace_string {\
color: #3bafda\
}\
.ace-twilight .ace_string.ace_regexp {\
color: #e98c62\
}\
.ace-twilight .ace_comment {\
font-style: italic;\
color: #858788\
}\
.ace-twilight .ace_variable {\
color: #FF9900\
}\
.ace-twilight .ace_xml-pe {\
color: #e80f0f\
}\
.ace-twilight .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMQERFpYLC1tf0PAAgOAnPnhxyiAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
