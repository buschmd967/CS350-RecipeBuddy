var recipeTemplate = `
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
</div>`

var recipes = null;

$(document).ready(function() {

    await getRecipes();
    displayRecipes();
    }
);


async function getRecipes(){
    $.ajax({
        url: 'http://localhost:8080/api/recipe/trending',
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
        recipes = data;
        console.log(recipes);
    })
}

async function displayRecipes(){
    
}