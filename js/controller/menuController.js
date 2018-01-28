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
            if($(this).is(":visible")) {
                $(this).stop().animate({
                    width: "0px",
                    height: "0px",
                    opacity: "0"
                }, 400, function() {$(this).hide()});
                return false;
            }
        });
        _this.view.container.fadeIn(500, function () {
            _this.view.updateGustsView();
        });
    }

    _this.init = function () {
        _this.load();
    }
}