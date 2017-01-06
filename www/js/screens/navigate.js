var navigationByObj = function(t){
    
    // Navigate to explore
    if(t.is('.nav-to-explore, .nav-to-explore *')){
        app.goTo(20,{animation: 'left', headerBtn : 'back'});
        data.fetchOvelse(); // Silently fetch ovelse
    };
    
    // Navigate to quiz
    if(t.is('.nav-to-quiz, .nav-to-quiz *')){
        data.fetchQuiz(); // Silently fetch quizzes
        app.goTo(30,{animation: 'left', headerBtn : 'back'});
        
        // Reset quiz fields
        $('#screen-30 input[type="text"]').val('');
        $('#screen-31 input[type="text"]').val('');
        $('#screen-80 .tasks-completed .done').html(0);
    };
    
    // Make single explorer article
    if(t.is('.screen-explore-list .list-item, .screen-explore-list .list-item *')){
        var postId = null;
        
        if(t.is('.list-item')){
            postId = t.attr('id'); 
        }
        
        else {
            postId = t.parents('.list-item').attr('id'); 
        }
        
        if(typeof postId !== 'undefined'){
            renderExplorerSingle(postId.replace('post-',''));
        }
    };
    
    // Make single quiz item
    if(t.is('.quiz-list-item')){
        var itemID = t.attr('id').replace('quiz-item-','');    
        var item = $(this);
        
        
        if(t.hasClass('complete')){}
        
        else if(t.is('.has-beacon')){
            quiz.generateBeaconState(quiz.obj.tasks[itemID], itemID);
            app.goTo(33,{animation: 'left', headerBtn : 'back'});
        }
        
        else{
            quiz.generateSingle(quiz.obj.tasks[itemID], itemID);
            app.goTo(34,{animation: 'left', headerBtn : 'back'});
        }
    };
    
    
    // Quiz Input buttons
    if(t.is('.quiz-check-key, .quiz-check-key *')){
        var key = $('input[name="quiz-key"]').val();
        quiz.getFromKey(key);
    };
    
    if(t.is('.quiz-start, .quiz-start *')){
        var key = $('input[name="quiz-name"]').val();
        if('' === key){return;}
        quiz.initiateQuiz(key);
    };
    
    if(t.is('.submit-task')){
        var screen = $('#screen-34'),
            itemKey = screen.find('article').attr('id').replace('article-',''),
            item = quiz.obj.tasks[itemKey];
        
        quiz.completeTask(item, itemKey);
    };
    
    if(t.is('.screen-time .close-btn')){
        if(!t.is('.certain')){
            t.addClass('certain').html('Er du sikker? (tryk igen)');
        }
        
        else{
        
        if(typeof quizTimer !== 'undefined'){
            clearInterval(quizTimer);
        }
        
            app.goTo(10,{animation: 'right', headerBtn : 'menu'});
            
        }
    };
}


var touched = false;
$(document).on('touchstart',function(e){
    if(!touched){
        touched = true;
        navigationByObj($(e.target));
        setTimeout(function(){
            touched = false;
        },200);
    }
});