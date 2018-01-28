/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-27
 */


var DinnerController = function (view, model) {
    var _this = this;

    _this.model = model;
    _this.view = view;

    _this.load = function () {
        _this.view.container.parent().children('div').each(function () {
            if($(this).is(":visible")) {
                $(this).stop().animate({
                    width: "0px",
                    height: "0px",
                    opacity: "0"
                }, 400, function() {$(this).hide()});
                return false;
            }
        });
        _this.view.container.fadeIn(500, function () {
            _this.view.updateGustsView();
            if($(window).width() < 990) {
                _this.view.updateMainContentHeight("mobile");
            } else {
                _this.view.updateMainContentHeight("desktop");
            }

        });
    }

    _this.view.plusButton.on('click', function () {
        var value = parseInt(_this.model.getNumberOfGuests());

        if (value < 10) {
            value = value + 1;
        }
        else {
            value = 10;
        }

        _this.model.setNumberOfGuests(value);
        _this.view.updateGustsView();
        _this.view.updateCurrentViewDishTable();
    });

    _this.view.minusButton.on('click', function () {
        var value = parseInt(_this.model.getNumberOfGuests());

        if (value > 1) {
            value = value - 1;
        }
        else {
            value = 1;
        }

        _this.model.setNumberOfGuests(value);
        _this.view.updateGustsView();
        _this.view.updateCurrentViewDishTable();
    });

    _this.view.nav_menu_toggle.add(_this.view.nav_menu_close).on('click', function() {
        _this.view.nav_menu_wrap.toggleClass('active');
    });

    $(window).resize(function() {
        if($(window).width() > 990) {
            if (_this.view.nav_menu_wrap.hasClass("active")) {
                _this.view.nav_menu_wrap.toggleClass('active');
            }
            _this.view.updateMainContentHeight("desktop");
        }
        else {
            _this.view.updateMainContentHeight("mobile");
        }
    });

    _this.view.select_dish.focus(function () {
        _this.view.select_dish_label.toggleClass('changed');
    });

    _this.view.select_dish.focusout(function () {
        _this.view.select_dish_label.toggleClass('changed');
    });

    _this.view.select_dish.change(function () {
        var $selected = _this.view.container.find(".select_dish option:selected");
        $selected.each(function () {
            switch($(this).val()){
                case "0":
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames());
                    break;
                case "starter":
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames('starter'));
                    break;
                case "main dish":
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames('main dish'));
                    break;
                case "dessert":
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames('dessert'));
                    break;
            }
        });
    });

    _this.view.btn_search.on("click", function (e) {
        e.preventDefault();
        getDishes();
    });

    var getDishes = function (filter) {
        if(!filter)
            filter = _this.view.search_txt.val();
        var type = _this.view.select_dish.find(":selected").val();
        var dishes = _this.model.getAllDishes(type, filter);
        _this.view.updateDishesView(dishes);
    };

    _this.view.search_txt.autocomplete({
        source: model.getDishesNames(),
        select: function (e, ui) {
            getDishes(ui.item.value);
        }
    });

    _this.build_dish_details = function (id) {
        _this.model.setCurrentViewDish(id);
        _this.view.updateSelectDishDetails();
        return false; // same as preventDefaults()
    }

    _this.view.d_back.on("click", function (e) {
        e.preventDefault();
        _this.view.backToDishesView();
    });
    
    _this.view.add_menu.on("click", function (e) {
        e.preventDefault();
        var id = $(this).attr("href");
        var inMenu = false;
        jQuery.each(_this.model.getMenu(), function (i, val) {
            if(val.id == id){
                inMenu = true;
                return false;
            }
        });
        if(!inMenu) {
            _this.model.addDishToMenu(id);
            _this.view.updateMenu();
        }
    })
    
    _this.removeDishFromMenu = function (id) {
        _this.model.removeDishFromMenu(id);
        _this.model.getMenu();
        _this.view.updateMenu();
    }

    _this.init = function () {
        _this.load();
    }
}