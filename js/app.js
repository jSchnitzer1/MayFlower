/*
 * Coded by:
 * - Khaled Jendi
 * - Camilla Björn
 * - Last update in 2018-01-26
 */

$(function() {
    // view, model, controller are defined as global variables (see index.html)

    // load main video background (this is general everywhere, loaded once and for all)
    $('#general_view').vide({
        mp4: "video/rst1.mp4",
        poster: "detect"
    });

    // load dinner model: loaded once and for all!
    model = new DinnerModel();

});