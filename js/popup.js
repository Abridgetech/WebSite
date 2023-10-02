$(document).ready(function () {

    $("form").submit(function (event) {
        event.preventDefault();
        var formData = { name: $("#name").val(), number: $("#number").val() }
        $.ajax({
            type: "POST",
            url: "https://hooks.zapier.com/hooks/catch/16657811/3ieoeac/",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            $('.rep').html('<span>All Done, Good work. We will connect with you on WhatsApp</span>');
        });
    });

    $("#fade").modal({
        fadeDuration: 500
    });
});