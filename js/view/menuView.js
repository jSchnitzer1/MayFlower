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
    _this.menu_print_btn = container.find("#menu_print_btn");
    _this.menu_modal_table = container.parents().find("#menu_modal_table");
    _this.print_menu_table = container.parents().find("#print_menu_table");

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

        _.each(menu, function (val, i) {
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

    _this.buildPrintMenu = function () {
        var menu = _this.model.getMenu();


        _this.menu_modal_table.children('tbody').children('tr').remove();
        _.each(menu, function (val, i) {
            var tr_html = "";
            var dish = _this.model.getDish(val.id);
            if (i === (menu.length - 1)) {
                tr_html += '<tr style="border: none">';
            }
            else {
                tr_html += '<tr>';
            }
            tr_html += '<td class="modal_img"><img src="images/' + dish.image + '"></td>' +
                '<td class="modal_desc">' +
                '<div class="modal_dish_label">' + dish.name + '</div>' +
                '<div class="modal_dish_type">' + dish.type + '</div>' +
                '<div class="modal_dish_detail">' +
                '<div class="modal_rank">rank: ';

            var rank = Math.round(dish.rank);

            for (var i = 0; i < rank; i++) {
                tr_html += '<span class="fa fa-star"></span>';
            }

            tr_html += '</div>' +
                '<div class="modal_sales">Sales: ' + dish.sales + '</div>' +
                '</div>' +
                '</td>' +
                '<td class="modal_preperation">' + dish.description + '</td>' +
                '</tr>';

            _this.menu_modal_table.append(tr_html);

        });
    }

}