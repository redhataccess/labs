'use strict';
(function() {
    window.chrometwo_require(['jquery'], function($) {
        var $btns = $('.labs-filter .btn'),
            body = document.body,
            $body = $(body);
        $btns.click(function() {
            var $this = $(this);
            var hadClass = $this.hasClass('active');
            $btns.removeClass('active');
            var typeClass = 'types-' + $this.data('type');
            if (!hadClass) {
                $this.addClass('active');
                body.className = body.className.replace(/(^|\s)types-\S+/g, '');
                body.className += (' ' + typeClass);
            } else {
                $body.removeClass(typeClass);
            }
        });
    });
})();
