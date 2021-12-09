var singleIngredientRE = /(\d+) (\w+) (?:of )?(\w+)/
// var doubleIngredientRE = /(\d+) (\w+) (?:of )?(\w+) (\w+)/g

var liquidMeasurements = ["mL", "cups", "tsp", "tbsp", "qt", "gal", "oz"];
var ingredientUnitSelectLiquid = `
<select class="ingredientMeasurementREPLACEI" onchange="stepConvert(this, REPLACEI)" value="cups">

                        <option value="mL">mL</option>
                        <option value="cups">cups</option>
                        <option value="tsp">tsp</option>
                        <option value="tbsp">tbsp</option>
                        <option value="qt">qt</option>
                        <option value="gal">gal</option>
                        <option value="oz">oz</option>

					</select>`

var weightMeasurements = ["g", "lbs"];
var ingredientUnitSelectWeight = `
<select class="ingredientMeasurementREPLACEI" onchange="stepConvert(this, REPLACEI)">
                        <option value="g">g</option>
                        <option value="lbs">lbs</option>
					</select>`

//I wrote the awful parts of this at 2:00 AM before the demo. I am sorry for writing this code.
function parseStepText(stepText, id=0){
    console.log("parseStepText ID: " + id);
    stepText = stepText.replace(" cup ", " cups ");
    stepText = stepText.replace(" tablespoon ", "tbsp");
    stepText = stepText.replace(" teaspoon ", "tsp");
    let matches = singleIngredientRE.exec(stepText);
    console.log(matches);
    if(matches !== null){
        console.log(matches[2]);
        if(liquidMeasurements.indexOf(matches[2]) > -1){
            console.log("liquid match");
            console.log('' + matches[2] + '"');
            let selectEl = ingredientUnitSelectLiquid.replace('>' + matches[2] ,"selected>" +  matches[2]);
            console.log(selectEl);
            selectEl = selectEl.replace("REPLACEI", id).replace("REPLACEI", id).replace(matches[2]);
            console.log(matches[2])
            
            let replacement = `<span id="originalSize${id}" hidden>${matches[1]}</span><span id="originalMeasurement${id}" hidden>${matches[2]}</span><span id="ingredientSize${id}">${matches[1]}</span>` + 
                                selectEl + 
                                ` ${matches[3]}`;
            
            stepText = stepText.replace(matches[0], replacement);
        }
        else if(weightMeasurements.indexOf(matches[2]) > -1){
            console.log("weight measurement detected");
            let selectEl = ingredientUnitSelectWeight.replace('>' + matches[2] ,"selected>" +  matches[2]);
            selectEl = selectEl.replace("REPLACEVALUE", matches[2]).replace("REPLACEI", id).replace("REPLACEI", id)
            let replacement = `<span id="originalSize${id}" hidden>${matches[1]}</span><span id="originalMeasurement${id}" hidden>${matches[2]}</span><span id="ingredientSize${id}">${matches[1]}</span>` + 
                selectEl + 
                            ` ${matches[3]}`;
            $(replacement).val(matches[2]);
            stepText = stepText.replace(matches[0], replacement);
        }
        else{
            stepText = stepText.replace(matches[0], matches[1] + "<span hidden></span> " + matches[2] + " " + matches[3])
        }
        console.log("stepText: " + stepText);
        return parseStepText(stepText, id+1);
    }
    return stepText;
    
}


function stepConvert(el, id){
    console.log("ID: " + id);
    let originalUnit = el.parentNode.querySelector("#originalMeasurement" + id).innerHTML;
    let originalSize = el.parentNode.querySelector("#originalSizeML" + id);
    if(originalSize === null){
        $.ajax({
            url: 'http://localhost:8080/api/recipe/scale',
            type: 'post',
            data: JSON.stringify({
                "size": 1,
                "unit": originalUnit
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
                el.parentNode.querySelector("#originalSize" + id).innerHTML = (el.parentNode.querySelector("#originalSize" + id).innerHTML - 0) * (1/data["result"]);
                el.parentNode.querySelector("#originalSize" + id).id = "originalSizeML" + id;
                stepConvert(el, id);
            }
            console.log(data);
        });
    }
    else{
        originalSize = originalSize.innerHTML;
    console.log(el);
    console.log(originalSize);
    let unit = el.value;
    $.ajax({
        url: 'http://localhost:8080/api/recipe/scale',
        type: 'post',
        data: JSON.stringify({
            "size": originalSize,
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
            el.parentNode.querySelector("#ingredientSize" + id).innerHTML = Math.floor(data["result"] * 100) / 100;
        }
        console.log(data);
    });
    }
    
}

/*
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
}*/