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

function fillIngTable(){
    let ingredients = recipe["ingredients"];

    let maxIndex = ingredients.length;

    for(let i = 0; i < maxIndex; i++){
        let ing = ingredients[i];
        let ingSize = "";

        if(ing === undefined){
            ing = "";
        }
        else{
            let selectHTML;
            if(liquidIngredients.includes(ing["measurement"])){
                ing = `<div class="entry"> <span id="sizeML" hidden>${ing["size"]}</span>` + `<span id="size">${ing["size"]}</span>` + ingredientUnitSelectLiquid.replace("REPLACEVALUE",ing["measurement"] ) + " " + ing["name"] + `</div`;
                
            }
            else if(weightMeasurements.includes(ing["measurement"])){
                ing = `<div class="entry"> <span id="sizeML" hidden>${ing["size"]}</span>` + `<span id="size">${ing["size"]}</span>` + ingredientUnitSelectWeight.replace("REPLACEVALUE", ing["measurement"]) + " " + ing["name"] + `</div`;

            }
            else{
                ing = `<div class="entry"> <span id="sizeML" hidden>${ing["size"]}</span>` + `<span id="size">${ing["size"]}</span>` + ingredientUnitSelectDummy + ` ${ing["measurement"]} ` + " " + ing["name"] + `</div`;

            }

        }

        $("#ingTable").append(`<tr><td>${ing}</td></tr>`)
    }

    //update measurements
    updateIngredients();
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
            let selectHTML;
            if(liquidIngredients.includes(ing["measurement"])){
                ing = `<div class="entry"> <span id="sizeML" hidden>${ing["size"]}</span>` + `<span id="size">${ing["size"]}</span>` + ingredientUnitSelectLiquid.replace("REPLACEVALUE",ing["measurement"] ) + " " + ing["name"] + `</div`;
                
            }
            else if(weightMeasurements.includes(ing["measurement"])){
                ing = `<div class="entry"> <span id="sizeML" hidden>${ing["size"]}</span>` + `<span id="size">${ing["size"]}</span>` + ingredientUnitSelectWeight.replace("REPLACEVALUE", ing["measurement"]) + " " + ing["name"] + `</div`;

            }
            else{
                ing = `<div class="entry"> <span id="sizeML" hidden>${ing["size"]}</span>` + `<span id="size">${ing["size"]}</span>` + ingredientUnitSelectDummy + ` ${ing["measurement"]} ` + " " + ing["name"] + `</div`;

            }

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

        /* start of rosie add dec 6 */
        $("#t1").append(`<br><tr class="entry"><td class="entry">${ing}</td></tr>`)
        $("#t2").append(`<br><tr class="entry"><td class="entry">${app}</td></tr> `)
        $("#t3").append(`<br><tr class="entry"><td class="entry">${die}</td></tr>`)
        $("#t4").append(`<br><tr class="entry"><td class="entry">${oth}</td></tr>`)
       /*end of rosie add dec 6 */
    }

    //update measurements
    updateIngredients();
}

function updateIngredients(){
    if($(".ingredientMeasurement").length > 1){
        for(let i = 0; i < $(".ingredientMeasurement").length; i++){
            $(".ingredientMeasurement")[i].value = recipe["ingredients"][i]["measurement"];
        }
        let measurementEls = document.querySelectorAll(".ingredientMeasurement");
        for(let measurementEl of measurementEls){
            changeMeasurement(measurementEl);
        }
        
    }
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
            if(data["result"] != Infinity)
                input.parentNode.querySelector("#size").innerHTML = Math.round(data["result"] * 100) / 100;
        }
        console.log(data);
    });
}