/*
 * Coded by:
 * - Khaled Jendi
 * - Last update in 2018-02-17
 */

var DinnerModel = function () {

    var totalGuests = 1;
    var menu = [];
    var currentViewDish;
    var apiDishes = [];
    var apiAcDishes = [];
    var _this = this;
    var key = "Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB";

    //For better understanding of design pattern: https://sourcemaking.com/design_patterns/observer
    var observers = [];

    this.addObserver = function (observer) {
        observers.push(observer);
    }

    this.notifyObservers = function (obj) {
        _.each(observers, function (val, i) {
            val.update(obj);
        });
    }

    this.getApiDishs = function () {
        return apiDishes;
    }

    this.getApiAcDishes = function () {
        return apiAcDishes;
    }

    this.setCurrentViewDish = function (id) {
        currentViewDish = id;
        this.notifyObservers();
    }

    this.getCurrentViewDish = function () {
        return currentViewDish;
    }

    this.getMenu = function () {
        return menu;
    }

    this.setNumberOfGuests = function (num, sign) {
        if (num && parseInt(num)) {
            if (sign === 'plus') {

                if (num < 10) {
                    num = num + 1;
                }
                else {
                    num = 10;
                }
                totalGuests = num;
                this.notifyObservers();
                return true;
            }
            else {

                if (num > 1) {
                    num = num - 1;
                }
                else {
                    num = 1;
                }
                totalGuests = num;
                this.notifyObservers();
                return true;
            }
            return false;
        }

        return false;

    }

    this.getNumberOfGuests = function () {
        return totalGuests;
    }

    //Returns the dish that is on the menu for selected type
    this.getSelectedDish = function (type) {

    }

    //Returns all the dishes on the menu.
    this.getFullMenu = function () {
        return menu;
    }

    //Returns all ingredients for all the dishes on the menu.
    this.getAllIngredients = function () {
        var ingredients = [];
        _.each(menu, function (val, i) {
            _.each(val.ingredients, function (val, i) {
                if (ingredients.indexOf(val.name) == -1) { // not in the array (prevent duplicates!!)
                    ingredients.push(val);
                }
            });
        });
        return ingredients;
    }

    //Returns the total price of the menu (all the ingredients multiplied by number of guests).
    this.getTotalMenuPrice = function () {
        if (menu) {
            var total = 0;
            _.each(menu, function (val, i) {
                total += val.price;
            });
            return total;
        }
    }

    //Adds the passed dish to the menu. If the dish of that type already exists on the menu
    //it is removed from the menu and the new one added.
    this.addDishToMenu = function (id) {
        var dish = this.getDish(id);
        var price = 0;

        _.each(dish.ingredients, function (val, i) {
            price += (val.price * totalGuests);
        });

        menu.push({
            "id": id,
            "name": dish.name,
            "price": price,
            "numPeople": totalGuests
        });
        this.notifyObservers({menu_mode: "open_menu"});
    }

    //Removes dish from menu
    this.removeDishFromMenu = function (id) {
        menu = jQuery.grep(menu, function (e) {
            return (e.id != id);
        });
        this.notifyObservers();
    }


    //modify
    this.getAllDishes = function (type, filter, callback, errorCallback) {
        $.ajax({
            url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?type=" + type,
            headers: {
                'X-Mashape-Key': key
            },
            success: function (data) {
                if (filter) {
                    apiDishes = [];
                    _.each(data.results, function (val, i) {
                        if (val.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
                            apiDishes.push(val);
                        }
                    });
                    _this.notifyObservers({dishes_callback: "ok"});
                } else {
                    apiDishes = data.results;
                    _this.notifyObservers({dishes_callback: "ok"});
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.message);
            }
        });
    }


    this.loadAcDishes = function (type) {
        $.ajax({
            url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?type=" + type,
            headers: {
                'X-Mashape-Key': key
            },
            success: function (data) {
                apiAcDishes = [];
                _.each(data.results, function (val, i) {
                    apiAcDishes.push(
                        {"key": val.id, "value": val.title}
                    );
                });
                _this.notifyObservers({acDishes_callback: "ok"});
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.message);
            }
        });
    };





    //modify
    this.getDish = function (id) {
        return;
        for (key in dishes) {
            if (dishes[key].id == id) {
                return dishes[key];
            }
        }
    }

    //modify
    this.getDishesNames = function (type) {
        //apiAcDishes
        return;
        var result = [];
        if (!type || 0 === type.length) {
            _.each(dishes, function (val, i) {
                if (result.indexOf(val.name) == -1) { // not in the array (prevent duplicates!!)
                    result.push(val.name);
                }
                _.each(val.ingredients, function (val, i) {
                    if (result.indexOf(val.name) == -1) { // not in the array (prevent duplicates!!)
                        result.push(val.name);
                    }
                });
            });
            return result;
        }
        else {
            _.each(dishes, function (val, i) {
                if (val.type == type) {
                    if (result.indexOf(val.name) == -1) { // not in the array (prevent duplicates!!)
                        result.push(val.name);
                    }
                    _.each(val.ingredients, function (val, i) {
                        if (result.indexOf(val.name) == -1) { // not in the array (prevent duplicates!!)
                            result.push(val.name);
                        }
                    });
                }
            });
            return result;
        }
    }


}
