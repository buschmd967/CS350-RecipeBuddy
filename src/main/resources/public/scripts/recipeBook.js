/* Rosie's Disclaimer: I have not gotten much, this is basically just code copy
and pasted for searchRecipe. 

My intial thought was that I could essentially go off
the search page but instead of being able to search by any string,
the string is automatically the username. In order for this to happen, I added the 
authors user name to othertags, allowing search by usernmae to be accessible. 

I remeber sean saying that he rather have a couple working pages than multiple half working 
so I have switched over to testing and adding recipes for our demo

I plan to revisit this at a later time, as I would like to figure it out.

*/



$(document).ready(function() {
    

    if($.cookie("jwt") === undefined){ //if guest
        $("#MyProfile").html("Login");
        $("#MyProfile").attr("href", "login?redir=searchRecipe");
    }

    let c = $.cookie("jwt");
    let username = "";
    getUsername(c).then(data =>{
        username = data["message"];
        console.log(username);
    });

    let params = new URLSearchParams(window.location.search);
    let searchString = username;
    console.log(username);
    console.log(searchString);

   
    search();

});

function getUsername(c){
    return $.ajax({
            url: 'http://localhost:8080/api/user/username',
            type: 'post',
            headers: {"Authorization": "Bearer " + $.cookie("jwt")},
            xhrFields: { withCredentials:true },
            contentType: 'application/json',
            success: function(response){
                console.log("GOT USERNAME");
            },
            complete: function(xhr, textStatus) {
                console.log(xhr.status);
            } 
        });
}


function search(limit=-1){
    let searchString = getSearchString(limit);
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
                    $("#status").text("Bad Request. Please make sure all required fields have been filled in.");
                    
                }
                if(xhr.status == 401){
                    document.location="/login?redir=searchRecipe";
                }
            }
        } 
    }).then(function(data){
        if(data["error"] && data["message"] == "Could not find any matching recipies"){
            if(limit == -1){
                limit = searchString.split(",").length - 1;
                if(limit > 0){
                    search(limit);
                }
                else{ /* modified*/
                    $("#status").text("Could not find any recipes in your Recipe Book");
                }
            }
            else if(limit == 1){
                $("#status").text("Could not find any recipes in your Recipe Book");
            }
            else{
                search(limit-1);
            }
        }
        else{
            console.log("Data:");
            console.log(data);
            displayRecipies(data);
            if(limit != -1){
                $("#status").html("Initial search did not yield results. The following are results for: <br>" + searchString);
            }
            else{
                $("#status").text(data.message);
            }
        }
        
    });
}


function getSearchString(limit){
    let c = $.cookie("jwt");
    let username = "";
    getUsername(c).then(data =>{
    username = data["message"];
    console.log("got username");
    console.log(username);

    });

    if(limit == -1)
        return username;
    else{
        let searchString = username;
        let outputSearchString = "";
        for(let i = 0; i < limit; i++){
            if(i == limit - 1){
                outputSearchString += searchString[i];
            }
            else{
                outputSearchString += searchString[i] + ",";
            }
        }
        return outputSearchString;

    }
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
        // console.log("in for loop");
        // console.log(recipe);
        // console.log(recipe["name"]);
        // console.log(recipeEntry);
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
    // console.log(data["recipies"][0]);
}

function redirect(name, author){
    $.cookie("viewRecipeName", name);
    $.cookie("viewRecipeAuthor", author);   
    document.location="/viewRecipe";
}