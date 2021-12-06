$(document).ready(function() {
    let jwt = $.cookie("jwt");
    console.log("jwt: ")
    console.log(jwt);
    let username = "";
    if(jwt === undefined){
        $("#myProfile").html("Login / Sign up");
        $("#myProfile").prop("href", "/login?redir=" + window.location.href);
        $("#pantry").hide();
        $("#recipeBook").hide();
        $("#addRecipe").hide();
        $("#logout").hide();
    }
    else if(jwt != ""){
        getUsername(jwt).then(data =>{
            username = data["message"];
            $("#myProfile").html(username + "'s Profile");
        });
        
    }
});




function getUsername(jwt){
    return $.ajax({
            url: 'http://localhost:8080/api/user/username',
            type: 'post',
            headers: {"Authorization": "Bearer " + $.cookie("jwt")},
            xhrFields: { withCredentials:true },
            contentType: 'application/json',
            success: function(response){
                console.log("SUCCESS");
            },
            complete: function(xhr, textStatus) {
                console.log(xhr.status);
            } 
        });
}


function logout(){
    let cookies = ["jwt", "viewRecipeAuthor", "viewRecipeName"];
    for(let cookie of cookies){
        $.removeCookie(cookie, { path: '/' });
    }
    location.reload(true);
}