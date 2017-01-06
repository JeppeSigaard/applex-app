var keyboard = function(){
    $(document).on('nav',function(e,data){
    
        if(data.to === '30' || data.to === '31'){
            cordova.plugins.Keyboard.disableScroll(true);
            cordova.plugins.Keyboard.show();  
        }
    
        else{
            cordova.plugins.Keyboard.close();   
        }    
    });
    
    
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e){
        $('body').addClass('keyboard-open');
    }
    
    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e){
        $('body').removeClass('keyboard-open');
    }
};