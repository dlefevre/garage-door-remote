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

/*
 * https://bootsnipp.com/snippets/z85Qd
 */
$(document).ready(function(){
  $('.nav-button').click(function(){
    $('body').toggleClass('nav-open');
  });
});

/*
 * Long polling for door status on main page
 */
function toggleState(state) {
    $('.state-box').hide();
    $('#state-' + state).show();
}

function pollDirect(callback) {
    $.ajax({
        url: '/state', 
        datatype: 'json', 
        success: function(data) {
            toggleState(data.state);
        }
    });
    callback();             
}

$(document).ready(function() {
    if($('#status').length) {
        function poll() {
            setTimeout(function() {
                if(document.hasFocus()) {
                    $.ajax({
                        url: '/state', 
                        datatype: 'json', 
                        success: function(data) {
                            toggleState(data.state);
                            poll();
                        }
                    })
                } else {
                    poll();
                }
            }, 1000);
        }
        pollDirect(poll);
    }
});
