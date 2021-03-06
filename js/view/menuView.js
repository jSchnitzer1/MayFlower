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

    //_this.menu_total_guest = container.find("#menu_total_guest");
    _this.menu_total_price = container.find("#menu_total_price");
    _this.menu_dishes = container.find(".menu_dishes");
    _this.menu_print_btn = container.find("#menu_print_btn");
    _this.menu_modal_table = container.parents().find("#menu_modal_table");
    _this.print_menu_table = container.parents().find("#print_menu_table");

    var main_banner = container.find(".main_banner");
    var menu_top = container.find(".menu_top");
    var footer = container.find(".footer");
    var menu_content = container.find(".menu_content");

    _this.update = function (obj) {
        var updateMenu = function () {

            var totalGuests = _this.model.getNumberOfGuests()
            var menu = _this.model.getMenu();
            var totalPrice = _this.model.getTotalMenuPrice();
            var menu_html = "";

            //_this.menu_total_guest.html(totalGuests + " People");
            _this.menu_total_price.html(totalPrice + ":- SEK");

            _.each(menu, function (val, i) {
                menu_html += '<div class="responsive">' +
                    '<div class="dish_view" onclick="controller.build_dish_details(' + val.id + ')">' +
                    '<a class="dish_view_select">' +
                    '<img src="' + val.image + '" alt="' + val.title + '">' +
                    '</a>' +
                    '<div class="desc">' + val.title + '</div>' +
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

            total_height += 140;

            menu_content.height(
                $(window).height() - total_height
            );
        }

        var buildPrintMenu = function () {
            var menu = _this.model.getMenu();


            _this.menu_modal_table.children('tbody').children('tr').remove();
            _.each(menu, function (val, i) {
                var tr_html = "";
                if (i === (menu.length - 1)) {
                    tr_html += '<tr style="border: none">';
                }
                else {
                    tr_html += '<tr>';
                }
                tr_html += '<td class="modal_img"><img src="' + val.image + '"></td>' +
                    '<td class="modal_desc">' +
                    '<div class="modal_dish_label">' + val.title + '</div>' +
                    '<div class="modal_dish_type">' + val.type + '</div>' +
                    '<div class="modal_dish_detail">' +
                    '<div class="modal_sales">Cooking Time: ' + val.cookingtime + ' minutes</div>' +
                    '<div class="modal_rank">Score: ';

                for (var i = 0; i < val.score; i++) {
                    tr_html += '<span class="fa fa-star"></span>';
                }

                tr_html += '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="modal_preperation">' + val.instructions + '</td>' +
                    '</tr>';

                _this.menu_modal_table.append(tr_html);
            });
        }

        updateMenu();
        _this.updateMainContentHeight();
        buildPrintMenu();
    };

    _this.update();

}