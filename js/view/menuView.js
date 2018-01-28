/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */

var MenuView = function (container, model) {

    var _this = this;

    _this.container = container;
    _this.model = model;

    _this.numberOfGuests = container.find(".numberOfGuests");

    _this.updateGustsView = function (value) {
        _this.numberOfGuests.val(_this.model.getNumberOfGuests());
    }

}