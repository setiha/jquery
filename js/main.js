$("nav a.nav-link").click(function (ev) {
    ev.preventDefault();
    let link = $(this);
    $(document.body).animate({
        opacity: 0
    }, 1000, function () {
        document.location = link.attr("href");
    })
})
$(".events-search-row input, select").on("keyup", function (ev) {
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
    let name = ev.target.value.split("\\").pop();
    $(this).find(".file-name").html(
        name);
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//JQuery plugin for send form data.

$.fn.sendForm = function () {
    let form = $(this);
    let action = form.attr("action");
    let method = form.attr("method") || "post";
    let callBack = form.attr("callBack");
    $(this).on("submit", function (ev) {
        ev.preventDefault();
        let formData = {};
        $(this).find("input, select" ).each(function (index, input) {
            formData[input.name] = input.value;
        });
        $.ajax({
            type: "POST",
            url: action,
            data: formData,
            dataType: "JSON"
        }).done(function (resp) {
            console.log(resp);
            if(window[callBack]){
                window[callBack]();
            }
        })
    });
    return this;
};

$("#newEventForm").sendForm();