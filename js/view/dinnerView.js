/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-27
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
    _this.btn_search = container.find("#btn_search");
    _this.dish_view_select = container.find(".dish_view_select");
    _this.d_label = container.find(".d_label");
    _this.d_img = container.find("#d_img");
    _this.d_desc = container.find(".d_desc");
    _this.d_back = container.find("#d_back");
    _this.ing_table = container.find("#ing_table");
    _this.add_menu = container.find("#add_menu");
    _this.d_price = container.find("#d_price");
    _this.d_label_table = container.find("#d_label_table");
    _this.menu_table = container.find(".menu_table");

    var main_banner = container.find(".main_banner");
    var footer = container.parents().find(".footer");
    var top_banner = container.find(".top_banner");
    var dishes_content = container.find(".dishes_content");
    var container_left = container.find(".container_left");
    var dish_details = container.find(".dish_details");
    var total_cost = container.find(".total_cost span");
    var total = container.find(".total");

    _this.updateGustsView = function (value) {
        _this.numberOfGuests.val(_this.model.getNumberOfGuests());
    }

    _this.updateCurrentViewDishTable = function () {
        if (dish_details.is(":visible")) {

            var id = _this.model.getCurrentViewDish();
            var dish = _this.model.getDish(id);
            var totalGuests = _this.model.getNumberOfGuests();
            var price = 0;

            _this.d_label_table.html(dish.name + " for: " + "<span>" + totalGuests + " people</span>");
            $("#ing_table tr").remove();
            jQuery.each(dish.ingredients, function (i, val) {
                price += (val.price * totalGuests);
                var ing_html = '<tr>' +
                    '<th scope="row">' + val.name + '</th>' +
                    '<td>' + (parseInt(val.quantity) * totalGuests) + '</td>' +
                    '<td>' + val.unit + '</td>' +
                    '<td>SEK ' + (val.price * totalGuests) + '</td>' +
                    '</tr>';
                _this.ing_table.append(ing_html);
            });
            _this.d_price.html(price);
        }
    }

    _this.updateMainContentHeight = function (type) {
        var total_height = 0;

        if (dishes_content.is(":visible")) {
            if (type == "desktop") {
                total_height = main_banner.outerHeight() +
                    footer.outerHeight() +
                    top_banner.outerHeight();
            } else {
                total_height = main_banner.outerHeight() +
                    footer.outerHeight() +
                    container_left.outerHeight() +
                    top_banner.outerHeight();
            }

            total_height += 35; // lets consider 15 as margin bottom !

            dishes_content.height(
                $(window).height() - total_height
            );
        }

        else {
            if (type == "desktop") {
                total_height = main_banner.outerHeight() +
                    footer.outerHeight();
            } else {
                total_height = main_banner.outerHeight() +
                    footer.outerHeight() +
                    container_left.outerHeight();
            }

            total_height += 35; // lets consider 35 as margin bottom !

            dish_details.height(
                $(window).height() - total_height
            );
        }
    }

    _this.updateDishesView = function (dishes) {
        if (dishes) {
            var dish_html = "";
            $.each(dishes, function (i, val) {
                dish_html += '<div class="responsive">' +
                    '<div class="dish_view" onclick="controller.build_dish_details(' + val.id + ')">' +
                    '<a class="dish_view_select">' +
                    '<img src="images/' + val.image + '" alt="' + val.name + '">' +
                    '</a>' +
                    '<div class="desc">' + val.name + '</div>' +
                    '</div>' +
                    '</div>';
            });
            dishes_content.html(dish_html);
        }
    }

    _this.updateSelectDishDetails = function () {

        var id = _this.model.getCurrentViewDish();
        var dish = _this.model.getDish(id);
        var totalGuests = _this.model.getNumberOfGuests();
        var price = 0;

        _this.d_label.html(dish.name);

        _this.d_img.attr("src", "images/" + dish.image);
        _this.d_desc.html(dish.description);
        _this.d_back.attr("href", id);

        _this.d_label_table.html(dish.name + " for: " + "<span>" + totalGuests + " people</span>");
        $("#ing_table tr").remove();
        jQuery.each(dish.ingredients, function (i, val) {
            price += (val.price * totalGuests);
            var ing_html = '<tr>' +
                '<th scope="row">' + val.name + '</th>' +
                '<td>' + (parseInt(val.quantity) * totalGuests) + '</td>' +
                '<td>' + val.unit + '</td>' +
                '<td>SEK ' + (val.price * totalGuests) + '</td>' +
                '</tr>';
            _this.ing_table.append(ing_html);
        });

        _this.add_menu.attr("href", id);
        _this.d_price.html(price);

        top_banner.fadeOut(400);
        dishes_content.fadeOut(400);
        dish_details.fadeIn(1000);
    }

    _this.backToDishesView = function () {
        dish_details.fadeOut(400);
        top_banner.fadeIn(500);
        dishes_content.fadeIn(1000);
    }

    _this.updateMenu = function () {
        var menu = _this.model.getMenu();
        if (menu) {
            $(".menu_table tbody tr").remove();
            jQuery.each(menu, function (i, val) {
                var menu_html = '<tr>' +
                    '<th scope="row" class="remove_dish" onclick="controller.removeDishFromMenu(' + val.id + ')">X</th>' +
                    '<td>' + val.name + '</td>' +
                    '<td>' + val.price + '</td>' +
                    '</tr>';
                $(".menu_table tbody").append(menu_html);
            });
            total_cost.html(_this.model.getTotalMenuPrice());
            total.html(_this.model.getTotalMenuPrice());

        }
    }
}
 
