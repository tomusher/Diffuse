function Question() {
    $('ul li').click(function() {
        id = $(this).attr('data-id');
        respond(new Answer(id));
    });
}

function Answer(id) {
    this.id = id;
}
