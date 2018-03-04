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
    _this.dish_view_type = container.find("#dish_view_type");
    _this.dish_view_txt = container.find("#dish_view_txt");
    _this.dishes_content = container.find(".dishes_content");
    _this.dishes_content_album = container.find(".dishes_content_album");

    var container_right = container.find(".container_right");
    var main_banner = container.find(".main_banner");
    var footer = container.parents().find(".footer");
    var top_banner = container.find(".top_banner");

    var container_left = container.find(".container_left");
    var dish_details = container.find(".dish_details");
    var total_cost = container.find(".total_cost span");
    var total = container.find(".total");
    var dishes_content_block_overlay = container.find("#dishes_content_block_overlay");

    _this.update = function (obj) {

        _this.updateMainContentHeight = function () {
            var total_height = 0;
            var window_width = $(window).width();
            var window_height = $(window).height();

            var main_banner_height = main_banner.outerHeight();
            var footer_height = footer.outerHeight();
            var top_banner_height = top_banner.outerHeight();
            var container_left_height = container_left.outerHeight()

            if (dish_details.is(":visible")) {
                if (window_width > 990) { //desktop
                    total_height = main_banner.outerHeight() + footer_height;
                } else {
                    total_height = main_banner.outerHeight() + footer_height + container_left_height;
                }

                total_height += 35; // lets consider 35 as margin bottom !
                dish_details.height(window_height - total_height);
                return;
            }

            if (window_width > 990) { // desktop
                total_height = main_banner_height + footer_height + top_banner_height;
            } else {
                total_height = main_banner_height + footer_height + top_banner_height + container_left_height;
            }
            total_height += 35; // lets consider 15 as margin bottom !

            if(_this.dish_view_type.is(':checked')){
                _this.dishes_content_album.height(window_height - total_height);
            } else {

                _this.dishes_content.height(window_height - total_height);
            }
        };

        var updateNumberOfGusts = function () {
            _this.numberOfGuests.val(_this.model.getNumberOfGuests());
        }
        var updateCurrentViewDishIngredients = function () {
            //This function is just to update the ingredients when they need to be changed based on the number of people!
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
                var carousel_body = '<div id="playList3" style="display: none;">' +
                    '<div data-cat="Category one">';
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

                    var content_width = $(window).width() < 380 ? 230 : 330;
                    carousel_body += '<ul>' +
                        '<li data-url="none" ></li>' +
                        '<li data-html-content="">' +
                        '<div class="thumbDiv" style="height:100%;">' +
                        '<img style="width: '+content_width+'px; height: 230px;object-fit: cover;" src="https://spoonacular.com/recipeImages/' + val.image + '" alt="' + val.title + '">' +
                        '<p class="thumbP" style="position: absolute; top:0px; width:'+content_width+'px; background-color:rgba(128,128,128, 0.7); padding: 10px">' +
                        '<a style="cursor: pointer;" onclick="controller.build_dish_details(' + val.id + ')">' + title + '</a>' +
                        '</p>' +
                        '</div>' +
                        '</li>' +
                        '</ul>';
                });
                _this.dishes_content.html(dish_html);

                carousel_body += '</div>' +
                    '</div>';


                document.getElementById("some_content").innerHTML += carousel_body;

                if (carousel) {
                    carousel.destroy();
                }
                carousel_fn();

            }
        }

        RLR3DUtils.onReady(function () {
            carousel_fn();
        })

        var carousel_fn = function () {
            var carousel_width = $(window).width() < 380 ? 250 : 350;
            carousel = new Royal3DCarousel({
                //required settings
                carouselHolderDivId: "dishes_content_album",
                carouselDataListDivId: "playList3",
                displayType: "responsive",
                autoScale: "yes",
                carouselWidth: 1840,
                carouselHeight: 350,
                mainFolderPath: "css",
                skinPath: "carousel",
                fluidWidthZIndex: 100,

                //main settings
                backgroundColor: "",
                // backgroundImagePath: "css/carousel/main_skin/background.jpg",
                // thumbnailsBackgroundImagePath: "css/carousel/main_skin/thumbnailsBackground.jpg",
                // scrollbarBackgroundImagePath: "css/carousel/main_skin/scrollbarBackground.jpg",
                backgroundRepeat: "repeat-x",
                showDisplay2DAlways: "no",
                carouselStartPosition: "center",
                numberOfThumbnailsToDisplayLeftAndRight: 4,
                slideshowDelay: 5000,
                autoplay: "no",
                showPrevButton: "yes",
                showNextButton: "yes",
                showSlideshowButton: "yes",
                disableNextAndPrevButtonsOnMobile: "no",
                controlsHeight: 31,
                controlsMaxWidth: 940,
                slideshowTimerColor: "#777777",
                rightClickContextMenu: "default",
                addKeyboardSupport: "yes",
                useDragAndSwipe: "yes",

                //thumbnail settings
                thumbnailWidth: carousel_width,
                thumbnailHeight: 250,
                thumbnailSpaceOffset3D: 70,
                thumbnailSpaceOffset2D: 70,
                thumbnailBorderSize: 10,
                thumbnailBackgroundColor: "#666666",
                thumbnailBorderColor1: "#fcfdfd",
                thumbnailBorderColor2: "#e4e4e4",
                transparentImages: "no",
                maxNumberOfThumbnailsOnMobile: 13,
                showThumbnailsGradient: "yes",
                showThumbnailsHtmlContent: "yes",
                textBackgroundColor: "#333333",
                textBackgroundOpacity: .7,
                showText: "no",
                showTextBackgroundImage: "yes",
                showThumbnailBoxShadow: "yes",
                thumbnailBoxShadowCss: "0px 2px 2px #555555",
                showReflection: "yes",
                reflectionHeight: 60,
                reflectionDistance: 0,
                reflectionOpacity: .2,

                //scrollbar settings
                showScrollbar: "no",
                disableScrollbarOnMobile: "yes",
                enableMouseWheelScroll: "yes",
                scrollbarHandlerWidth: 300,
                scrollbarTextColorNormal: "#777777",
                scrollbarTextColorSelected: "#000000",

                //combobox settings
                showComboBox: "no",
                startAtCategory: 1,
                selectLabel: "SELECT CATEGORIES",
                allCategoriesLabel: "All Categories",
                showAllCategories: "no",
                comboBoxPosition: "topright",
                selectorBackgroundNormalColor1: "#fcfdfd",
                selectorBackgroundNormalColor2: "#e4e4e4",
                selectorBackgroundSelectedColor1: "#a7a7a7",
                selectorBackgroundSelectedColor2: "#8e8e8e",
                selectorTextNormalColor: "#8b8b8b",
                selectorTextSelectedColor: "#FFFFFF",
                buttonBackgroundNormalColor1: "#e7e7e7",
                buttonBackgroundNormalColor2: "#e7e7e7",
                buttonBackgroundSelectedColor1: "#a7a7a7",
                buttonBackgroundSelectedColor2: "#8e8e8e",
                buttonTextNormalColor: "#000000",
                buttonTextSelectedColor: "#FFFFFF",
                comboBoxShadowColor: "#000000",
                comboBoxHorizontalMargins: 12,
                comboBoxVerticalMargins: 12,
                comboBoxCornerRadius: 0,

                //bullets navigation settings
                showBulletsNavigation: "no",
                bulletsBackgroundNormalColor1: "#fcfdfd",
                bulletsBackgroundNormalColor2: "#e4e4e4",
                bulletsBackgroundSelectedColor1: "#000000",
                bulletsBackgroundSelectedColor2: "#666666",
                bulletsShadow: "0px 0px 4px #888888",
                bulletsNormalRadius: 7,
                bulletsSelectedRadius: 8,
                spaceBetweenBullets: 15,
                bulletsOffset: 14,

                //lightbox settings
                buttonsAlignment: "in",
                itemBoxShadow: "none",
                descriptionWindowAnimationType: "opacity",
                descriptionWindowPosition: "bottom",
                slideShowAutoPlay: "no",
                addKeyboardSupport: "yes",
                showCloseButton: "yes",
                showShareButton: "yes",
                showZoomButton: "yes",
                showSlideShowButton: "yes",
                showSlideShowAnimation: "yes",
                showNextAndPrevButtons: "yes",
                showNextAndPrevButtonsOnMobile: "yes",
                showDescriptionButton: "yes",
                showDescriptionByDefault: "no",
                videoShowFullScreenButton: "yes",
                videoAutoPlay: "no",
                nextVideoOrAudioAutoPlay: "yes",
                videoLoop: "no",
                audioAutoPlay: "no",
                audioLoop: "no",
                backgroundOpacity: .9,
                descriptionWindowBackgroundOpacity: .95,
                buttonsHideDelay: 3,
                slideShowDelay: 4,
                defaultItemWidth: 640,
                defaultItemHeight: 480,
                itemOffsetHeight: 50,
                spaceBetweenButtons: 1,
                buttonsOffsetIn: 2,
                buttonsOffsetOut: 5,
                itemBorderSize: 5,
                itemBorderRadius: 0,
                itemBackgroundColor: "#333333",
                itemBorderColor1: "#fcfdfd",
                itemBorderColor2: "#e4e4e4",
                lightBoxBackgroundColor: "#000000",
                descriptionWindowBackgroundColor: "#FFFFFF",
                videoPosterBackgroundColor: "#0099FF",
                videoControllerBackgroundColor: "#FFFFFF",
                audioControllerBackgroundColor: "#FFFFFF",
                timeColor: "#000000"
            });

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

            _this.unblockUI();

            top_banner.fadeOut(400);

            if(_this.dish_view_type.is(':checked')){
                _this.dishes_content_album.animate({ opacity: 0 }, 500, function () {
                    dish_details.fadeIn(500, function () {
                        _this.updateMainContentHeight();
                    });
                })
            } else {
                _this.dishes_content.fadeOut(400);
                dish_details.fadeIn(1000, function () {
                    _this.updateMainContentHeight();
                });
            }
        }
        var backToDishesView = function () {
            dish_details.fadeOut(400);
            top_banner.fadeIn(500);

            if(_this.dish_view_type.is(':checked')){
                _this.dishes_content_album.animate({ opacity: 1 });
            } else {
                _this.dishes_content.fadeIn(1000);
            }
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
            if (menu) {
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
                if (obj && obj.menuMode == "open_menu") {
                    if ($(window).width() < 970 && !_this.nav_menu_wrap.hasClass("active")) {
                        _this.nav_menu_wrap.toggleClass('active');
                    }
                }
            }
        }
        _this.blockUI = function () {
            var controlToBeBlocked = _this.dish_view_type.is(':checked') ? _this.dishes_content_album : dishes_content_block_overlay;
            controlToBeBlocked.block({
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
        _this.unblockUI = function () {
            var controlToBeUnblocked = _this.dish_view_type.is(':checked') ? _this.dishes_content_album : dishes_content_block_overlay;
            controlToBeUnblocked.unblock();
        }
        _this.glowMessage = function (header, message, classType) {
            (function ($) {
                $(function () {
                    $.jGrowl(message, {
                        header: header,
                        life: 5000,
                        theme: classType,
                        speed: 'slow',
                        animateOpen: {
                            height: "show",
                            width: "show"
                        },
                        animateClose: {
                            height: "hide",
                            width: "show"
                        }
                    });
                });
            })(jQuery);
        }

        _this.getDishes = function (filter) {
            if (obj && obj.dishes_callback) {
                switch (obj.dishes_callback) {
                    case "init":
                        break;
                    case "ok":
                        var dishes = _this.model.getApiDishs();
                        updateDishesView(dishes);
                        _this.unblockUI();
                        break;
                    default:
                        break;
                }
            }
            else {
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
            if (obj && obj.acDishes_callback) {
                if (obj.acDishes_callback === "ok") {
                    _this.search_txt.autocomplete('option', 'source', _this.model.getApiAcDishes());
                    obj = undefined;
                }
                return;
            }
            _this.model.loadAcDishes("");
        };

        if (obj) {
            switch (obj.type) {
                case 'numberOfGuestsUpdated':
                    updateNumberOfGusts();
                    updateCurrentViewDishIngredients();
                    break;
                case 'currentViewDishUpdated':
                    updateDishPanel();
                    break;
                case 'menuUpdated':
                    updateMenu();
                    break;
                case 'apiDishesUpdated':
                    _this.getDishes();
                    break;
                case 'apiAcDishesUpdated':
                    _this.loadAcDishes();
                    break;
                case 'allUpdated':
                    updateNumberOfGusts();
                    _this.loadAcDishes();
                    _this.search_txt.autocomplete({
                        source: [],
                        select: function (e, ui) {
                        }
                    });
                    break;
                case 'jsonError':
                    _this.unblockUI();
                    if (obj.error)
                        _this.glowMessage("API Error", obj.error, 'error');
                    break;
            }
        }
    }

    _this.update({type: "allUpdated"});

}
 
