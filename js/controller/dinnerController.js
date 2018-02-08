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

        var subLoad = function () {
            _this.controlNavMenuEvents();
            _this.controllPlusMinusEvents();
            _this.view.updateGustsView();
            if ($(window).width() < 990) {
                _this.view.updateMainContentHeight("mobile");
            } else {
                _this.view.updateMainContentHeight("desktop");
            }
            _this.view.updateMenu();
        };

        if( _this.view.container.width() == 0) {
            _this.view.container.stop().animate({
                width: "100%",
                height: "100%",
                opacity: "1"
            }, 500, function() {
                $(this).show();
                subLoad.call(this);
            });

        } else {
            _this.view.container.fadeIn(500, function () {
                subLoad.call(this);
            });
        }
    }

    
    _this.controlNavMenuEvents = function () {
        var nav_menu_events = $._data(_this.view.nav_menu_toggle[0], "events" );

        var bind = function () {
            _this.view.nav_menu_toggle.add(_this.view.nav_menu_close).on('click', function () {
                _this.view.nav_menu_wrap.toggleClass('active');
            });
        };

        var unbind = function () {
            _this.view.nav_menu_toggle.off('click');
            _this.view.nav_menu_close.off('click');
        };

        if(nav_menu_events) {
            var click_events_count = nav_menu_events.click.length;
            if(click_events_count == 0) {
                bind();
            }
            else if(nav_menu_events > 1) {
                unbind(); // remove all current events
                bind(); // engage only one event
            }
        }
        else {
            bind();
        }
    }

    _this.controllPlusMinusEvents = function() {
        var plus_button_events = $._data(_this.view.plusButton[0], "events" );
        var minus_button_events = $._data(_this.view.minusButton[0], "events" );

        var bind = function () {
            _this.view.plusButton.on('click', function () {
                var value = parseInt(_this.model.getNumberOfGuests());

                if(value > 10) return;

                if(_this.model.setNumberOfGuests(value, 'plus')) {
                    _this.view.updateGustsView();
                    _this.view.updateCurrentViewDishTable();
                }
            });
            _this.view.minusButton.on('click', function () {
                var value = parseInt(_this.model.getNumberOfGuests());

                if(value < 0) return;

                if(_this.model.setNumberOfGuests(value, 'minus')) {
                    _this.view.updateGustsView();
                    _this.view.updateCurrentViewDishTable();
                }
            });
        };

        var unbind = function () {
            _this.view.plusButton.off('click');
            _this.view.minusButton.off('click');
        };

        if(plus_button_events) {
            var click_events_count = plus_button_events.click.length;
            if(click_events_count == 0) {
                bind();
            }
            else if(plus_button_events > 1) {
                unbind();
                bind();
            }
        }
        else {
            bind();
        }
    }

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
        _.each(_this.model.getMenu(), function (val, i) {
            if(val.id == id){
                inMenu = true;
                return false;
            }
        });
        if(!inMenu) {
            _this.model.addDishToMenu(id);
            _this.view.updateMenu("open_menu");
        }
    })
    
    _this.removeDishFromMenu = function (id) {
        _this.model.removeDishFromMenu(id);
        _this.model.getMenu();
        _this.view.updateMenu();
    }

    _this.view.confirm_dinner.on("click", function (e) {
        e.preventDefault();
        var menu = _this.model.getMenu();
        if(menu && menu.length > 0) {
            window.location.hash = "#menu";
        }
        else {
            alert("Your menu is empty!")
        }
    })

    _this.init = function () {
        _this.load();
    }
}