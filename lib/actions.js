'use strict';

exports.__esModule = true;
exports.updateScrollTop = updateScrollTop;
var UPDATE_SCROLL_TOP = exports.UPDATE_SCROLL_TOP = '@@redux-devtools-src/UPDATE_SCROLL_TOP';
function updateScrollTop(scrollTop) {
  return { type: UPDATE_SCROLL_TOP, scrollTop: scrollTop };
}