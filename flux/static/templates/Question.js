function Question() {
    $('ul li').click(function() {
        id = $(this).attr('data-id');
        $(this).parent().children().removeClass('selected');
        $(this).addClass('selected');
        respond(new Answer(id));
    });
}

function Answer(id) {
    this.id = id;
}
