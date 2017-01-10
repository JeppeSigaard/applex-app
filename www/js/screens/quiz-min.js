var quizTimer,quiz={id:!1,obj:!1,admissionID:!1,admission:{},n:function(e){return e>9?""+e:"0"+e},getTime:function(e){var i=Date.parse(new Date)-e,a=Math.floor(i/1e3%60),t=Math.floor(i/1e3/60%60),s=Math.floor(i/36e5%24),n=Math.floor(i/864e5);return{total:quiz.n(i),days:quiz.n(n),hours:quiz.n(s),minutes:quiz.n(t),seconds:quiz.n(a)}},ajaxPost:function(e,i){e.action="app-post",$.ajax({url:ajaxURL,type:"POST",data:e,dataType:"json",success:function(e){"function"==typeof i&&i(e)}})},getFromKey:function(e){var i=$(".quiz-check-key"),a=$('input[name="quiz-key"]');quiz.id=!1;for(var t in data.quiz)if(data.quiz.hasOwnProperty(t)){var s=data.quiz[t].code;s==e.toLowerCase()&&(quiz.obj=data.quiz[t],quiz.id=quiz.obj.id)}quiz.id?app.goTo(31,{animation:"left"}):(i.addClass("error").val("Prøv igen"),a.focus().on("input",function(){i.hasClass("error")&&(i.removeClass("error").val("Lås op"),a.off("input"))}))},generateListItem:function(e,i,a){var t=$('<div class="quiz-list-item" id="quiz-item-'+i+'"></div>'),s=$('<div class="item-type-icon"></div>'),n=$('<div class="item-title">'+e.name+"</div>"),o=$('<div class="item-status"><i class="status-done">√</i></div>');if("text"===e.type&&s.append('<svg viewBox="0 0 50 33.738"><use xlink:href="#icon-text"></use></svg>'),"choice"===e.type&&s.append('<svg viewBox="0 0 50 50"><use xlink:href="#icon-spg"></use></svg>'),"image"===e.type&&s.append('<svg viewBox="0 0 50 40"><use xlink:href="#icon-image"></use></svg>'),"video"===e.type&&s.append('<svg viewBox="0 0 50 34.219"><use xlink:href="#icon-video"></use></svg>'),"0"==e.beacon?o.append('<svg class="status-right" viewBox="0 0 20 20"><use xlink:href="#icon-right"></use></svg>'):(t.addClass("has-beacon"),o.append('<svg class="status-beacon" viewBox="0 0 47.625 47.625"><use xlink:href="#gfx-blip"></use></svg>')),a){var r=$('<div class="find-item"></div>');return r.append(s,n),r}return t.append(s,n,o),t},generateTaskList:function(e){var i=$(".screen-quiz-list");i.empty();for(var a=0;a<e.tasks.length;a++)i.append(quiz.generateListItem(e.tasks[a],a))},generateBeaconState:function(e,i){var a=$("#screen-33"),t=a.find(".bottom-box");t.html(quiz.generateListItem(e,"",!0)),quiz.generateSingle(e,i);var s=!1,n=!1,o=4;for(var r in data.beacons)if(data.beacons.hasOwnProperty(r)){var d=data.beacons[r];d.id==e.beacon&&(s=d.lat,n=d.long,o=d.range)}s&&n||setTimeout(function(){app.goTo("34",{animation:"left"})},500);var l=5;quizTimer=setInterval(function(){navigator.geolocation.getCurrentPosition(function(e){var i=e.coords.latitude,a=e.coords.longitude,t=Math.floor(1e4*app.geo.distanceTo(s,n,i,a))/10;if(parseFloat(t)>parseFloat(o)||l>0){var r=Math.floor(10*(t-o))/10;r>1e6&&(r="?"),r<=0&&(r="0.1"),animateDistance($(".screen-quiz-explore .meters span"),r),l--}else animateDistance($(".screen-quiz-explore .meters span"),"0.0"),clearInterval(quizTimer),setTimeout(function(){app.goTo("34",{animation:"left"})},200)},app.geo.error,{enableHighAccuracy:!0})},1500),$(".header-btn").on("touchstart",function(){clearInterval(quizTimer),resetAnimateDistance()})},generateSingle:function(e,i){var a=$("#screen-34"),t=$('<article data-type="'+e.type+'" id="article-'+i+'"></article>'),s=$('<div class="single-header"><span>'+e.name+"</span></div>"),n=$('<div class="single-body"><p>'+e.description+"</p></div>"),o=$('<div class="response"></div>');if("text"===e.type){s.prepend('<svg viewBox="0 0 50 33.738"><use xlink:href="#icon-text"</svg>');var r=$('<textarea class="item-resp-text" name="item-resp-text" placeholder="'+e.description+'" rows="6"></textarea>'),d=$('<input type="submit" name="submit-task" class="submit-task" value="Send svar"/>');o.append(r,d)}if("choice"===e.type){s.prepend('<svg viewBox="0 0 50 50"><use xlink:href="#icon-spg"</svg>');for(var l=$('<div class="choice-list"></div>'),u=0;u<e.answer.length;u++){var c=$('<div class="choice"><input type="radio" id="choice-'+u+'" name="item-resp-choice" value="'+e.answer[u]+'"/><label for="choice-'+u+'">'+e.answer[u]+"</label></div>");c.appendTo(l)}var d=$('<input type="submit" name="submit-task" class="submit-task" value="Send svar"/>');o.append(l,d)}if("image"===e.type){s.prepend('<svg viewBox="0 0 50 40"><use xlink:href="#icon-image"</svg>');for(var p=$('<div class="upload-container"></div>'),u=0;u<e.image_count;u++){var v=$('<div class="upload"><input type="file" id="file-'+u+'" /><label for="file-'+u+'"></label><div class="upload-status"></div></div>');p.append(v)}var d=$('<input type="submit" name="submit-task" class="submit-task" value="Send billeder" accept="image/*"/>');o.append(p,d)}if("video"===e.type){s.prepend('<svg viewBox="0 0 50 34.219"><use xlink:href="#icon-video"</svg>');var v=$('<div class="upload-container"><div class="upload-video"><input type="file" name="video-file" id="video-file" accept="video/mp4,video/x-m4v,video/*" ><label for="video-file" class="video-upload-label"></label><div class="upload-status"></div></div></div>'),d=$('<div class="fake-submit-task">Send film</div>');o.append(v,d)}t.append(s,n,o),a.html(t),setTimeout(function(){a.find("article").addClass("ready")},500)},completeTask:function(e,i){if(d=new Date,"text"===e.type){var a=$(".item-resp-text").val();if(""===a)return;$("#screen-34 .submit-task").addClass("hold").val("Sender"),quiz.admission[i]={type:"text",content:a,time:Math.floor(d.getTime()/1e3)}}if("choice"===e.type){var t=$('input[name="item-resp-choice"]:checked').val();if("undefined"==typeof t)return;$("#screen-34 .submit-task").addClass("hold").val("Sender"),quiz.admission[i]={type:"choice",content:t,time:Math.floor(d.getTime()/1e3)}}if("image"===e.type){var s={},n=!0;if($("#screen-34 .upload-container .upload").each(function(e){if($(this).hasClass("has-image")){var i=$(this).attr("data-img");s[e]=i}else n=!1}),!n)return;quiz.admission[i]={type:"image",content:s,time:Math.floor(d.getTime()/1e3)}}if("video"===e.type){var o=$('input[name="item-resp-video"]').val();quiz.admission[i]={type:"video",content:o,time:Math.floor(d.getTime()/1e3)}}quiz.admissionID&&quiz.ajaxPost({do:"taskEdit",id:quiz.admissionID,key:"data",value:quiz.admission},function(){$("#screen-32").find("#quiz-item-"+i).addClass("complete"),app.goTo(32,{animation:"right",headerBtn:"time"});var e=parseInt($("#screen-80 .tasks-completed .done").html());e++,$("#screen-80 .tasks-completed .done").html(e);var a=quiz.obj.tasks.length;e>=a&&(clearInterval(quizTimer),$(".celebrate-time").html($("#screen-80 .time").html()),setTimeout(function(){app.goTo(35,{animation:"top",headerBtn:"back"})},500))})},initiateQuiz:function(e){var i=$(".quiz-start"),a=$('input[name="quiz-name"]');quiz.id&&!i.hasClass("hold")&&(i.addClass("hold").val("Starter quiz"),quiz.ajaxPost({do:"taskInit",id:quiz.id,name:e},function(e){i.removeClass("hold").val("Start quiz"),quiz.admissionID=e.id,$("#screen-80 .time").html("00:00");var a=Date.parse(new Date),t=quiz.obj.tasks.length;quizTimer=setInterval(function(){var e=quiz.getTime(a);$("#screen-80 .time").html(e.minutes+":"+e.seconds)},1e3),$("#screen-80 .total").html(t),quiz.generateTaskList(quiz.obj),app.goTo(32,{animation:"left",headerBtn:"time"})}))}};$(document).on("nav",function(e,i){"31"!==i.from&&"32"!==i.from||(cordova.plugins.Keyboard.close(),cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0))});