var recipe;
var isRecipeOwner;
var stepTemplate = `
<div id="step">
<p id="stepText"></p>
<p id="timerTime" hidden></p>
</div>`

var ingredientUnitSelect = `
<select class="ingredientMeasurement" onchange="changeMeasurement(this)">
						<datalist id="measurements">
							<option value="mL">mL</option>
							<option value="cups">cups</option>
							<option value="tsp">tsp</option>
							<option value="tbsp">tbsp</option>
							<option value="pinch">pinch</option>
							<option value="qt">qt</option>
							<option value="gal">gal</option>
							<option value="oz">oz</option>
							<option value="lbs">lbs</option>
						</datalist>
					</select>`

$(document).ready(function() {

    stepTemplate = $("#step").clone();
    $("#step").remove();

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
        $("#name").append(recipe["name"]);
        $("#author").append(recipe["author"]);
        let cookTime = recipe["cookTime"];
        if(cookTime == 0){
            $("#cookTime").append("No cook time specified.");
        }
        else{
            $("#cookTime").append(`Approx. cook time: ${timerDisplay(cookTime)}`); 
        }
        getIsRecipeOwner().then(data => {isRecipeOwner = data;});
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

function fillTagTable(){
    let ingredients = recipe["ingredients"];
    let appliances = recipe["appliances"];
    let dietaryRestrictions = recipe["dietaryRestrictions"];
    let otherTags = recipe["otherTags"];

    let maxIndex = Math.max(ingredients.length, appliances.length, otherTags.length);

    for(let i = 0; i < maxIndex; i++){
        let ing = ingredients[i];
        let app = appliances[i];
        let die = dietaryRestrictions[i];
        let oth = otherTags[i];
        let ingSize = "";

        if(ing === undefined){
            ing = "";
        }
        else{
            ing = `<span id="sizeML" hidden>${ing["size"]}</span>` + `<span id="size">${ing["size"]}</span>` + ingredientUnitSelect + ing["name"];

        }

        if(app === undefined){
            app = "";
        }

        if(die === undefined){
            die = "";
        }

        if(oth === undefined){
            oth = "";
        }

        $("#tagTable").append(`
        <tr>
            <td>${ing}</td>
            <td>${app}</td>
            <td>${die}</td>
            <td>${oth}</td>
        </tr>
        `)
    }
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
                <p class="stepText">${stepText}  <br>This step has a timer for ${stepTime}</p>
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
        });
    }
}

function cook(){
    document.location = "/cookRecipe";
}

function changeMeasurement(input){
    let originalMeasurement = input.parentNode.querySelector("#sizeML").innerHTML;
    let unit = input.value;

    $.ajax({
        url: 'http://localhost:8080/api/recipe/scale',
        type: 'post',
        data: JSON.stringify({
            "size": (originalMeasurement - 0),
            "unit": unit
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
        if(data !== undefined){
            input.parentNode.querySelector("#size").innerHTML = data["result"];
        }
        console.log(data);
    });
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