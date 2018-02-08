/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */

var ScreenLoader = function() {
    var loadScreen = function() {
        var url = location.hash.slice(1);
        switch (url) {
            case "home_dinner":
                hideCurrent();
                view = new DinnerView($("#dinner_panel"), model);
                controller = new DinnerController(view, model);
                controller.init();
                break;
            case "menu":
                hideCurrent();
                view = new MenuView($("#menu_panel"), model);
                controller = new MenuController(view, model);
                controller.init();
                break;
            default:
                hideCurrent();
                view = new IndexView($("#index_panel"), model);
                controller = new IndexController(view, model);
                controller.init();
                break;
        }
    }
    var hideCurrent = function() {
        var main = $('#main');
        main.children('div').each(function () {
            if($(this).is(":visible")) {
                $(this).stop().animate({
                    width: "0px",
                    height: "0px",
                    opacity: "0"
                }, 400, function() {$(this).hide()});
                return false;
            }
        });
    }

    $(window).on('hashchange', function () {
        loadScreen();
    });
    $(window).on('load', function () {
        loadScreen();
    });
}

