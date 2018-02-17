/*
 * Coded by:
 * - Khaled Jendi
 * - Last update in 2018-02-17
 */

var DinnerView = function (container, model) {
    model.addObserver(this);

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
    _this.confirm_dinner = container.find(".confirm");
    _this.selected_dish_option = container.find(".select_dish option:selected");
    var container_right = container.find(".container_right");

    var main_banner = container.find(".main_banner");
    var footer = container.parents().find(".footer");
    var top_banner = container.find(".top_banner");
    var dishes_content = container.find(".dishes_content");
    var container_left = container.find(".container_left");
    var dish_details = container.find(".dish_details");
    var total_cost = container.find(".total_cost span");
    var total = container.find(".total");

    _this.update = function (obj) {
        _this.updateMainContentHeight = function () {
            var total_height = 0;
            var window_width = $(window).width();
            var window_height = $(window).height();

            var main_banner_height = main_banner.outerHeight();
            var footer_height = footer.outerHeight();
            var top_banner_height = top_banner.outerHeight();
            var container_left_height = container_left.outerHeight()

            if (dishes_content.is(":visible")) {
                if (window_width > 990) { // desktop
                    total_height = main_banner_height + footer_height + top_banner_height;
                } else {
                    total_height = main_banner_height + footer_height + top_banner_height + container_left_height;
                }

                total_height += 35; // lets consider 15 as margin bottom !
                dishes_content.height(window_height - total_height);
            }
            else {
                if (window_width > 990) { //desktop
                    total_height = main_banner.outerHeight() + footer_height;
                } else {
                    total_height = main_banner.outerHeight() + footer_height + container_left_height;
                }

                total_height += 35; // lets consider 35 as margin bottom !
                dish_details.height(window_height - total_height);
            }
        };

        var updateGustsView = function () {
            _this.numberOfGuests.val(_this.model.getNumberOfGuests());
        }

        var updateCurrentViewDishTable = function () {
            if (dish_details.is(":visible")) {

                var id = _this.model.getCurrentViewDish();
                if (!id) return;

                var dish = _this.model.getDish(id);
                var totalGuests = _this.model.getNumberOfGuests();
                var price = 0;

                _this.d_label_table.html(dish.name + " for: " + "<span>" + totalGuests + " people</span>");
                _this.ing_table.children('tbody').children('tr').remove();
                _.each(dish.ingredients, function (val, i) {
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

        var updateDishesView = function (dishes) {
            if (dishes) {
                var dish_html = "";
                _.each(dishes, function (val, i) {
                    var title = val.title.length > 40 ? val.title.substring(0, 45) + "..." : val.title;
                    dish_html += '<div class="responsive">' +
                        '<div class="dish_view" onclick="controller.build_dish_details(' + val.id + ')">' +
                        '<a class="dish_view_select">' +
                        '<img src="https://spoonacular.com/recipeImages/' + val.image + '" alt="' + val.title + '">' +
                        '</a>' +
                        '<div class="desc">' + title + '</div>' +
                        '</div>' +
                        '</div>';
                });
                dishes_content.html(dish_html);
            }
        }

        var updateSelectDishDetails = function (id) {

            var dish = _this.model.getDish(id);
            var totalGuests = _this.model.getNumberOfGuests();
            var price = 0;

            _this.d_label.html(dish.name);

            _this.d_img.attr("src", "images/" + dish.image);
            _this.d_desc.html(dish.description);
            _this.d_back.attr("href", id);

            _this.d_label_table.html(dish.name + " for: " + "<span>" + totalGuests + " people</span>");
            _this.ing_table.children('tbody').children('tr').remove();
            _.each(dish.ingredients, function (val, i) {
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
            dish_details.fadeIn(1000, function () {
                _this.updateMainContentHeight();
            });
        }
        var backToDishesView = function () {
            dish_details.fadeOut(400);
            top_banner.fadeIn(500);
            dishes_content.fadeIn(1000);
        }
        var updateDishPanel = function () {
            var id = _this.model.getCurrentViewDish();
            if (id) {
                updateSelectDishDetails(id);
            }
            else {
                backToDishesView();
            }
        }

        var updateMenu = function (mode) {
            var menu = _this.model.getMenu();
            if (menu) {
                _this.menu_table.children('tbody').children('tr').remove();
                _.each(menu, function (val, i) {
                    var menu_html = '<tr>' +
                        '<th scope="row" class="remove_dish" onclick="controller.removeDishFromMenu(' + val.id + ')">X</th>' +
                        '<td>' + val.name + '</td>' +
                        '<td>' + val.price + '</td>' +
                        '<td>' + val.numPeople + '</td>' +
                        '</tr>';
                    _this.menu_table.append(menu_html);
                });
                total_cost.html(_this.model.getTotalMenuPrice());
                total.html(_this.model.getTotalMenuPrice());

                //for mobile usage:
                if (obj && obj.menu_mode == "open_menu") {
                    if ($(window).width() < 970 && !_this.nav_menu_wrap.hasClass("active")) {
                        _this.nav_menu_wrap.toggleClass('active');
                    }
                }
            }
        }
        _this.blockUI = function (component, message) {
            container_right.block({
                message: "<div style=' font-size: 21px'><img src='images/loading.svg' > Loading...</div>",
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: 'rgba(111, 111, 111, 0.3)',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    'border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                }
            });
        };

        _this.getDishes = function (filter) {
            if (obj && obj.dishes_callback) {
                switch (obj.dishes_callback) {
                    case "init":
                        break;
                    case "ok":
                        var dishes = _this.model.getApiDishs();
                        updateDishesView(dishes);
                        container_right.unblock();
                        break;
                    default:
                        break;
                }
                obj = undefined;
            }
            else {
                if (obj && obj.acDishes_callback) return;
                var dishes = _this.model.getApiDishs();
                if (!dishes || dishes.length === 0) {
                    if (!filter)
                        filter = _this.search_txt.val();
                    var type = _this.select_dish.find(":selected").val();
                    _this.blockUI();
                    _this.model.getAllDishes(type, filter);
                }
                else {
                    updateDishesView(dishes);
                }
            }
        };

        _this.loadAcDishes = function () {
            if (obj && obj.acDishes_callback) {
                if(obj.acDishes_callback === "ok") {
                    obj = undefined;
                }
                return;
            }
            _this.model.loadAcDishes("");
        };



        updateGustsView();
        updateCurrentViewDishTable();
        updateDishPanel();
        updateMenu();

        _this.getDishes();
        _this.loadAcDishes();

        _this.search_txt.autocomplete({
            source: _this.model.getApiAcDishes(),
            select: function (e, ui) {

            }
        });
    }

    _this.update({dishes_callback: "init"});

}
 
