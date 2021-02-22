$(document).ready(function () {

    $("nav a.nav-link").click(function(ev){
        ev.preventDefault();
        var link = $(this);
        $(document.body).animate({
            opacity:0
        }, 1000, function(){
            document.location = link.attr("href");
        })
    })
});