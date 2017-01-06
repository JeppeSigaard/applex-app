app.canGo = true;
app.goTo = function(pageID, mods, callback){if (app.canGo){app.canGo = false;
    
    
    var appScreens = $('.app-screens'),
        activeID = appScreens.attr('data-screen'),
        activePage = $('.screen.active'),
        newPage = $('#screen-'+pageID+''),
        afterAnim = function(timing){
            setTimeout(function(){
                activePage.removeClass('active').removeAttr('style');
                appScreens.attr('data-screen',pageID);
                newPage.addClass('active').removeAttr('style');
            },timing + 20);
            
            $(document).trigger('appNavigation', {
                screen : pageID,
            });
        },
        timing = 200;
    
    prevPage = app.getActiveScreen();
    
    if(pageID !== activeID && newPage.length && activePage.length){
        
        // Set timing
        if(typeof mods !== 'undefined' && typeof mods.timing !== 'undefined'){
            timing = mods.timing;
        }
        
        // Default animation
        if(typeof mods === 'undefined' || typeof mods.animation === 'undefined'){
            activePage.fadeOut(timing);
            newPage.css('left','0%').fadeIn(timing);
            afterAnim(timing);
        }
        
        
        // left
        else if(typeof mods !== 'undefined' && mods.animation === 'left'){
            activePage.css('left','0%').animate({left: '-100%'},timing);
            newPage.css('left','100%').animate({left: '0%'},timing);
            afterAnim(timing);
        }
        
        // right
        else if(typeof mods !== 'undefined' && mods.animation === 'right'){
            activePage.css('left','0%').animate({left: '100%'},timing);
            newPage.css('left','-100%').animate({left: '0%'},timing);
            afterAnim(timing);
        }
        
        // bottom
        else if(typeof mods !== 'undefined' && mods.animation === 'bottom'){
            activePage.css({top : '0%', left : '0%'}).animate({top: '100%'},timing);
            newPage.css({top : '-100%', left : '0%'}).animate({top: '0%'},timing);
            afterAnim(timing);
        }
        
        // top
        else if(typeof mods !== 'undefined' && mods.animation === 'top'){
            activePage.css({top : '0%', left : '0%'}).animate({top: '-100%'},timing);
            newPage.css({top : '100%', left : '0%'}).animate({top: '0%'},timing);
            afterAnim(timing);
        }
    }
    
    if(typeof mods !== 'undefined' && typeof mods.headerBtn !== 'undefined'){
        $('.header-btn').removeClass('menu back pause menu-close un-pause time un-time').addClass(mods.headerBtn);
    }
    
    if(typeof callback === 'function'){
        callback(activeID, pageID);
        
    }
    
    $(document).trigger('nav', {from : activeID, to : pageID, mods : mods, callback : callback});
                                                           
    setTimeout(function(){app.canGo = true;},timing);
}}
