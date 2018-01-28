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

    _this.menu_back = container.find("#menu_back");

    _this.menu_total_guest = container.find("#menu_total_guest");
    _this.menu_total_price = container.find("#menu_total_price");
    _this.menu_dishes = container.find(".menu_dishes");
    _this.plusGuest = container.find(".plusGuest");
    _this.minusGuest = container.find(".minusGuest");
    _this.menu_print_btn = container.find(".menu_print_btn");

    var main_banner = container.find(".main_banner");
    var menu_top = container.find(".menu_top");
    var footer = container.find(".footer");
    var menu_content = container.find(".menu_content");

    
    _this.updateMenu = function () {

        var totalGuests = _this.model.getNumberOfGuests()
        var menu = _this.model.getMenu();
        var totalPrice = _this.model.getTotalMenuPrice();
        var menu_html = "";

        _this.menu_total_guest.html(totalGuests + " People");
        _this.menu_total_price.html("SEK " + totalPrice);

        jQuery.each(menu, function (i, val) {
            var dish = _this.model.getDish(val.id);
            menu_html += '<div class="responsive">' +
                '<div class="dish_view" onclick="controller.build_dish_details(' + val.id + ')">' +
                '<a class="dish_view_select">' +
                '<img src="images/' + dish.image + '" alt="' + dish.name + '">' +
                '</a>' +
                '<div class="desc">' + dish.name + '</div>' +
                '</div>' +
                '</div>';
        });

        _this.menu_dishes.html(menu_html);
    }

    _this.offUnusedControls = function () {
        _this.plusGuest.off("click");
        _this.minusGuest.off("click");
    }

    _this.updateMainContentHeight = function () {
        var total_height = 0;

        total_height = main_banner.outerHeight() +
            footer.outerHeight() +
            menu_top.outerHeight();

        total_height += 50; // lets consider 15 as margin bottom !

        menu_content.height(
            $(window).height() - total_height
        );
    }

}