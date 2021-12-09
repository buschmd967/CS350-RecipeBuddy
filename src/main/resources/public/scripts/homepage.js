var filterDietaryRestrictions = true;

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

// var recipes = null;

$(document).ready(function(){
    if($.cookie("jwt") === undefined){
        $("#dietFilterText").hide();
    }
    updateAll()
});

function updateAll(){
    console.log("test");
    getRecipes("").then(data =>{
        displayRecipes($("#highRatedStr")[0], data["recipies"]);
    });
    let trendingSections = $(".otherTag");
    for(let i = 0; i < trendingSections.length; i++){
        trendingCategoryChanged(trendingSections[i]);
    }
}

function toggleCheckbox(){
    let boxState = $("#dietBox").prop("checked");
    $("#dietBox").prop("checked", !boxState);
    if(boxState){
        filterDietaryRestrictions = false;
    }
    else{
        filterDietaryRestrictions = true;
    }
    updateAll();
}

function updateFilter(button){
    let checked = button.checked
    if(checked){
        filterDietaryRestrictions = true;
    }
    else{
        filterDietaryRestrictions = false;
    }
    updateAll();
}

function getRecipes(tag){
    return $.ajax({
        url: 'http://localhost:8080/api/recipe/trending?tag=' + tag + "&filter=" + filterDietaryRestrictions ,
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
    });
}

function displayRecipes(el, recipes){
    console.log("recipes: " + recipes);

    let trendingSectionDiv = el.parentNode.parentNode;
    console.log(el.parentNode);
    console.log(trendingSectionDiv)

    let trendingTable = trendingSectionDiv.querySelector(".trendingRecipes");
    console.log(trendingTable);

    let trendingRecipeStr = trendingTable.querySelector(".trendingRecipestr");

    // trendingRecipeStr.empty();
    while (trendingRecipeStr.lastChild) {
        trendingRecipeStr.removeChild(trendingRecipeStr.lastChild);
    }

    if(recipes === undefined){
        trendingRecipeStr.innerHTML = `<h1> No recipes with that tag were found.</h1>`;
        return;
    }

    console.log("displaying "  + recipes.length + "recipes");
    
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
                    recipeHTML += `${ingredientName}, <br>`
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
                recipeHTML += `${dietaryRestriction}, <br>`
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
        console.log("appending: " + recipeHTML);
        trendingRecipeStr.innerHTML += recipeHTML;
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

async function trendingCategoryChanged(selectEl){
    let val = selectEl.value;
    console.log(val);
    getRecipes(val).then(data =>{
        let recipes = data["recipies"];
        console.log(data);
        displayRecipes(selectEl, recipes);
    }
    );
    
}