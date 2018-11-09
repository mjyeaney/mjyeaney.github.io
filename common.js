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
        location.href = this.src;
    });

    $('#header h3').click(function(){
        location.href = '/';
    });

    $(window).scroll(function(){
        if($(window).scrollTop() >= $('#header').outerHeight()) {
            $('#header').addClass('small');
        } else {
            $('#header').removeClass('small');
        }
    })
});
