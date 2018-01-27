/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */

function loadScreen() {
    var url = location.hash.slice(1);
    switch (url) {
        case "home_dinner":
            view = new DinnerView($("#dinner_panel"), model);
            controller = new DinnerController(view, model);
            controller.init();
            break;
        default:
            view = new IndexView($("#index_panel"), model);
            controller = new IndexController(view, model);
            controller.init();
            break;
    }
}


$(window).on('hashchange', function () {
    loadScreen();
});

$(window).on('load', function () {
    loadScreen();
});
