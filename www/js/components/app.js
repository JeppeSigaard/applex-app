var app = {
    
    log : function(message){
        if (typeof message === 'object'){
            message = JSON.stringify(message);
        }
        
        if($('.debug').length){
            $('.debug').prepend( message + '<br/> <br/>');
        }
    },
    
    initialize: function() { document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);},

    fakeInit: function(timeout){

        
        setTimeout(function(){
            app.runStartupEvents();
        },timeout);
    },
    
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        app.runStartupEvents();
    },
    
    receivedEvent: function(id) {
        app.log('received event for: ' + id);
    },
    
    getActiveScreen: function(){
        return $('.app-screens').attr('data-screen');
    },
};