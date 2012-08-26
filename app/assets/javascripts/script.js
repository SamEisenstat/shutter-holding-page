$(document).ready(function() {

    $('input.submit').live('click', function() {
        var x = $("#email-input").val();

        if (IsEmail(x) == true) {
            url = $('#new_user').attr('action');
            email = $('#email-input').get();
            $.post(url, email, function() {
                $("#email-input").val("Thank you!");
            })
        } else {
            $(".input-wrapper").effect("shake", {
                times: 2,
                distance: 3
            }, 125);
        }

        return false;
    });

});

function IsEmail(email) {
    var regex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    //^([a-zA-Z0-9_\.\-\+%])+\@([a-zA-Z0-9\-\.])+$/;
    return regex.test(email);
}
