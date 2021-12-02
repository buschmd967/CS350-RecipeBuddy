var recipe;
var isRecipeOwner;

$(document).ready(function() {
    let params = new URLSearchParams(window.location.search);
    let name = $.cookie("viewRecipeName");
    let author = $.cookie("viewRecipeAuthor");
    console.log(name);
    console.log(author);

    $.ajax({
        url: 'http://localhost:8080/api/recipe/get',
        type: 'post',
        headers: {"Authorization": "Bearer " + $.cookie("jwt")},
        data: JSON.stringify({
            "name": name,
            "author": author
          }),
        xhrFields: { withCredentials:true },
        contentType: 'application/json',
        success: function(response){
            console.log("SUCCESS");
        },
        complete: function(xhr, textStatus) {
            if(xhr.status != 200){
                console.log(xhr)
            }

        } 
    }).then(function(data){
        recipe = data;
        getIsRecipeOwner().then(data => {isRecipeOwner = data;});
        console.log(data);
    })
});

async function getIsRecipeOwner(){
    let name = $.cookie("viewRecipeName");
    let author = $.cookie("viewRecipeAuthor");
    $.ajax({
        url: 'http://localhost:8080/api/recipe/isRecipeOwner',
        type: 'post',
        headers: {"Authorization": "Bearer " + $.cookie("jwt")},
        data: JSON.stringify({
            "name": name,
            "author": author
        }),
        xhrFields: { withCredentials:true },
        contentType: 'application/json',
        success: function(response){
            console.log("SUCCESS");
        },
        complete: function(xhr, textStatus) {
            if(xhr.status != 200){
                console.log(xhr)
            }

        } 
    }).then(function(data){
        console.log(data);
        console.log(data["result"]);
        if(data["result"]){
            console.log("TRUE")
            $("#deleteRecipeButton").show();
        }
        else{
            $("#deleteRecipeButton").remove();
        }
        
    });
}

function getRecipe(){
    console.log(recipe);
}

function deleteRecipe(){
    if(confirm("Are you sure you want to delete this recipe? There is no way to recover deleted recipes.")){
        let name = $.cookie("viewRecipeName");
        let author = $.cookie("viewRecipeAuthor");
        $.ajax({
            url: 'http://localhost:8080/api/recipe',
            type: 'delete',
            headers: {"Authorization": "Bearer " + $.cookie("jwt")},
            data: JSON.stringify({
                "name": name,
                "author": author
            }),
            xhrFields: { withCredentials:true },
            contentType: 'application/json',
            success: function(response){
                console.log("SUCCESS");
            },
            complete: function(xhr, textStatus) {
                if(xhr.status != 200){
                    console.log(xhr)
                }
    
            } 
        }).then(function(data){
            console.log(data);
        });
    }
}

function cook(){
    document.location = "/cookRecipe";
}