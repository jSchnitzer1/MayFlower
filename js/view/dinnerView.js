/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */

var DinnerView = function (container, model) {
    var _this = this;

    _this.container = container;
    _this.model = model;

    _this.numberOfGuests = container.find(".numberOfGuests");
    _this.plusButton = container.find(".plusGuest");
    _this.minusButton = container.find(".minusGuest");
    _this.select_dish = container.find(".select_dish");
    _this.select_dish_label = container.find(".select_dish_label");
    _this.search_txt = container.find("#search_txt");
    _this.nav_menu_wrap = container.find(".nav-menu-wrap");
    _this.nav_menu_toggle = container.find(".nav-menu-toggle");
    _this.nav_menu_close = container.find(".nav-menu .close");

    this.updateGustsView = function (value) {
        _this.numberOfGuests.val(_this.model.getNumberOfGuests());
    }

    this.updateGustsView();
}
 
