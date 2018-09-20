/*
 * Post request for triggering the garage door motor
 */
$("#confirmTrigger").click(function() {
    var csrftoken = $('meta[name="_csrf"]').attr('content');
    $.ajax({
        url: '/trigger',
        type: 'POST',
        beforeSend: (xhr) => {
            xhr.setRequestHeader('CSRF-Token', csrftoken);
        },
        success: (data, status) => {
            $("#triggerModal").modal("toggle");    
        }

    })
    .fail(function() {
        $("#triggerModal").modal("toggle");   
        $('#alerts').append($('#connectError').clone());
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
    if(!state) {
        $('#state-unknown').show();
    }

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
                        success: (data) => {
                            toggleState(data.state);
                            poll();
                        },
                        error: () => {
                            toggleState('unknown');
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
