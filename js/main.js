

    $("nav a.nav-link").click(function (ev) {
        ev.preventDefault();
        var link = $(this);
        $(document.body).animate({
            opacity: 0
        }, 1000, function () {
            document.location = link.attr("href");
        })
    })
    $(".events-search-row input").on("keyup", function (ev) {
        $.each($(".events-card-deck .card .card-title"), function (i, e) {
            let elem = $(e);
            let search = ev.target.value.toLowerCase();
            let content = elem.html().toLowerCase();
            if (content.indexOf(search) === -1) {
                elem.parents(".card").hide();
            } else {
                elem.parents(".card").show();
            }
        });

    });




    $(".cherry-custom-file").on("change", function (ev) {
        var name = ev.target.value.split("\\").pop();
        $(this).find(".file-name").html(
            name);
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    function showInvalidMessage(){
        let alertBox = $(".alert.alert-primary");
        alertBox
            .removeClass("alert-primary")
            .addClass("alert-danger")
            .find(".alert-message")
            .text("Sikertelen belepes!");
    }

