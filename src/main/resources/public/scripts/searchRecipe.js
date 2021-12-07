
$(document).ready(function() {

    $('#searchString').keydown(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });


    if($.cookie("jwt") === undefined){ //if guest
        $("#MyProfile").html("Login");
        $("#MyProfile").attr("href", "login?redir=searchRecipe");
    }
    let params = new URLSearchParams(window.location.search);
    let searchString = params.get("searchString");
    console.log(searchString);

    if(searchString !== null){
        $("#searchString").val(searchString);
        search();
    }

    
});

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
                else{
                    $("#status").text("Could not find any matching recipes with tag '" + searchString + "'" );
                }
            }
            else if(limit == 1){
                $("#status").text("Could not find any matching recipes with tag '" + searchString + "'" );
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
    if(limit == -1)
        return $("#searchString").val();
    else{
        let searchString = $("#searchString").val().split(",");
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