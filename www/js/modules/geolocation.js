app.geo = {
    
    log : function(msg){
        if($('.geo-data').length){
            $('.geo-data').html(JSON.stringify(msg) + '<br/>'); 
        }
    },
    
    distanceTo : function(lat1, lon1, lat2 , lon2){
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km  
    },
    
    update : function(pos){
        app.geo.log(pos);
    },
    
    error : function(error){
        app.geo.log(error);
    },
}