$(document).ready(function() {
    $.ajax({
        url: "http://localhost:8080/api/test/all"
    }).then(function(data) {
       $('.test').append(data);
    });

    $('#password').keydown(function (e) {
        if (e.keyCode == 13) {
            login();
        }
    });

});



function login() {
    $.ajax({
        url: 'http://localhost:8080/api/auth/signin',
        type: 'post',
        data: JSON.stringify({
            "username": $("#username").val(),
            "password": $("#password").val()
          }),
        xhrFields: { withCredentials:true },
        contentType: 'application/json',
        success: function(response){
            console.log("SUCCESS");
        },
        complete: function(xhr, textStatus) {
            console.log(xhr.status);
        } 
    }).then(function(data){ 
        $.cookie("jwt",data.accessToken);
        let params = new URLSearchParams(window.location.search);
        let redir = params.get('redir');
        if(redir !==  null){
            document.location = redir;
        }
        // console.log(data);
        // console.log(data.accessToken);
        
    });
}