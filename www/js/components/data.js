var data = {
    beacons : {},
    quiz : {},
    ovelse : {},
    
    fetchPosts : function(endpoint, data, callback){
        $.ajax({
            url : apiURL + endpoint,
            type : 'GET',
            data : data,
            dataType : 'json',
            success : function(response){
                
                if(typeof callback === 'function'){
                    callback(response);
                }
            },
        });
    },
    
    fetchBeacons : function(callback){
        
        data.fetchPosts('/beacon/?per_page=100', '', function(response){
           if(!response.error){
                for(var i = 0; i < response.length; i++){
                    data.beacons[i] = response[i];
                };
            }

            if(typeof callback === 'function'){
                callback(data.beacons);
            }  
        });
    },
    
    fetchQuiz : function(callback){
        data.fetchPosts('/quiz/?per_page=100', '', function(response){
           
            if(!response.error){
                for(var i = 0; i < response.length; i++){
                    data.quiz[i] = response[i];
                }
            }

            if(typeof callback === 'function'){
                callback(data.quiz);
            }  
        });
    },
    
    fetchOvelse : function(callback){
        data.fetchPosts('/ovelse/?per_page=100', '', function(response){
           
            if(!response.error){
                for(var i = 0; i < response.length; i++){
                    data.ovelse[i] = response[i];
                }
            }

            if(typeof callback === 'function'){
                callback(data.ovelse);
            }  
        });
    }
};

