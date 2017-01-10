var animateDistance = function(elem,value){
    var decimal_places = 1;
    var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);
    var prop = parseFloat(elem.html() * 10);

    elem.stop().prop('number', prop).animateNumber({
        easing: 'linear',
        number: value * decimal_factor,

        numberStep: function(now, tween) {
            var floored_number = Math.floor(now) / decimal_factor,
                target = $(tween.elem);

            if (decimal_places > 0) {
                // force decimal places even if they are 0
                floored_number = floored_number.toFixed(decimal_places);

                // replace '.' separator with ','
                floored_number = floored_number.toString();
            }

            target.text(floored_number);
        }
    },1000);
}
