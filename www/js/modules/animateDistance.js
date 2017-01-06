var ad_fact = 1, ad_ld = 0, ad_dir = 'up', resetAnimateDistance = function(){
    ad_fact = 1; ad_ld = 0; ad_dir = 'up';
};

var animateDistance = function(elem,value){
    
    var addDiff, animVal;
	  
	var diff = value - ad_ld;
	
    if(diff < 2 && diff > -2){
        ad_fact --;
    }
    
	else if(diff < 0){
		if(ad_dir === 'down'){ad_fact ++;}
		else if(ad_dir === 'up'){
			ad_fact --;
			if (ad_fact === 0){
				ad_dir = 'down';
			}
		}
	}

	else if (diff > 0){
		if(ad_dir === 'down'){ad_fact --;}
		else if(ad_dir === 'up'){
			ad_fact ++;
			if (ad_fact === 0){
				ad_dir = 'up';
			}
        }
	}

	if(ad_fact < 1){ad_fact = 1;}
	if(ad_fact > 10){ad_fact = 10;}

    addDiff = Math.floor(diff / 10 * ad_fact);
    animVal = ad_ld + addDiff;
	
	ad_ld = animVal;
    
    // how many decimal places allows
    var decimal_places = 1;
    var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);
    var prop = parseFloat(elem.html() * 10);

    elem.stop().prop('number', prop).animateNumber({
        easing: 'linear',
        number: animVal * decimal_factor,

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
    },750);
    
    console.log(ad_ld,ad_fact,ad_dir);
    ad_ld = animVal;
}