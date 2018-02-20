/*
 * Coded by:
 * - Khaled Jendi
 * - Last update in 2018-02-19
 */


var DinnerController = function (view, model) {
    var _this = this;

    _this.model = model;
    _this.view = view;

    _this.load = function () {

        var subLoad = function () {
            _this.controlNavMenuEvents();
            _this.controllPlusMinusEvents();
            _this.controllConfirmEvents();
            _this.view.dish_view_type.attr('checked', false);
            _this.controllDishViewTypeEvents();

            _this.view.updateMainContentHeight();
            _this.view.getDishes();



        };

        if (_this.view.container.width() == 0) {
            _this.view.container.stop().animate({
                width: "100%",
                height: "100%",
                opacity: "1"
            }, 500, function () {
                $(this).show();
                subLoad.call(this);
            });

        } else {
            _this.view.container.fadeIn(500, function () {
                subLoad.call(this);
            });
        }
    }

    _this.controllDishViewTypeEvents = function () {
        var dish_view_type_events = $._data(_this.view.dish_view_type[0], "events");

        var bind = function () {
            _this.view.dish_view_type.on('click', function () {
                if(this.checked){
                    //carousel
                    _this.view.dishes_content.css('display', 'none');
                    _this.view.dishes_content_album.fadeTo(250, 0.9);
                    _this.view.dish_view_txt.html('Album View');
                }
                else {
                    //tabular
                    _this.view.dishes_content_album.css('opacity', '0');
                    _this.view.dishes_content.fadeTo(250, 0.9);
                    _this.view.dish_view_txt.html('Tabular View');
                }
                _this.view.updateMainContentHeight();
            });
        };
        var unbind = function () {
            _this.view.dish_view_type.off('click');
        };

        if (dish_view_type_events) {
            var click_events_count = dish_view_type_events.click.length;
            if (click_events_count == 0) {
                bind();
            }
            else if (click_events_count > 1) {
                unbind();
                bind();
            }
        }
        else {
            bind();
        }
    }

    _this.controllConfirmEvents = function () {
        var confirm_btn_events = $._data(_this.view.confirm_dinner[0], "events");

        var bind = function () {
            _this.view.confirm_dinner.on("click", function (e) {
                e.preventDefault();
                var menu = _this.model.getMenu();
                if (menu && menu.length > 0) {
                    window.location.hash = "#menu";
                }
                else {
                    _this.view.glowMessage("<span style='font-size: 15px'>Menu Notification</span>", "Please add dishes before confirming!", "error");
                }
            });
        };
        var unbind = function () {
            _this.view.confirm_dinner.off('click');
        };

        if (confirm_btn_events) {
            var click_events_count = confirm_btn_events.click.length;
            if (click_events_count == 0) {
                bind();
            }
            else if (click_events_count > 1) {
                unbind();
                bind();
            }
        }
        else {
            bind();
        }
    }

    _this.controlNavMenuEvents = function () {
        var nav_menu_events = $._data(_this.view.nav_menu_toggle[0], "events");

        var bind = function () {
            _this.view.nav_menu_toggle.add(_this.view.nav_menu_close).on('click', function () {
                _this.view.nav_menu_wrap.toggleClass('active');
            });
        };

        var unbind = function () {
            _this.view.nav_menu_toggle.off('click');
            _this.view.nav_menu_close.off('click');
        };

        if (nav_menu_events) {
            var click_events_count = nav_menu_events.click.length;
            if (click_events_count == 0) {
                bind();
            }
            else if (click_events_count > 1) {
                unbind(); // remove all current events
                bind(); // engage only one event
            }
        }
        else {
            bind();
        }
    }

    _this.controllPlusMinusEvents = function () {
        var plus_button_events = $._data(_this.view.plusButton[0], "events");

        var bind = function () {
            _this.view.plusButton.on('click', function () {
                var value = parseInt(_this.model.getNumberOfGuests());
                _this.model.setNumberOfGuests(value, 'plus');
            });
            _this.view.minusButton.on('click', function () {
                var value = parseInt(_this.model.getNumberOfGuests());
                _this.model.setNumberOfGuests(value, 'minus');
            });
        };
        var unbind = function () {
            _this.view.plusButton.off('click');
            _this.view.minusButton.off('click');
        };

        if (plus_button_events) {
            var click_events_count = plus_button_events.click.length;
            if (click_events_count == 0) {
                bind();
            }
            else if (click_events_count > 1) {
                unbind();
                bind();
            }
        }
        else {
            bind();
        }
    }

    $(window).resize(function () {
        if ($(window).width() > 990) {
            if (_this.view.nav_menu_wrap.hasClass("active")) {
                _this.view.nav_menu_wrap.toggleClass('active');
            }
        }
        _this.view.updateMainContentHeight();

    }).resize();

    _this.view.select_dish.focus(function () {
        _this.view.select_dish_label.toggleClass('changed');
    });

    _this.view.select_dish.focusout(function () {
        _this.view.select_dish_label.toggleClass('changed');
    });

    _this.view.select_dish.change(function () {
        var val = _this.view.select_dish.val();
        _this.model.loadAcDishes(val);
    });

    _this.view.btn_search.on("click", function (e) {
        e.preventDefault();
        var filter = _this.view.search_txt.val();
        var type = _this.view.select_dish.find(":selected").val();
        _this.view.blockUI();
        _this.model.getAllDishes(type, filter);
    });

    _this.build_dish_details = function (id) {
        _this.view.blockUI();
        _this.model.setCurrentViewDish(id);
        return false; // same as preventDefaults()
    }

    _this.view.d_back.on("click", function (e) {
        e.preventDefault();
        _this.model.setCurrentViewDish(undefined);
    });

    _this.view.add_menu.on("click", function (e) {
        e.preventDefault();
        var dish = $(this).data("selected_dish");

        if (!dish) return;

        var inMenu = false;
        _.each(_this.model.getMenu(), function (val, i) {
            if (val.id == dish.id) {
                inMenu = true;
                return false;
            }
        });
        if (!inMenu) {
            _this.model.addDishToMenu(dish);
        }
    })

    _this.removeDishFromMenu = function (id) {
        _this.model.removeDishFromMenu(id);
    }

    _this.init = function () {
        _this.load();
    }
}