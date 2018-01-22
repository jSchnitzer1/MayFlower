$(function() {
	//We instantiate our model
	var model = new DinnerModel();
	
	// And create the instance of ExampleView
	var dinnerView = new DinnerView($('.dinner_view'));

	$('#vide_container').vide({
        mp4: "video/rst1.mp4",
        poster: "detect"
    });

    $('.heading').addClass('hanimate');
    $('.subheading').addClass('sanimate');
    $('.reserve').addClass('ranimate');

    $('.nav-menu-toggle, .nav-menu .close').on('click', function() {
        $('.nav-menu-wrap').toggleClass('active');
    });

    $(window).resize(function() {
        if($(window).width() > 990) {
            if ($(".nav-menu-wrap").hasClass("active")) {
                $('.nav-menu-wrap').toggleClass('active');
            }
        }
    });



	/**
	 * IMPORTANT: app.js is the only place where you are allowed to
	 * use the $('someSelector') to search for elements in the whole HTML.
	 * In other places you should limit the search only to the children 
	 * of the specific view you're working with (see exampleView.js).
	 */

});