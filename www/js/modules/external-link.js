$(document).on('click','.external-link',function(e){
    e.preventDefault();
    var a = $(this),
        href = a.attr('href'),
        target = a.attr('target');
    
    if(typeof target === 'udefined'){target = '_system';}
    //window.open(href, target);
    cordova.InAppBrowser.open(href, target);
});
