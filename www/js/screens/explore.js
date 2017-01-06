// Explore screen
var explorerVars = {
    timing : 700,
    triggerDistance : 4,
};



var renderExplorerSingle = function(postID){
    
    var container = $('.screen-explore-single'),
        article = $('<article></article');
        i = 0;
    
    for (var prop in data.ovelse) {if( data.ovelse.hasOwnProperty( prop ) && data.ovelse[prop].id == postID ) {
        i ++;
        var o = data.ovelse[prop];
        
        var img = $('<div class="single-img" style="background-image: url('+o.img.medium_large+');"></div>'),
            header = $('<h3 class="single-header">'+o.title.rendered+'</h3>'),
            author = $('<span class="single-author">'+o.author_name+'</span>'),
            meta = $('<span class="single-media-meta"></span>'),
            content = $('<div class="single-content">'+o.content.rendered+'</div>'),
            media = $('<div class="single-media"></div>');
        
        
        if(o.images.length > 0){
            var d = 1;
            for (var x = 0; x < o.images.length; x++) { 
                if(o.images[x] !== ''){

                    d++;
                    var imgcon = $('<div class="media-item"></div>'),
                    image = $(' <div class="item-image" style="background-image: url('+o.images[x]+');"></div>');

                    imgcon.append(image).appendTo(media);
                }
            }
            
            meta.append(d + ' billeder');
        }

        if('undefined' !== typeof o['video-id'] && o['video-id'] !== ''){
            var video = $('<div class="media-item"></div>'),
                iframe = $('<iframe src="http://youtube.com/embed/'+o['video-id']+'" frameborder="0"></iframe>');
            
            iframe.appendTo(video);
            video.appendTo(media);
            meta.append('/ 1 video');
        }
        else{
            meta.append('/ 0 videoer');
        }
        
        article.append(img,header,author,meta,content,media);
        
    }};
    
    if(i > 0){
        container.empty().append(article);
        app.goTo(22, { animation : 'left'});
    }
};

var renderExplorerList = function(beaconId){
    var listContainer = $('.screen-explore-list'),
        listHeader = $('<h2 class="list-header">Du har fundet disse øvelser</h2>'),
        list = $('<div class="list-items"></div>');
        i = 0;
    
    for (var prop in data.ovelse) {
        if( data.ovelse.hasOwnProperty( prop ) ) {
            
            var o = data.ovelse[prop];
            if(o.beacon == beaconId){
                
                i++;
                
                var li = $('<div class="list-item" id="post-'+o.id+'"></div>'),
                    header = $('<h3 class="list-item-title">'+ o.title.rendered +'</h3>'),
                    author = $('<span class="list-item-author">'+ o.author_name +'</span>'),
                    img = $('<div class="list-item-img" style="background-image:url('+o.img.thumbnail+')"></div>'),
                    readMore = $('<svg class="read-more-icon" viewBox="0 0 30 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-read-more"></use></svg>'),
                    
                    images = o.images.length + ' billeder',
                    video = (o.video_id === '') ? '/ 0 videoer': '/ 1 video',    
                    
                    media = $('<span class="list-item-media">'+images+video+'</span');
                
                
                
                header.appendTo(li);
                img.appendTo(li);
                author.appendTo(li);
                readMore.appendTo(li);
                media.appendTo(li);
                
                li.appendTo(list);
            }
        } 
    }
    
    if(i > 0){
        listContainer.empty().append(listHeader).append(list);
    }
    
    else{
        listContainer.empty().append('<span class="no-result">Der fandtes desværre ingen øvelser i denne zone.</span>');
    }
    
    app.goTo(21, { animation : 'left'});
};

$(document).on('nav',function(e, obj){if (obj.to == 20){
    
    var timerBuffer = 5,
        locationInterval = setInterval(function(){

        
        var shortestDistance = 10000000000,
            closestBeacon = null,
            beaconTriggerDistance = '',
            closest = {
                lat : null,
                lon : null,
            };
        
        navigator.geolocation.getCurrentPosition(function(location){
            
            var lat = location.coords.latitude,
                lon = location.coords.longitude;
            
            for (var prop in data.beacons) {
                if( data.beacons.hasOwnProperty( prop ) ) {
                    var b = data.beacons[prop];
                    
                    var bDist = Math.floor(app.geo.distanceTo(b.lat,b.long,lat,lon) * 10000) / 10;
                    
                    if(bDist < shortestDistance || shortestDistance === null){
                        shortestDistance = parseFloat(bDist);
                        closestBeacon = b.id;
                        beaconTriggerDistance = parseFloat(b.range);
                        closest = {
                            lat : b.lat,
                            long : b.long,
                        }
                    }
                } 
            }
            
            if('' == beaconTriggerDistance || NaN == beaconTriggerDistance){
                beaconTriggerDistance = parseFloat(explorerVars.triggerDistance);
            }
            
            if(parseFloat(shortestDistance) > parseFloat(beaconTriggerDistance) || timerBuffer > 0){
                var shownDistance = Math.floor((shortestDistance - beaconTriggerDistance) * 10) / 10;
                if(shownDistance > 1000000){
                    shownDistance = '?';
                }
                if(shownDistance < 0){
                    shownDistance = '0.1';
                }
                
                animateDistance($('.screen-explore .meters span'), shownDistance);
                //$('.screen-explore .meters span').html(shownDistance);
                timerBuffer --;
            }
            
            else{
                animateDistance($('.screen-explore .meters span'), '0.0');
                clearInterval(locationInterval);
                setTimeout(function(){
                    renderExplorerList(closestBeacon);
                },200);
            }
            
        }, app.geo.error, {enableHighAccuracy : true});
    },explorerVars.timing); // timing
        
    // Kill interval on headerbutton
    $('.header-btn').on('touchstart',function(){
        clearInterval(locationInterval);
        resetAnimateDistance();
    });        
}});