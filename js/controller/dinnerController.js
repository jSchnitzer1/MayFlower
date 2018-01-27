/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
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
        _this.view.container.fadeIn(500);
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
    });

    _this.view.nav_menu_toggle.add(_this.view.nav_menu_close).on('click', function() {
        _this.view.nav_menu_wrap.toggleClass('active');
    });

    $(window).resize(function() {
        if($(window).width() > 990) {
            if (_this.view.nav_menu_wrap.hasClass("active")) {
                _this.view.nav_menu_wrap.toggleClass('active');
            }
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
            switch(parseInt($(this).val())){
                case 0:
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames());
                    break;
                case 1: // starter
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames('starter'));
                    break;
                case 2: // main dish
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames('main dish'));
                    break;
                case 3:
                    _this.view.search_txt.autocomplete('option', 'source', _this.model.getDishesNames('dessert'));
                    break;
            }
        });
    });

    _this.view.search_txt.autocomplete({
        source: model.getDishesNames()
    });

    _this.init = function () {
        _this.load();
    }
}