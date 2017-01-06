var quizTimer,
    quiz = {
    id : false,
    obj : false,
    admissionID : false,
    admission : {},
    
    n : function(n){ return n > 9 ? "" + n: "0" + n; },
    getTime : function(starttime){
        var t = Date.parse(new Date()) - starttime;
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': quiz.n(t),
            'days': quiz.n(days),
            'hours': quiz.n(hours),
            'minutes': quiz.n(minutes),
            'seconds': quiz.n(seconds)
        }
    },
    
    ajaxPost : function(vars,callback){
        
        vars.action = 'app-post';
        
        $.ajax({
            url : ajaxURL,
            type : 'POST',
            data : vars,
            dataType : 'json',
            success : function(response){

                if(typeof callback === 'function'){
                    callback(response);
                }
            },
        });    
    },

    getFromKey : function(key){
        
        var btn = $('.quiz-check-key'),
            field = $('input[name="quiz-key"]');
        
        quiz.id = false;
        
        for (var prop in data.quiz) {
            if( data.quiz.hasOwnProperty( prop ) ) {
                
                var code = data.quiz[prop].code;
                
                if(code == key.toLowerCase()){
                    quiz.obj = data.quiz[prop];
                    quiz.id = quiz.obj.id;
                }
            }
        };
        
        if(quiz.id){
            app.goTo(31,{ animation : 'left'});
        }
        
        else{
            btn.addClass('error').val('Prøv igen');
            field.focus().on('input',function(){
                if(btn.hasClass('error')){
                    btn.removeClass('error').val('Lås op');
                    field.off('input');
                }
            });
        }
    },
    
    generateListItem : function(item, itemKey, forBeacon){
        var i = $('<div class="quiz-list-item" id="quiz-item-'+itemKey+'"></div>'),
            icon = $('<div class="item-type-icon"></div>'),
            title = $('<div class="item-title">'+item.name+'</div>'),
            status = $('<div class="item-status"><i class="status-done">√</i></div>');
        
        // Icon
        if('text' === item.type){
            icon.append('<svg viewBox="0 0 50 33.738"><use xlink:href="#icon-text"></use></svg>');
        }
        
        if('choice' === item.type){
            icon.append('<svg viewBox="0 0 50 50"><use xlink:href="#icon-spg"></use></svg>');
        }
        
        if('image' === item.type){
            icon.append('<svg viewBox="0 0 50 40"><use xlink:href="#icon-image"></use></svg>');
        }
        
        if('video' === item.type){
            icon.append('<svg viewBox="0 0 50 34.219"><use xlink:href="#icon-video"></use></svg>');
        }
        
        // beacon
        if('0' == item.beacon){
           status.append('<svg class="status-right" viewBox="0 0 20 20"><use xlink:href="#icon-right"></use></svg>'); 
        }
        else{
            i.addClass('has-beacon');
            status.append('<svg class="status-beacon" viewBox="0 0 47.625 47.625"><use xlink:href="#gfx-blip"></use></svg>');
        }
        
        if(forBeacon){
            var bc = $('<div class="find-item"></div>');
            bc.append(icon,title);
            return bc;
        }
        else{
            i.append(icon,title,status);
            return(i);    
        }
    },
    
    generateTaskList : function(obj){
        
        var screen = $('.screen-quiz-list');
        
        screen.empty();
        
        for (var i = 0; i < obj.tasks.length; i++) { 
            screen.append(quiz.generateListItem(obj.tasks[i], i));
        }
        
        
    },
    
    generateBeaconState : function(item, itemKey){
        var screen = $('#screen-33'),
            container = screen.find('.bottom-box');  
        
        container.html(quiz.generateListItem(item, '', true));
        quiz.generateSingle(item,itemKey);
        
        // Fetch beacon data
        var lat = false, long = false, range = 4;
        for (var prop in data.beacons) {
            if( data.beacons.hasOwnProperty( prop ) ) {
                var b = data.beacons[prop];
                
                if (b.id == item.beacon){
                    lat = b.lat;  
                    long = b.long;  
                    range = b.range;   
                }
            }
        };
        
        // on error, conitnue
        if(!lat || !long){
            setTimeout(function(){
                app.goTo('34',{animation : 'left'}); 
            },500);
        }
        
        var timerBuffer = 5;
        
        quizTimer = setInterval(function(){
            navigator.geolocation.getCurrentPosition(function(location){
                var plat = location.coords.latitude,
                    plong = location.coords.longitude,
                    bDist = Math.floor(app.geo.distanceTo(lat,long,plat,plong) * 10000) / 10;
                
                
                if(parseFloat(bDist) > parseFloat(range) || timerBuffer > 0){
                    
                    var shownDistance = Math.floor((bDist - range) * 10) / 10;
                    
                    if(shownDistance > 1000000){
                        shownDistance = '?';
                    }
                    
                    if(shownDistance < 0){
                        shownDistance = '0.1';
                    }

                    animateDistance($('.screen-quiz-explore .meters span'), shownDistance);
                    timerBuffer --;
                }

                else{
                    animateDistance($('.screen-quiz-explore .meters span'), '0.0');
                    clearInterval(locationInterval);
                    setTimeout(function(){
                        app.goTo('34',{animation : 'left'}); 
                    },200);
                }
                
            }, app.geo.error, {enableHighAccuracy : true});  
        },700);
        
        // Kill interval on headerbutton
        $('.header-btn').on('touchstart',function(){
            clearInterval(quizTimer);
            resetAnimateDistance();
        });
        
    },
    
    generateSingle : function(item, itemKey){
        var screen = $('#screen-34'),
            i = $('<article data-type="'+item.type+'" id="article-'+itemKey+'"></article>'),
            header = $('<div class="single-header"><span>'+item.name+'</span></div>'),
            body = $('<div class="single-body"><p>'+item.description+'</p></div>'),
            resp = $('<div class="response"></div>');
        
        if('text' === item.type){
            header.prepend('<svg viewBox="0 0 50 33.738"><use xlink:href="#icon-text"</svg>');
            
            var textarea = $('<textarea class="item-resp-text" name="item-resp-text" placeholder="'+item.description+'" rows="6"></textarea>'),
                button = $('<input type="submit" name="submit-task" class="submit-task" value="Send svar"/>');
            
            resp.append(textarea,button);
        }
        
        if('choice' === item.type){
            header.prepend('<svg viewBox="0 0 50 50"><use xlink:href="#icon-spg"</svg>');
            
            var choiceList = $('<div class="choice-list"></div>');
            
            for (var x = 0; x < item.answer.length; x++) { 
                
                var choice = $('<div class="choice"><input type="radio" id="choice-'+x+'" name="item-resp-choice" value="'+item.answer[x]+'"/><label for="choice-'+x+'">'+item.answer[x]+'</label></div>');
                choice.appendTo(choiceList);
            }
            
            var button = $('<input type="submit" name="submit-task" class="submit-task" value="Send svar"/>');
            resp.append(choiceList,button);
        }
        
        if('image' === item.type){            
            header.prepend('<svg viewBox="0 0 50 40"><use xlink:href="#icon-image"</svg>');
            
            var image_upload = $('<div class="upload-container"></div>');
            for (var x = 0; x < item.image_count; x++){
                var upload = $('<div class="upload"><input type="file" id="file-'+x+'" /><label for="file-'+x+'"></label><div class="upload-status"></div></div>');
                image_upload.append(upload);
            }
            
            var button = $('<input type="submit" name="submit-task" class="submit-task" value="Send billeder" accept="image/*"/>');
            
            resp.append(image_upload, button);
        }
        
        if('video' === item.type){
            header.prepend('<svg viewBox="0 0 50 34.219"><use xlink:href="#icon-video"</svg>');
            
            var upload = $('<div class="upload-container"><div class="upload-video"><input type="file" name="video-file" id="video-file" accept="video/mp4,video/x-m4v,video/*" ><label for="video-file" class="video-upload-label"></label><div class="upload-status"></div></div></div>');
            
            var button = $('<div class="fake-submit-task">Send film</div>');
            
            resp.append(upload,button);
        }
        
        i.append(header,body,resp);
        screen.html(i);
        
        setTimeout(function(){
            screen.find('article').addClass('ready');
        },500);
    },
    
    completeTask : function(item, itemKey){
        d = new Date();
        
        if('text' === item.type){
            var textData = $('.item-resp-text').val();
            if('' === textData){return;}
            
            $('#screen-34 .submit-task').addClass('hold').val('Sender');
            
            quiz.admission[itemKey] = {
                type : 'text',
                content : textData,
                time : Math.floor(d.getTime() / 1000),
            }
        }
        
        if('choice' === item.type){
            var choiceData = $('input[name="item-resp-choice"]:checked').val();
            if('undefined' == typeof choiceData){return;}
            
            $('#screen-34 .submit-task').addClass('hold').val('Sender');
            
            quiz.admission[itemKey] = {
                type : 'choice',
                content : choiceData,
                time : Math.floor(d.getTime() / 1000),
            }
            
        }
        
        if('image' === item.type){
            
            var imageData = {},
                rdy = true;
            
            $('#screen-34 .upload-container .upload').each(function(i){
                
                if($(this).hasClass('has-image')){
                    var imgID = $(this).attr('data-img');
                    imageData[i] = imgID; 
                }
                
                else {
                    rdy = false;
                }
                
            });
            
            if(!rdy){return;}
            
            quiz.admission[itemKey] = {
                type : 'image',
                content : imageData,
                time : Math.floor(d.getTime() / 1000),
            }
            
        }
        
        if ('video' === item.type){
            var videoData = $('input[name="item-resp-video"]').val();
            
            quiz.admission[itemKey] = {
                type : 'video',
                content : videoData,
                time : Math.floor(d.getTime() / 1000),
            }
        }
        
        if(quiz.admissionID){

            quiz.ajaxPost({
                do : 'taskEdit',
                id : quiz.admissionID,
                key : 'data',
                value : quiz.admission,
            },function(){
                
                
                // When all is done, return
                $('#screen-32').find('#quiz-item-'+itemKey).addClass('complete');
                app.goTo(32, {animation: 'right', headerBtn : 'time'});
                
                var comp = parseInt($('#screen-80 .tasks-completed .done').html());
                comp ++;
                $('#screen-80 .tasks-completed .done').html(comp);
                
                var total = quiz.obj.tasks.length;
                
                if(comp >= total){
                    clearInterval(quizTimer);
                    $('.celebrate-time').html($('#screen-80 .time').html());
                    setTimeout(function(){
                        app.goTo(35, {animation: 'top', headerBtn : 'back'});
                        
                    },500);  
                }
            });
        }
    },
    
    initiateQuiz : function(key){
        var btn = $('.quiz-start'),
            field = $('input[name="quiz-name"]');
        
        if(quiz.id && !btn.hasClass('hold')){
            btn.addClass('hold').val('Starter quiz');
            
            
            // Send besvarer
            quiz.ajaxPost({do: 'taskInit', id : quiz.id, name : key},function(r){
                btn.removeClass('hold').val('Start quiz');
                quiz.admissionID = r.id;
                
                //Indstil timer
                $('#screen-80 .time').html('00:00');
                var start = Date.parse(new Date()),
                    tasksTotal = quiz.obj.tasks.length;
                    quizTimer = setInterval(function(){
                        var time = quiz.getTime(start); 
                        $('#screen-80 .time').html(time.minutes + ':' + time.seconds);
                    },1000);
                
                // Indstil total
                $('#screen-80 .total').html(tasksTotal);

                
                // Opret liste af opgaver
                quiz.generateTaskList(quiz.obj);
                
                // Gå til oversigt
                app.goTo(32,{ animation : 'left', headerBtn : 'time' }); 
            });
        }
    },
};

$(document).on('nav',function(e,d){
    if(d.from === '31' || d.from === '32'){
        cordova.plugins.Keyboard.close();
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);   
    }
});