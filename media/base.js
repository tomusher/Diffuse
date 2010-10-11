$(document).ready(function(){
    $('.push').click(function(){
        var url = $(this).attr('href');
        $.get(url);
        return false;
    });
});
