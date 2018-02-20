/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-02-19
 */


var IndexController = function (view, model) {

    var _this = this;

    _this.model = model;
    _this.view = view;

    _this.load = function () {
        _this.view.container.fadeIn(500);

        _this.view.container.css("display", "block");
        $(window).delay(50).queue(function() {
            _this.view.loadAnimation();
        });
    }

    _this.init = function () {
        _this.load();
    }

}