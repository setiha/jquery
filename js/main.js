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

function showInvalidMessage() {
    let alertBox = $(".alert.alert-primary");
    alertBox
        .removeClass("alert-primary")
        .addClass("alert-danger")
        .find(".alert-message")
        .text("Sikertelen belepes!");
}

let tickets = [
    {
        event: "Sziget fesztival",
        time: "2018-08-03 18:00",
        seller: "Kis Marton",
        pcs: 100,
        link: "licit/1"

    },
    {
        event: "Diotoro balett",
        time: "2018-08-03 18:00",
        seller: "Kis Marton",
        pcs: 9,
        link: "licit/1"

    },
    {
        event: "Moma fesztival",
        time: "2018-08-03 18:00",
        seller: "Kis Marton",
        pcs: 6,
        link: "licit/1"

    },
    {
        event: "A kekszakallu herceg vara",
        time: "2018-08-03 18:00",
        seller: "Kis Marton",
        pcs: 1,
        link: "licit/1"

    },
    {
        event: "Balett mindenkinek",
        time: "2018-08-03 18:00",
        seller: "Kis Marton",
        pcs: 50,
        link: "licit/1"

    },
    {
        event: "Macskak musical",
        time: "2018-08-03 18:00",
        seller: "Kis Marton",
        pcs: 15,
        link: "licit/1"

    }
];
let ticketTable = $("table.table.table-striped").eq(0);
function fillTicketsTable(currentTickets) {
    currentTickets = currentTickets || tickets;
    let tbody = ticketTable.find("tbody");
    tbody.html("");
    $.each(currentTickets, function (index, ticket) {
        let row = $(".templates .ticket-row").clone();
        row.find("td").eq(0).html(index + 1);
        row.find("td").eq(1).html(ticket.event);
        row.find("td").eq(2).html(ticket.time);
        row.find("td").eq(3).html(ticket.seller);
        row.find("td").eq(4).html(ticket.pcs);
        row.find("td").eq(5).html(ticket.link);
        tbody.append(row);

    });

}
fillTicketsTable();

//Jegyek tablazat szurese
$(".tickets-search-row input").on("keyup", filterTickets);
function filterTickets() {
    let currentValue = $(this).val().toLowerCase();
    let filteredTickets = [];
    if (currentValue === "") {
        filteredTickets = tickets;
    } else {
        filteredTickets = tickets.filter(function (item) {
            var done = false;
            for (let k in item) {
                if (item[k].toString().toLowerCase().indexOf(currentValue) > -1) {
                    done = true;
                }
            }
            return done;
        });
    }
    fillTicketsTable(filteredTickets);
}

//jegyek tablazat rendezese
ticketTable.find("thead th[data-key]").on("click", orderTicketTable);
function orderTicketTable() {

    let th = $(this);
    $.each(ticketTable.find("thead th[data-key]"), function (index, elem) {
        let currentTh = $(elem);
        if (th.data("key") != currentTh.data("key")) {
            currentTh.removeClass("up").removeClass("down");
        }
    })
    let key = th.data("key");
    let sortedTickets = tickets.map(function (item) {
        return item;
    });
    if (th.hasClass("down")) {
        th.removeClass("down").addClass("up");
    } else {
        th.removeClass("up").addClass("down");
    }
    sortedTickets.sort(function (a, b) {
        if (th.hasClass("down")) {
            return a[key].toString().localeCompare(b[key].toString());
        } else {
            return b[key].toString().localeCompare(a[key].toString());
        }

    });
    fillTicketsTable(sortedTickets);
}

