var dietTemplate = `<p>REPLACE</>`
var user;

$(document).ready(function() {

     let jwt = $.cookie("jwt");
     console.log("jwt: ")
     console.log(jwt);
 
     let params = new URLSearchParams(window.location.search);
     let name = $.cookie("viewRecipeName");
     let author = $.cookie("viewRecipeAuthor");
     console.log(name);
     console.log(author);
 
     $.ajax({    //Get recipe
         url: 'http://localhost:8080/api/user/getInfo',
         type: 'post',
         headers: {"Authorization": "Bearer " + $.cookie("jwt")},
         xhrFields: { withCredentials:true },
         contentType: 'application/json',
         success: function(response){
             console.log("SUCCESS");
         },
         complete: function(xhr, textStatus) {
             if(xhr.status != 200){
                 console.log(xhr)
                 if(xhr.status == 401){
                     document.location = "/homepage";
                 }
             }
 
         } 
     }).then(function(data){
         user = data;

        //console.log(data);
        let dietaryRestrictions = user["dietaryRestrictions"];
        displayDietaryRestricitions(dietaryRestrictions);
        viewImage();

         getUsername(jwt).then(user =>{
             username = user["message"];
             $("#usernameProfile").html("Username: " + username);
         });

         
     });
 });
 
 function displayDietaryRestricitions(dietaryRestricitons){
    $("#dietEntry").empty();
    for(let diet of dietaryRestricitons){
        let info = diet["name"];
        let html = dietTemplate.replace("REPLACE", info);
        $("#dietEntry").append(html);
    }

}


function getDisplayName(){
    let displayName = user["displayName"];
    $("#displayNameProfile").html("Display Name: " + displayName);
}

function viewImage(){
    let image = user["image"]; 
    

    console.log(image);
    document.getElementById("profileImage").src = image;
}