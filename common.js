/* globals $ */

var host = 'mjyeaney.github.io';

if ((host === location.host) && (location.protocol !== 'https:')){
    location.protocol = 'https:';
}

$(function(){
    $('a.hamburger').click(function(){
        $('#header ul').toggle();
    });
});
