'use strict';
(function() {
    window.chrometwo_require(['jquery'], function($) {
        function update_labs() {
            var labs = {};
            $('[data-lab_id]').each(function() {
                var lab_id = this.getAttribute('data-lab_id');
                if (!labs[lab_id]) {
                    labs[lab_id] = {};
                }
                if (this.className === 'featured') {
                    labs[lab_id].featured = this.checked;
                } else if (this.className === 'mostviewed') {
                    labs[lab_id].mostViewed = this.checked;
                }
            });
            $.ajax({
                url: '/labs/labs/',
                type: 'POST',
                data: JSON.stringify(labs),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function() {
                    window.location.reload();
                }
            });
        };
        $.getJSON('/services/user/status?jsoncallback=?', function(data) {
            if (data.authorized && data.internal) {
                $('body').addClass('admin');
                $('.btn-admin').click(function() {
                    update_labs();
                });
                $('[data-lab_id]').change(function() {
                    var lab_id = this.getAttribute('data-lab_id');
                    var checked = this.checked;
                    $('[data-lab_id="' + lab_id + '"].' + this.className).each(function() {
                        this.checked = checked;
                    });
                });
            }
        });
    });
})();
