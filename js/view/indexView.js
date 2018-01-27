/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */

var IndexView = function (container, model) {

    var _this = this;
    _this.container = container;
    _this.model = model;

    _this.heading = _this.container.find(".heading");
    _this.subheading = _this.container.find(".subheading");
    _this.reserve = _this.container.find(".reserve");

    this.loadAnimation = function() {
        _this.heading.addClass('hanimate');
        _this.subheading.addClass('sanimate');
        _this.reserve.addClass('ranimate');
    }


}