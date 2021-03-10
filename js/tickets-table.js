$(document).ready(function () {
    let RESTURL = "http://localhost:3000";
    let searchString = '';
    let sortKey = '';
    let sortDirection = '';
    let ticketListTable = $("#ticket-list");
    // lapozas globalis valtozoi
    let pageLimit = 3; // hany egyed jelenjen meg egy lapon
    let currentPage = 1; // jelenleg hol all a lapozo
    let maxPage = 0; // hany oldalt tudunk megjeleniteni
    let totalCount = 0; // osszes egyed szam amit a server tud szolgaltatni

    // tabla kitoltese javascript object-bol
    function fillTicketsTable(currentTickets) {
        let tbody = $("#ticket-list tbody");
        tbody.html('');

        $.each(currentTickets, function (index, ticket) {
            let row = $(".templates .ticket-row").clone();
            row.find("td").eq(0).html(ticket.id);
            row.find("td").eq(1).html(ticket.event);
            row.find("td").eq(2).html(ticket.time);
            row.find("td").eq(3).html(ticket.seller);
            row.find("td").eq(4).html(ticket.pcs);
            row.find("td").eq(5).html(ticket.link);
            tbody.append(row);
        });
    }

    // lista ujratoltese ajax-val (meghivja a fillTicketsTable-t is!)
    function refreshTicketList() {
        let urlParams = [];
        let url = RESTURL + "/tickets";
        let reg = /\?.*event\=([0-9]*)/;
        let eventId = 0;
        // lapozo adatok kezelese
        urlParams.push('_limit=' + pageLimit);
        urlParams.push('_page=' + currentPage);
        // sima szoveges kereses lekezelese
        if (searchString.length > 0) {
            urlParams.push('q=' + searchString);
        }

        // rendezes kezelese
        if (sortKey.length > 0) {
            urlParams.push('_sort=' + sortKey);
            urlParams.push('_order=' + sortDirection);
        }
        // az event id hozzaadasa
        eventId = window.location.toString().match(reg)[1];
        urlParams.push('eventId=' + eventId);
        // ha van url parameter akkor osszefozzuk az url valtozoba
        if (urlParams.length > 0) {
            url = url + "?" + urlParams.join('&');
        }

        $.getJSON(url).done(
            function (ticketList, textStatus, request) {
                let oldMaxPage = maxPage;
                // valasz fejlecbol kiolvassuk az osszes lehetseges talalat szamat
                totalCount = request.getResponseHeader('X-Total-Count');
                maxPage = totalCount / pageLimit;
                // modulus (maradekos) osztas
                if (maxPage % 1 !== 0) {
                    maxPage = parseInt(maxPage) + 1;
                }
                // ha valtozott az oldalak szama akkor ujra kirajzoljuk a lapozot
                if (oldMaxPage !== maxPage) {
                    renderTicketTabletPaginator();
                }

                // lapozo ertekeinek frissitese
                refreshPaginate();
                // tablazat kirajzolasa az uj adatokkal
                fillTicketsTable(ticketList);
            }
        );
    }

    function refreshPaginate() {
        let paginatorElem = $('#ticket-list-paginator');

        // bal oldali nyilacska elem referencia
        let firstElem = paginatorElem.find('ul > li:first-child');
        // jobb oldali nyilacska elem referencia
        let lastElem = paginatorElem.find('ul > li:last-child');

        if (currentPage == 1) {
            // bal oldali nyilacska tiltasa
            firstElem.addClass('disabled');

            // ha tiltva van a jobb oldali nyilacska akkor levesszuk a tiltast
            lastElem.removeClass('disabled');
        } else if (currentPage == maxPage) {
            firstElem.removeClass('disabled');
            lastElem.addClass('disabled');
        } else {
            // kozepen vagyunk a lapozoban ezert az elso es utolso elem tiltasokat elvesszuk
            firstElem.removeClass('disabled');

            lastElem.removeClass('disabled');
        }

        // Megnezzuk hogy van-e most olyan elem a paginatorban ami active
        let currentActiveElem = paginatorElem.find('ul > li.active');
        if (currentActiveElem.length > 0) {
            // ha van olyan elem akkor levesszuk rola az active class-t
            currentActiveElem.removeClass('active');
        }

        // jelenlegi oldalszamot tartalmazo li elemet megjeloljuk az active class-val
        paginatorElem.find('ul > li').eq(currentPage).addClass('active');
    }

    function renderTicketTabletPaginator() {
        let paginatorULElem = $("#ticket-list-paginator > ul");
        // mivel ujra generaljuk a lapozot, ezert elotte uritjuk
        paginatorULElem.html('');

        let html = [];
        // balra nyilacska html (nem valtoztatjuk)
        html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Previous" data-paginate-size="prev"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>');

        for (var i = 1; i <= maxPage; i++) {
            // a belso elemek toltese (szam elemek)
            html.push('<li class="page-item"><a class="page-link" href="#" data-paginate-size="' + i + '">' + i + '</a></li>');
        }

        // jobbra nyilacska html (nem valtoztatjuk)
        html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-paginate-size="next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>');

        // tomb osszefuzese ures szoveggel es utana az UL elem-be toltese
        paginatorULElem.html(html.join(''));
        // mivel kicsereltuk a lapozo teljes html-t igy az esemenykezeloket is ujra hozza kell adni
        bindPaginatorEvents();
    }

    /*
     * erre itt azert van szukseg mert amikor renderTicketTabletPaginator() metodus lefut
     * akkor mi toroltuk az UL -ben levo osszes elemet igy az eddig felvett click
     * esemenyek torlodtek es ujra fel kell hogy vegyuk oket mivel renderTicketTabletPaginator() -ban
     * teljesen ujra generaljuk a paginatorban levo LI elemeket es benne az A elemeket
     */
    function bindPaginatorEvents() {
        // Paginatorban levo gombok lekezelese
        $('#ticket-list-paginator > ul > li > a').click(
            function (event) {

                let oldCurrentPage = currentPage;
                // click esemeny megallitasa, igy nem fut le az A elemben megadott href attributum url keres
                event.preventDefault();
                // data-paginate-size kiolvasasa
                let paginateSize = $(this).data('paginate-size');
                if (paginateSize === 'prev') {
                    // ha prev gombra nyomtak akkor csokkentjuk a "globalis" currentPage erteket
                    currentPage--;
                } else if (paginateSize === 'next') {
                    // ha next gombra nyomtak akkor noveljuk a "globalis" currentPage erteket
                    currentPage++;
                } else {
                    currentPage = parseInt(paginateSize);
                }
                if (oldCurrentPage !== currentPage) {
                    // lista frissitese
                    refreshTicketList();
                }
            }
        );
    }

    // keres box lekezelese
    $(".tickets-search-row input").on("keyup",
        function () {
            // feltoltjuk a "globalis" kereses szoveget tarolo valtozot
            searchString = $(this).val();
            // frissitjuk a listat
            refreshTicketList();
        });

    // rendezes lekezelese (fejlecben kattintas hatasa)
    ticketListTable.find("thead th[data-key]").on("click",
        function () {
            let th = $(this);
            $.each(ticketListTable.find('thead th[data-key]'), function (index, elem) {
                let currentTh = $(elem);
                if (th.data("key") !== currentTh.data("key")) {
                    currentTh.removeClass("asc").removeClass("desc");
                }
            });
            sortKey = th.data("key");

            if (th.hasClass("asc")) {
                sortDirection = 'desc';
                th.removeClass("asc").addClass("desc");
            } else {
                sortDirection = 'asc';
                th.removeClass("desc").addClass("asc");
            }

            refreshTicketList();
        });

    // Innen indul az alkalmazas
    refreshTicketList();


    ticketListTable.on("ticketDataChanged", function () {
        refreshTicketList();
    })
});

//kivalasztott esemeny

window.currentEvent = null;


//jegylista frissitese
function refreshTicketList() {
    $("#ticket-list").trigger("ticketDataChanged");
}
function openNewTicketModal() {
    $("#newTicketModal").modal("show");
}
function hideNewTicketModal() {
    $("#newTicketModal").modal("hide");
}
function setEventDetails(event) {
    console.log(event);
    $("#event").val(event.title);
    $("#time").val(event.time);
    console.log(event.time);
}

$.getJSON("http://localhost:3000/events").done(
    function (events) {
        let select = $("#eventId")
            .on("change", function (ev) {
                let event = $(this)
                    .find("option:selected")
                    .data("event");
                setEventDetails(event);
            });
        let eventId = window.location.href.match(/\?.*event\=([0-9]*)/)[1];
        $.each(events, function (index, event) {
            let option = $("<option />");
            option.data("event", event);
            option.val(event.id);
            option.text(event.title);

            if (event.id == eventId) {
                option.attr("selected", true);
                setEventDetails(event);
            }
            select.append(option);
        })
    }
);

$("#newTicketForm").sendForm();
