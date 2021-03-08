function startEventsPage() {
    let RESTURL = "http://localhost:3000";
    $.getJSON(RESTURL + "/events").done(function (eventList) {
        showEventList(eventList);
    });
}


// esemenyek megjelenitese

function showEventList(eventList) {
    let template = $(".templates a.card");
    console.log(template);
    let parentElement = $(".events-card-deck");
    parentElement.html('');
    $.each(eventList, function (index, event) {
        let eventElement = template.clone();
        eventElement.attr("href", "tickets.html?event=" + event.id);
        eventElement.find("h4").text(event.title);
        eventElement.find(".card-body p").eq(0).text(event.description);
        eventElement.find(".card-body small.event-time").text(event.time);
        eventElement.find("img").attr("src", event.image);
        parentElement.append(eventElement);
    });
}

function openNewEventModal() {
    $("#newEventModal").modal("show");
}
function hideNewEventModal(){
    $("#newEventModal").modal("hide");
}
startEventsPage();