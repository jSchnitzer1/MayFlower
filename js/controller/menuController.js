/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */


var MenuController = function (view, model) {
    var _this = this;

    _this.model = model;
    _this.view = view;

    _this.load = function () {
        _this.view.container.parent().children('div').each(function () {
            if($(this).is(":visible") && $(this).attr("id") != _this.view.container.attr("id")) {
                $(this).stop().animate({
                    width: "0px",
                    height: "0px",
                    opacity: "0"
                }, 400, function() {$(this).hide()});
                return false;
            }
        });

        var subLoad = function () {
            _this.view.updateMenu();
            _this.view.offUnusedControls();
            _this.view.updateMainContentHeight();
        };

        if( _this.view.container.width() == 0) {
            _this.view.container.stop().animate({
                width: "100%",
                height: "100%",
                opacity: "1"
            }, 500, function() {
                $(this).show();
                subLoad.call(this);
            });

        } else {
            _this.view.container.fadeIn(500, function () {
                subLoad.call(this);
            });
        }
    }

    $(window).resize(function() {
        _this.view.updateMainContentHeight();
    });

    _this.view.menu_print_btn.on("click", function (e) {
        e.preventDefault();
        _this.view.buildPrintMenu();
    })

    _this.init = function () {
        _this.load();
    }
}