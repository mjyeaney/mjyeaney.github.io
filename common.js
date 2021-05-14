/* globals $ */

var host = 'mjyeaney.github.io';

if ((host === location.host) && (location.protocol !== 'https:')){
    location.protocol = 'https:';
}

$(function(){
    $('a.hamburger').click(function(){
        $('#header ul').toggleClass('active');
    });

    $('p.center img').click(function(){
        window.open(this.src, "_blank");
    });

    $('#header h3').click(function(){
        location.href = '/';
    });

    var check = true;

    $(window).scroll(function(){
        if($(window).scrollTop() >= $('#header').outerHeight()) {
            if (check){
                $('#header').addClass('small');
                check = false;
            }
        } else {
            if (!check){
                $('#header').removeClass('small');
                check = true;
            } 
        }
    })
});
