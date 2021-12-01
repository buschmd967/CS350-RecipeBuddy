var allowedFileTypes = ["image/png"];
var dietaryRestrictionTemplate;

$(document).ready(function() {
    dietaryRestrictionTemplate = $("#dietInputs").clone();
});


// from https://stackoverflow.com/questions/47195119/how-to-capture-filereader-base64-as-variable
function getBase64(file) {
    return new Promise(function (resolve, reject) {
         let reader = new FileReader();
         reader.onload = function () { resolve(reader.result); };
         reader.onerror = reject;
         reader.readAsDataURL(file);
     });
}


async function getPicture(){
    let file = $("#fileToUpload").prop("files")[0];
    let error = true;
    for(let filetype of allowedFileTypes){
        if(file.type == filetype){
            error = false;
            break;
        }
    }
    if(error){//TODO: add error thingy
        return null;
    }
    
    return getBase64(file);
//  console.log(result);
}

function viewImage(){
    getPicture().then( data => $("#profileImage").attr("src", data));
}


function signUp(){
    if(!validatePasswords()){
        
        return;
    }
     getPicture().then(
         data => {let picture = data;
        $.ajax({
            url: 'http://localhost:8080/api/auth/signup',
            type: 'post',
            data: JSON.stringify({
                "username": $("#username").val(),
                "password": $("#password").val(),
                "displayName": $("#displayName").val(),
                "picture": picture,
                "dietaryRestrictions": getEntries(".diets"),
                "ownedAppliances": getEntries(".appliances")
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
            console.log(data);
            if(!data["error"]){

            
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
            
        });
        
    });
 }

function getEntries(query){
    let out = [];
    $(query).each(function() 
        { 
            out.push( $(this).val() );
        }
    );
    return out;
}

function validatePasswords(){
    return $("#password").val() == $("#password-repeat").val();
}