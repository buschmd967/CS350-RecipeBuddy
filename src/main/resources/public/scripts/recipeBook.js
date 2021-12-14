var username = "";
$(document).ready(function() {

    let c = $.cookie("jwt");

    if(c === undefined){
        document.location="/homepage";
    }
    else {
        getUsername(c).then(data =>{
            username = data["message"];
        });
    }

    console.log(username);

    let searchString = username;
    console.log(searchString);

    search();

});


function search(limit=-1){

    // problem is that i dont get the username until after it searches
    let jwt = $.cookie("jwt");

    getUsername(jwt).then(data =>{
        username = data["message"];
    });

    let searchString = username; // theoretically if this gets the write username then it will return results

    $("#results").children("#toClear").remove();

    $.ajax({
        url: 'http://localhost:8080/api/recipe/search',
        type: 'post',
        headers: {"Authorization": "Bearer " + $.cookie("jwt")},
        data: JSON.stringify({
            "searchString": searchString,
            "page" : 1,
            "appliances": true
          }),
        xhrFields: { withCredentials:true },
        contentType: 'application/json',
        success: function(response){
            console.log("SUCCESS");
        },
        complete: function(xhr, textStatus) {
            if(xhr.status != 200){
                console.log(xhr)
                if(xhr.status == 400){
                    $("#status").text("");
                    
                }
                if(xhr.status == 401){
                    document.location="/login?redir=recipeBook";
                }
            }
        } 
    }).then(function(data){
            console.log("Data:");
            console.log(data);
            displayRecipies(data);
            if(limit != -1){
                $("#status").html("Your RecipeBook is empty");
            }
            else{
                $("#status").text(data.message);
            }
            
    });
}


function getUsername(c){
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

function displayRecipies(data){
    let recipies = data["recipies"];
    if(recipies === undefined){
        if(data["error"]){
            $("#results").append(`<h2 id="toClear">${data["message"]}</h2>`);
            return;
        }
        //The following should never show
        $("#results").append(`<h2 id="toClear">Could not understand search, please double check the format.</h2>`);
        return;
    }
    for(let recipe of recipies){
        let name = recipe["name"];
        let author = `${recipe["displayAuthor"]} (${recipe["author"]})`;
        let rating = Math.round(recipe["rating"] * 100) / 100;
        let image = recipe["image"];
        $("#results").append(
            `   
                <div id="toClear" onclick="redirect('${name}', '${recipe["author"]}')">
                    <div class="recipeInfo">
                        
                        
                            <h2>${name}</h2>
                        <div id="recipeText">
                            <h3>Author: ${author}</h3>
                            <h4>Rating: ${rating}</h4>
                        </div>

                        <div class="recipeTable">
                            <table id="toClear">
                                <tr class="recipeData">
                                    <image height=200 width=200 src="${image}"></td>
                                </tr>
                            </table>
                        </div>

                    </div>
                </div>
           `);
    }
}

function redirect(name, author){
    $.cookie("viewRecipeName", name);
    $.cookie("viewRecipeAuthor", author);   
    document.location="/viewRecipe";
}