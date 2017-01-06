var prevPage = app.getActiveScreen();
var apiURL = 'http://atletikeksperimentariet.dk/wp-json/wp/v2';
var ajaxURL = 'http://atletikeksperimentariet.dk/wp-admin/admin-ajax.php';


app.runStartupEvents = function(){
    data.fetchBeacons(function(beacons){
        
        // Go to start page
        keyboard();
        app.goTo(10); 
        
    });
};


/* ------------------------------------------- */
// LESGO!
    
app.initialize();
// For browser testing, nmvd lol >:-)
// app.fakeInit(50);
