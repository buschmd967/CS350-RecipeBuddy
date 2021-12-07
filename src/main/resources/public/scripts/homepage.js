var recipeTemplate = `
<td>
<div class="recipeInfo">
                    
<h2>NAME</h2>
<div id="recipeText">
    <h3>Author: </h3>
    <h4>Rating: </h4>
    <h4>Ingredients: (Listed as a paragraph)</h4>
    <h4>Dietary Restricitions: (Listed as a paragraph)</h4>
</div>

<div class="recipeTable">
    <table id="toClear">
        <tr class="recipeData">
            <image height=200 width=200 src="">
        </tr>
    </table>
</div>
</div>
</td>`

var recipes = null;

$(document).ready(function() {
    console.log("test");
    getRecipes("");
    }
);


async function getRecipes(tag){
    $.ajax({
        url: 'http://localhost:8080/api/recipe/trending?tag=' + tag,
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
                if(xhr.status == 400){
                    $("#status").text("Bad Request. Please make sure all required fields have been filled in.");
                }
            }
        } 
    }).then(data =>{
        recipes = data["recipies"];
        console.log(recipes);
        displayRecipes();
        
    })
}

function displayRecipes(){
    $("#trendingRecipestr").empty();

    if(recipes === undefined){
        $("#trendingRecipestr").append(`<h1> No recipes with that tag were found.</h1>`);
    }
    for(let recipe of recipes){
        let name = recipe["name"];
        let displayAuthor = recipe["displayAuthor"];
        let author = recipe["author"];
        let rating = Math.round(recipe["rating"] * 100) / 100;
        let image = recipe["image"];
        recipeHTML = `<td id="toClear">
        <div class="recipeInfo" onclick="viewThisRecipe(this)">
        <h2 id="recipeName">${name}</h2>
        <div id="recipeText">
            <h3>Author: ${displayAuthor} (${author})</h3>
            <p id="author" hidden>${author}</p>
            <h4>Rating: ${rating}</h4>
            <h4>Ingredients: </h4>
            <p>`
            for(let i = 0; i < recipe["ingredients"].length; i++){
                let ingredientName = recipe["ingredients"][i]["name"];
                if(i != recipe["ingredients"].length - 1){
                    recipeHTML += `${ingredientName}, `
                }
                else{
                    recipeHTML += `${ingredientName}</p>`

                }
            }
            
        recipeHTML += `
        <h4>Dietary Restricitions: </h4>`


        for(let i = 0; i < recipe["dietaryRestrictions"].length; i++){
            let dietaryRestriction = recipe["dietaryRestrictions"][i];
            if(i != recipe["dietaryRestrictions"].length - 1){
                recipeHTML += `${dietaryRestriction}, `
            }
            else{
                recipeHTML += `${dietaryRestriction}</p>`

            }
        }
        recipeHTML += `</div>

        <div class="recipeTable">
            <table>
                <tr class="recipeData">
                    <image height=200 width=200 src="${image}">
                </tr>
            </table>
        </div>
        </div>`;
        $("#trendingRecipestr").append(recipeHTML);
    }
}

function viewThisRecipe(divElement){
    let nameEl = divElement.querySelector("#recipeName");
    let name = nameEl.innerHTML;
    let authorEl = divElement.querySelector("#author");
    let author = authorEl.innerHTML;
    
    $.cookie("viewRecipeName", name);
    $.cookie("viewRecipeAuthor", author);
    document.location = "/viewRecipe";
}

function showCategory(divEl){
    let category = divEl.querySelector("#categoryName").innerHTML;
    getRecipes(category.toLowerCase());
}