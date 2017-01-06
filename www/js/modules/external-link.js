$(document).on('click','.external-link',function(e){
    e.preventDefault();
    var a = $(this),
        href = a.attr('href'),
        target = a.attr('target');
    
    if(typeof target === 'udefined'){target = '_blank';}
    window.open(href, target);
    
});