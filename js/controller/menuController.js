/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */


var MenuController = function (view, model) {
    var _this = this;

    _this.model = model;
    _this.view = view;

    _this.load = function () {
        var subLoad = function () {
            _this.view.updateMenu();
            _this.view.updateMainContentHeight();
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

    $(window).resize(function() {
        _this.view.updateMainContentHeight();
    });

    _this.view.menu_print_btn.on("click", function (e) {
        e.preventDefault();
        _this.view.buildPrintMenu();
    })

    _this.view.print_menu_table.on("click", function () {
        var newWin = window.open("");
        newWin.document.write(_this.view.menu_modal_table.html());
        newWin.print();
        newWin.close();
    });

    _this.init = function () {
        _this.load();
    }

}