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
            if(xhr.status == 401){
                $("#status").html("Incorrect username or password.");
                $("#status").show();
            }
        } 
    }).then(function(data){ 
        $.cookie("jwt",data.accessToken);
        let params = new URLSearchParams(window.location.search);
        let redir = params.get('redir');
        if(redir !==  null){
            document.location = redir;
        }
        else{
            document.location = "homepage";
        }
        // console.log(data);
        // console.log(data.accessToken);
        
    });
}

function signup(){
    let params = new URLSearchParams(window.location.search);
    let redir = params.get('redir');
    if(redir != ""){
        document.location = "/signup?redir=" + redir;
    }
    else{
        document.location = "/signup";
    }
}