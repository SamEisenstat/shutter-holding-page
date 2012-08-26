$(document).ready(function() {

    $('input.submit').live('click', function() {
        var email = $("#email-input").val();

        if (IsEmail(email) == true) {
            url = "http://us5.api.mailchimp.com/1.3/?method=listSubscribe";

            $.post(url, {apikey: "863838db32f211cf004937d8eea7df93-us5", id: "132799819c", email_address: email}, function() {
            });
            $("#email-input").val("Thank you!");
        } else {
            $(".input-wrapper").effect("shake", {
                times: 2,
                distance: 3
            }, 125);
        }

        // This prevents it from opening a new window telling you that you have submitted your email.
        return false;
    });

});

function IsEmail(email) {
    var regex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    //^([a-zA-Z0-9_\.\-\+%])+\@([a-zA-Z0-9\-\.])+$/;
    return regex.test(email);
}
