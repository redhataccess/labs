'use strict';

require(['jquery'], function($) {
  $.getJSON('/services/user/status?jsoncallback=?', function(data) {
    if (data.authorized && data.internal) {
      $('body').addClass('admin');
    }
  })
});
