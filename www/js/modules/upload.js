var YT_GetAccessToken = function(clientID, clientSecret, refreshToken, callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        if (typeof callback === "function") {
            callback( clientID, clientSecret, JSON.parse( xhr.response ).access_token );
        }
    });

    xhr.open( 'POST', 'https://www.googleapis.com/oauth2/v4/token' );
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var request = "client_id=" + clientID + "&client_secret=" + clientSecret + "&refresh_token=" + refreshToken + "&grant_type=refresh_token";
    xhr.send(request);

}

var YT_UploadVideo = function(file, clientID, clientSecret, accesstoken, params) {
    if ( file != undefined ) {
        var uploadStartTime;
        var callback, progress, error, meta;
        if (typeof params === "object") {
            callback = params.callback || "noop";
            progress = params.progress || "noop";
            error = params.error || "noop";
            meta = params.meta ||
            {
                "snippet": {
                    "title": 'Atlex video',
                    "description": 'Atlex',
                    "tags": ["test"],
                    "categoryId": 22,
                },
                "status": {
                    "privacyStatus": 'unlisted',
                },
            }
        }

        // Creates object used to upload file
        var uploader = new MediaUploader({
            "baseUrl": 'https://www.googleapis.com/upload/youtube/v3/videos',
            "file": file,
            "token": accesstoken,
            "metadata": meta,
            "params": {
                "part": 'snippet,status',
            },

            // Error message
            onError: function() {
                if (typeof error === "function") {
                    error();
                }
            },

            // Loading "bar"
            onProgress: function(data) {
                var timePassed = (new Date()).getTime() - uploadStartTime;
                if (typeof progress === "function") {
                    progress(data, timePassed);
                }
            },

            // Upload complete message
            onComplete: function(data) {
                var videoID = JSON.parse( data ).id;
                if(typeof callback === 'function'){
                    callback(videoID);
                }
            },
        });

        // Uploads file
        uploadStartTime = (new Date()).getTime();
        uploader.upload();
    }
}

var uploadVideo = function() {
    if(!$('#video-file').hasClass('uploading')){
        $('#video-file').addClass('uploading');
        
        $('.fake-submit-task').addClass('hold').html('Sender');

        YT_GetAccessToken(
            '277088904091-9i70tiqg90t53ev4mu3j6dlfel4ie1h9.apps.googleusercontent.com',
            '4DwvzFwbw4vVrrrxbO0w_rE_',
            '1/XsKB2xh_rvd_ci2aRgIMjAOrgYImfr7x_SDpx_1w610',
            function(clientID, clientSecret, accesstoken) {
                YT_UploadVideo(
                    document.getElementById("video-file").files[0],
                    clientID, clientSecret, accesstoken,
                    {
                        "callback": function(r){
                            
                            $('.upload-video').append('<input type="hidden" name="item-resp-video" value="'+r+'">');
                            
                            var screen = $('#screen-34'),
                                itemKey = screen.find('article').attr('id').replace('article-',''),
                                item = quiz.obj.tasks[itemKey];
                            
                            quiz.completeTask(item,itemKey);
                        },
                        "progress": function(data, timePassed) {

                            var procentage = data.loaded / (data.total / 100);

                            $(".upload-status").css("width", procentage + "%");

                            if( procentage >= 100){
                                $('.fake-submit-task').addClass('success').html('behandler');
                            }

                        },
                        "error": function(data) {
                            alert("upload error");
                            console.log( data );
                        }
                    }
                );
            }
        );
        
    }
};

var uploadImage = function(targetID, parent){
    var input = document.getElementById(targetID),
        file = input.files[0],
        reader = new FileReader(),
        fd = new FormData();
    
    parent.find('.upload-status').animate({'width' : '100%'}, 400);

    reader.onload = function (e) {
        parent.find('label').css('background-image', 'url(' + e.target.result + ')');

        fd.append('action', 'file_upload');
        
        fd.append(file.name, file);
        
        
        
        $.ajax({
            url: ajaxURL,
            type: "POST",
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success : function(response){
                
                console.log(response);
                
                if(response.files){
                    parent.attr('data-img',response.files[0].id);
                }
                
                parent.addClass('has-image');
            }
        });
    }

    reader.readAsDataURL(file);
}


// Video upload event
$(document).on("change", "#video-file", function() {uploadVideo();});

// Image upload event
$(document).on("change", ".upload input", function(e) {
    var targetID = $(e.target).attr('id'),
        parent = $(e.target).parents('.upload');
    uploadImage(targetID, parent);
});
