
function search(){
    let searchString = getSearchString();
    $("#results").children("#toClear").remove();


    $.ajax({
        url: 'http://localhost:8080/api/recipe/search',
        type: 'post',
        headers: {"Authorization": "Bearer " + $.cookie("jwt")},
        data: JSON.stringify({
            "searchString": $("#searchString").val(),
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
        console.log("Data:");
        console.log(data);
        displayRecipies(data);
        $("#status").text(data.message);
    });
}


function getSearchString(){
    return $("#searchString").val();
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
        let author = recipe["author"];
        let rating = recipe["rating"];
        $("#results").append(
            `<div id="toClear" onclick="redirect('${name}', '${author}')">
                <h2 id="toClear">${name}</h2>
                <h3 id="toClear">${author}</h3>
                <h4 id="toClear">rating: ${rating}</h4>
            </div>`);
    }
    // console.log(data["recipies"][0]);
}

function redirect(name, author){
    $.cookie("viewRecipeName", name);
    $.cookie("viewRecipeAuthor", author);   
    document.location="/viewRecipe";
}