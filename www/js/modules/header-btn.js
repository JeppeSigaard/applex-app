app.headerBtn = function(){
    var btn = $('.header-btn');

    // Åben menu
    if(btn.hasClass('menu')){
        
        btn.removeClass('menu').addClass('menu-close');
        app.goTo(90,{ animation: 'bottom', timing: 300 });
    }

    // Luk menu
    else if(btn.hasClass('menu-close')){
        app.goTo(10, { animation: 'top', timing: 300});
        btn.removeClass('menu-close').addClass('menu');
    }

    // Tilbage
    else if(btn.hasClass('back')){
        
        var current = app.getActiveScreen(),
            currentScreen = $('#screen-'+current+''),
            parent = currentScreen.attr('data-parent');
        
        if(10 == parent || typeof parent === 'undefined'){
            app.goTo(10, { animation: 'right'});
            btn.removeClass('back').addClass('menu');
        }
        
        else if(32 == parent){
            app.goTo(32, { animation: 'right'});
            btn.removeClass('back').addClass('time');
            if (typeof quizTimer !== 'undefined'){
                clearInterval(quizTimer);
            }
        }
        
        else{
            app.goTo(parent, { animation: 'right'});
        }
    }
    
    // Pause
    else if(btn.hasClass('pause')){
        btn.removeClass('pause').addClass('un-pause');
    }
    
    // Un-pause
    else if(btn.hasClass('un-pause')){
        btn.removeClass('un-pause').addClass('pause');
    }
    
    // time
    else if(btn.hasClass('time')){
        btn.removeClass('time').addClass('un-time');
        app.goTo(80, {animation : 'left'});
        $('.screen-time .close-btn').removeClass('certain').html('Afslut quiz');
    }
    
    // un-time
    else if(btn.hasClass('un-time')){
        btn.removeClass('un-time').addClass('time');
        app.goTo(32, {animation : 'right'});
        $('.screen-time .close-btn').removeClass('certain').html('Afslut quiz');
    }
    
}

var canHeaderBtn = true;
$(document).on('touchstart', '.header-btn', function(e){
    if(canHeaderBtn){
        canHeaderBtn = false;
        
        app.headerBtn();
        
        setTimeout(function(){
            canHeaderBtn = true;
        },350);
    }
});