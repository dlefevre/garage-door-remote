/*
 * Post request for triggering the garage door motor
 */
$("#confirmTrigger").click(function() {
    $.post("trigger", function(data, status) {
        $("#triggerModal").modal("toggle");
    })
    .fail(function() {
        alert("An error occured")
    });
});
