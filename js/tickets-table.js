$(document).ready(function () {
    let RESTURL = "http://localhost:3000";
    let searchString = '';
    let sortKey = '';
    let sortDirection = '';

    function fillTicketsTable(currentTickets) {
        let tbody = $("#ticket-list tbody").eq(0);
        tbody.html('');
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

    function refreshTicketList() {
        let urlParams = [];
        let url = RESTURL + "/tickets";
        if (searchString.length > 0) {
            urlParams.push('q=' + searchString)
        }

        if (urlParams.length > 0) {
            url = url + "?" + urlParams.join('&');

        }
        $.getJSON(url).done(
            function (ticketList) {
                fillTicketsTable(ticketList);
            }
        );
    }

    $(".tickets-search-row input").on("keyup",
        function () {
            searchString = $(this).val();
            refreshTicketList();
        });
    refreshTicketList();

});
