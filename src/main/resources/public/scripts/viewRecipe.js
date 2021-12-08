var recipe;
var isRecipeOwner;
var isGuest;
var stepTemplate = `
<div id="step">
<p id="stepText"></p>
<p id="timerTime" hidden></p>
</div>`

var liquidIngredients = ["mL", "cups", "tsp", "tbsp", "qt", "gal", "oz"];
var ingredientUnitSelectLiquid = `
<select class="ingredientMeasurement" onchange="changeMeasurement(this)" value="REPLACEVALUE">
						<datalist id="measurements">
							<option value="mL">mL</option>
							<option value="cups">cups</option>
							<option value="tsp">tsp</option>
							<option value="tbsp">tbsp</option>
							<option value="qt">qt</option>
							<option value="gal">gal</option>
							<option value="oz">oz</option>
                            <option value="quantity of">pinch</option>
						</datalist>
					</select>`


var weightMeasurements = ["g", "lbs"];
var ingredientUnitSelectWeight = `
<select class="ingredientMeasurement" onchange="changeMeasurement(this)" value="REPLACEVALUE">
						<datalist id="measurements">
							<option value="g">g</option>
							<option value="lbs">lbs</option>
						</datalist>
					</select>`

var ingredientUnitSelectDummy = `<select class="ingredientMeasurement" onchange="changeMeasurement(this)" value="mL" hidden>
</select>`

$(document).ready(function() {
    isGuest = ($.cookie("jwt") === undefined);

    stepTemplate = $("#step").clone();
    $("#step").remove();

    // let params = new URLSearchParams(window.location.search);
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
        $("#name").append(recipe["name"]);
        $("#author").append(recipe["author"]);

        displayRating();
        
        displayDifficulty(); //holly added

        let cookTime = recipe["cookTime"];
        if(cookTime == 0){
            $("#cookTime").append("No cook time specified.");
        }
        else{
            $("#cookTime").append(`Total cook time: ${timerDisplay(cookTime)}`); 
        }
        getIsRecipeOwner().then(data => {isRecipeOwner = data;});

        viewImage(); //holly added
        

        fillTagTable();
        fillSteps();
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




function fillSteps(){
    let steps = recipe["steps"];
    console.log(steps);
    for(let step of steps){
        console.log(step);
        let stepHTML;
        if(step["timer"] == -1){
            let stepText = step["stepText"];
            stepHTML = 
             `<div class="step">
                <p class="stepText">${stepText}<p>
            </div>`;
           
        }
        else{
            let stepText = step["stepText"];
            let stepTime = timerDisplay(step["timer"]);
            stepHTML = 

             `<div class="step">
               <p class="stepText">${stepText} (This step has a timer for ${stepTime} )</p>
            </div>`;
        }
        $("#steps").append(stepHTML);
    }
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
            history.back();
        });
    }
}

function cook(){
    if(isGuest){
        document.location = "/login?redir=cookRecipe";
    }
    else{
        document.location = "/cookRecipe";
    }
}



function timerDisplay(sec){
    let hours = Math.floor(sec / (60*60));
    let minutes = Math.floor(sec / (60) - hours * 60);
    let seconds = Math.floor( sec - hours * 60 * 60 - minutes * 60);
  
    hours = "" + hours;
    minutes = "" + minutes;
    seconds = "" + seconds;
  
    return hours.padStart(2,'0')+":"+minutes.padStart(2, '0')+":"+seconds.padStart(2, '0');
    
  }

function rate(){
    let rating = $("#rating").prop("value");
    let rateVal;
    if(rating == "No Rating"){
        $.ajax({
            url: 'http://localhost:8080/api/recipe/rate',
            type: 'delete',
            headers: {"Authorization": "Bearer " + $.cookie("jwt")},
            data: JSON.stringify({
                "recipeRating": rateVal,
                "recipeName": recipe["name"],
                "recipeAuthor": recipe["author"]
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
        }).then(data =>{
            console.log(data)
            updateRating();
        });
    }
    else if(1 <= rating && rating <= 5){
        rateVal = Math.floor(rating);
        $.ajax({
            url: 'http://localhost:8080/api/recipe/rate',
            type: 'post',
            headers: {"Authorization": "Bearer " + $.cookie("jwt")},
            data: JSON.stringify({
                "recipeRating": rateVal,
                "recipeName": recipe["name"],
                "recipeAuthor": recipe["author"]
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
        }).then(data =>{
            console.log(data)
            updateRating();
        });
    }

}

function updateRating(){
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
    }).then(data => {
        recipe = data;
        displayRating();
    })
}

function displayRating(){
    let rating = recipe["rating"];
    if(rating == -1){
        rating = "Not yet rated.";
    }
    $("#displayRating").html("Rating: " + Math.round(rating * 100)/100);
}

//holly added
function viewImage(){
    let image = recipe["image"]; 

    console.log(image);
    document.getElementById("recipeImage").src = image;
}
   
function displayDifficulty(){
    let difficulty = recipe["difficulty"];
    $("#displayDifficulty").html("Difficulty: " + difficulty);
}