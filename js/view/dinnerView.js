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

                var dish = _this.model.getCurrentViewDish();
                if (!dish) return;

                var totalGuests = _this.model.getNumberOfGuests();

                _this.d_label_table.html(dish.title + " for: " + "<span>" + totalGuests + " people</span>");
                _this.ing_table.children('tbody').children('tr').remove();
                _.each(dish.extendedIngredients, function (val, i) {
                    var ing_html = '<tr>' +
                        '<th scope="row">' + val.name + '</th>' +
                        '<td>' + (parseInt(val.amount) * totalGuests) + '</td>' +
                        '<td>' + val.unit + '</td>' +
                        '</tr>';
                    _this.ing_table.append(ing_html);
                });

                var price = Math.round(dish.pricePerServing * totalGuests);
                var type = (dish.dishTypes && dish.dishTypes.length > 0) ? dish.dishTypes[0] : "";
                var score = Math.round(dish.spoonacularScore / 25);
                var instructions = (dish.instructions && dish.instructions.length > 0) ? dish.instructions : "";
                _this.add_menu.data("selected_dish", {
                    "id": dish.id,
                    "title": dish.title,
                    "people": totalGuests,
                    "total": price,
                    "image": dish.image,
                    "type": type,
                    "score": score,
                    "cookingtime": dish.cookingMinutes,
                    "instructions": instructions
                });
                _this.d_price.html(price);
            }
        }

        var updateDishesView = function (dishes) {
            if (dishes) {
                var dish_html = "";
                _.each(dishes, function (val, i) {
                    var title = val.title.length > 45 ? val.title.substring(0, 44) + "..." : val.title;
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

        var updateSelectDishDetails = function (dish) {

            var totalGuests = _this.model.getNumberOfGuests();
            var price = 0;
            //var title = dish.title.length > 35 ? dish.title.substring(0, 34) + "..." : val.title;

            _this.d_label.html(dish.title);

            _this.d_img.attr("src", dish.image);
            _this.d_desc.html(dish.instructions);
            _this.d_back.attr("href", dish.id);

            _this.d_label_table.html(dish.title + " for: " + "<span>" + totalGuests + " people</span>");
            _this.ing_table.children('tbody').children('tr').remove();
            _.each(dish.extendedIngredients, function (val, i) {
                var ing_html = '<tr>' +
                    '<th scope="row">' + val.name + '</th>' +
                    '<td>' + (parseInt(val.amount) * totalGuests) + '</td>' +
                    '<td>' + val.unit + '</td>' +
                    '</tr>';
                _this.ing_table.append(ing_html);
            });

            var price = Math.round(dish.pricePerServing * totalGuests);
            var type = (dish.dishTypes && dish.dishTypes.length > 0) ? dish.dishTypes[0] : "";
            var score = Math.round(dish.spoonacularScore / 25);
            var instructions = (dish.instructions && dish.instructions.length > 0) ? dish.instructions : "";
            _this.add_menu.data("selected_dish", {
                "id": dish.id,
                "title": dish.title,
                "people": totalGuests,
                "total": price,
                "image": dish.image,
                "type": type,
                "score": score,
                "cookingtime": dish.cookingMinutes,
                "instructions": instructions
            });
            _this.d_price.html(price);

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
            var currentViewDish = _this.model.getCurrentViewDish();
            if (currentViewDish) {
                updateSelectDishDetails(currentViewDish);
            }
            else {
                backToDishesView();
            }
        }

        var updateMenu = function (mode) {
            var menu = _this.model.getMenu();
            if (menu ) {
                 _this.menu_table.children('tbody').children('tr').remove();
                _.each(menu, function (val, i) {
                    var menu_html = '<tr>' +
                        '<td scope="row" class="remove_dish" onclick="controller.removeDishFromMenu(' + val.id + ')">X</td>' +
                        '<td>' + val.title + '</td>' +
                        '<td>' + val.price + '</td>' +
                        '<td>' + val.people + '</td>' +
                        '</tr>';
                    _this.menu_table.append(menu_html);
                });


                var menu_table_cells = _this.menu_table.find('tbody tr:first').children();

                var colWidth = menu_table_cells.map(function () {
                    var w = $(this).width();
                    return w;
                }).get();

                _this.menu_table.find('thead tr').children().each(function (i, v) {
                    $(v).width(colWidth[i]);
                });

                /*

                var container_right_height = container_right.height();

                if(_this.menu_table.find('tbody').height() > (container_right_height - 100)/2)
                    _this.menu_table.find('tbody').height(((container_right_height - 100)/2));

                */


                var total_price = _this.model.getTotalMenuPrice();

                total_cost.html(total_price);
                total.html(total_price);

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
            if (_this.model.getCurrentViewDish()) return;
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
            if (_this.model.getCurrentViewDish()) return;
            if (obj && obj.acDishes_callback) {
                if (obj.acDishes_callback === "ok") {
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
 
