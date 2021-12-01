var ingredientTemplate;
var applianceTemplate;
var dietaryRestrictionTemplate;
var stepTemplate;

$(document).ready(function() {
    
    let c = $.cookie("jwt");
    if(c === undefined){
        document.location="/login?redir=addRecipe";
    }

    ingredientTemplate = $("#ingredientInputs").clone();
    ingredientTemplate.children(".ingredientName").val("");
    ingredientTemplate.children(".ingredientAmmount").val("");

    applianceTemplate = $("#applianceInputs").clone();
    applianceTemplate.children(".appliance").val("");

    dietaryRestrictionTemplate = $("#dietaryRestrictionInputs").clone();
    dietaryRestrictionTemplate.children(".dietaryRestriction").val("");

    stepTemplate = $("#stepInputs").clone();
    stepTemplate.children(".stepText").val("");
});

function addRecipe() {
    $.ajax({
        url: 'http://localhost:8080/api/recipe',
        type: 'post',
        headers: {"Authorization": "Bearer " + $.cookie("jwt")},
        data: JSON.stringify({
            "name": $("#recipeName").val(),
            "servings": $("#servingSize").val(), //newly added
            "totalTime": $("#totalCookTime").val(), //newly added
            "ingredients": getIngredients(),
            "appliances": getEntries(".appliance"),
            "dietaryRestrictions": getEntries(".dietaryRestriction"),
            "isPrivate": $("#isPrivate").prop("checked"),
            "steps": getSteps(),
            "difficulty": $("#difficultyNumber").val() //not sure if correct id name
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
                    document.location="/login?redir=addRecipe";
                }
            }
        } 
    }).then(function(data){
        console.log("Data:");
        console.log(data);
        $("#status").text(data.message);
    });
}

function getEntries(query){
    let out = [];
    $(query).each(function() 
        { 
            out.push( $(this).val() );
        }
    );
    return out;
}

function getIngredients(){
    let out = [];
    let ingredients = [];
    let measurements = [];
    let sizes = [];
    
    $(".ingredientAmmount").each(function(){
        if($(this).val() == ""){
            sizes.push(1);
        }
        else{
            sizes.push($(this).val());
        }
    });

    $(".ingredientMeasurement").each(function(){
        measurements.push($(this).val());
    });

    $(".ingredientName").each(function(){
        ingredients.push($(this).val());
    });
    
    for(let i = 0; i < ingredients.length; i++){
        if(ingredients[i] != ""){
            out.push({
                "name": ingredients[i],
                "measurement": measurements[i],
                "size": sizes[i]
            });
        }
    }

    return out;
}

function getSteps(){
    let out = [];
    let stepTexts = [];
    let stepTimes = [];
    let videoURLs = [];

    $(".stepText").each(function(){
        stepTexts.push($(this).val());
    });

    $(".stepTime").each(function(){
        if($(this).val() == ""){
            stepTimes.push(-1);
        }
        else{
            stepTimes.push(parseStepTime($(this).val()));
        }
    });

    $(".videoURL").each(function(){
        videoURLs.push($(this).val());
    });

    for(let i = 0; i < stepTexts.length; i++){
        if(stepTexts[i] != ""){
            out.push({
                "stepText": stepTexts[i],
                "timer": stepTimes[i],
                "videoURL": videoURLs[i]
            });
        }
    }

    return out;
}

function parseStepTime(stepTimeString){
    let splitString = stepTimeString.split(":");
    console.log(splitString);
    if(splitString.length == 3){
        return (splitString[0] - 0) * 3600 + (splitString[1] - 0)* 60 + (splitString[2] - 0);
    }
    else if(splitString.length == 2){
        console.log("" + splitString[0] + "* 60 + " + splitString[1]);
        return (splitString[0] - 0)* 60 + (splitString[1] - 0);
    }
    else if(splitString.length == 1){
        return (splitString[0] - 0);
    }
    console.log("ERROR IN PARSESTEPTIME: " + stepTimeString);
}

function addIngredient(){
    // let original = $("#ingredientInputs");
    // let clone = original.clone();
    // clone.children(".ingredient").val("");
    $("#ingredientSection").append(ingredientTemplate.clone());
}

function addAppliance(){
    // let original = $("#ingredientInputs");
    // let clone = original.clone();
    // clone.children(".ingredient").val("");
    $("#applianceSection").append(applianceTemplate.clone());
}

function addDietaryRestriction(){
    // let original = $("#ingredientInputs");
    // let clone = original.clone();
    // clone.children(".ingredient").val("");
    $("#dietaryRestrictionSection").append(dietaryRestrictionTemplate.clone());
}

function addStep(){
    // let original = $("#ingredientInputs");
    // let clone = original.clone();
    // clone.children(".ingredient").val("");
    $("#stepSection").append(stepTemplate.clone());
}

function removeEntry(a){
    a.parentNode.parentNode.removeChild(a.parentNode);
}