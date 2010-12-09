function WebURL() {
    if($("iframe").length >0) {
        loading = $("<p>").attr("id", "loading");
        $(loading).html("Loading Page...");
        $("body").append(loading);
        $("#iframe").hide();
        $("#iframe iframe").load(function() {
            $(this).parent().show();
            $(loading).hide();
        });
    }
}
