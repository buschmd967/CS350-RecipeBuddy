var ingredientTemplate;
var applianceTemplate;
var dietaryRestrictionTemplate;
var otherTagTemplate;
var mealTypeTemplate;
var stepTemplate;

var timeRegex = /(?:(\d+):)?(\d+):(\d+)/g

var allowedFileTypes = ["image/png", "image/jpg"];

//THIS IS NOT BEST PRACTICE, BUT IT WORKS
const noImage = "data:image/png;base64,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"

$(document).ready(function() {

    let c = $.cookie("jwt");
    if(c === undefined){
        document.location="/login?redir=addRecipe";
    }

    getUsername(c).then(data =>{
        username = data["message"];
    });

    ingredientTemplate = $("#ingredientInputs").clone();
    ingredientTemplate.children(".ingredientName").val("");
    ingredientTemplate.children(".ingredientAmmount").val("");

    applianceTemplate = $("#applianceInputs").clone();
    applianceTemplate.children(".appliance").val("");

    dietaryRestrictionTemplate = $("#dietaryRestrictionInputs").clone();
    dietaryRestrictionTemplate.children(".dietaryRestriction").val("");

    otherTagTemplate = $("#otherTagInputs").clone();
    otherTagTemplate.children(".otherTag").val("");

    mealTypeTemplate = $("#mealTypeInputs").clone();

    stepTemplate = $("#stepInputs").clone();
    stepTemplate.children(".stepText").val("");
    getPicture().then(viewImage());
});



function getUsername(c){
    return $.ajax({
            url: 'http://localhost:8080/api/user/username',
            type: 'post',
            headers: {"Authorization": "Bearer " + $.cookie("jwt")},
            xhrFields: { withCredentials:true },
            contentType: 'application/json',
            success: function(response){
                console.log("SUCCESS");
            },
            complete: function(xhr, textStatus) {
                console.log(xhr.status);
            } 
        });
}

function addRecipe() {
    getPicture().then(
        data => {let image = data;
        $.ajax({
            url: 'http://localhost:8080/api/recipe',
            type: 'post',
            headers: {"Authorization": "Bearer " + $.cookie("jwt")},
            data: JSON.stringify({
                "name": $("#recipeName").val(),
                "servings": $("#servingSize").val(),
                "cookTime": parseStepTime($("#totalCookTime").val()), 
                "ingredients": getIngredients(),
                "appliances": getEntries(".appliance"),
                "otherTags": getOtherTags(), 
                "dietaryRestrictions": getEntries(".dietaryRestriction"),
                "isPrivate": $("#isPrivate").prop("checked"),
                "steps": getSteps(),
                "image": image,
                "difficulty": $("#difficultyNumber").val()
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
    });
}


// from https://stackoverflow.com/questions/47195119/how-to-capture-filereader-base64-as-variable
function getBase64(file) {
    return new Promise(function (resolve, reject) {
         let reader = new FileReader();
         reader.onload = function () { resolve(reader.result); };
         reader.onerror = reject;
         reader.readAsDataURL(file);
     });
}


async function getPicture(){
    let file = $("#fileToUpload").prop("files")[0];
    if(file === undefined){
        return noImage;
    }
    let error = true;
    for(let filetype of allowedFileTypes){
        if(file.type == filetype){
            error = false;
            break;
        }
    }
    if(error){
        return noImage;
    }
    
    return getBase64(file);
}

function viewImage(){
    getPicture().then(data => {
        $("#recipeImage").attr("src", data);
    })
}

function getOtherTags(){
    let out = [("" + $("#recipeName").val()).toLowerCase()];
    $(".otherTag").each(function() 
        { 
            if($(this).val() != "");
            out.push( ("" + $(this).val()).toLowerCase() );
        }
    );

    out.push( ("" + username).toLowerCase() );


    return out;
}

function getEntries(query){
    let out = [];
    $(query).each(function() 
        { 
            out.push( ( "" + $(this).val()).toLowerCase() );
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
    // let videoURLs = [];

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

    // $(".videoURL").each(function(){
    //     videoURLs.push($(this).val());
    // });

    for(let i = 0; i < stepTexts.length; i++){
        if(stepTexts[i] != ""){
            out.push({
                "stepText": stepTexts[i],
                "timer": stepTimes[i]//,
                // "videoURL": videoURLs[i]
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
    $("#ingredientSection").append(ingredientTemplate.clone());
}

function addAppliance(){
    $("#applianceSection").append(applianceTemplate.clone());
}

function addDietaryRestriction(){
    $("#dietaryRestrictionSection").append(dietaryRestrictionTemplate.clone());
}

function addOtherTag(){
    $("#otherTagsSection").append(otherTagTemplate.clone());
}

function addMealType(){
    $("#mealTypeSection").append(mealTypeTemplate.clone());
}


function addStep(){
    $("#stepSection").append(stepTemplate.clone());
}

function removeEntry(a){
    a.parentNode.parentNode.removeChild(a.parentNode);
}

function toggleTimer(button){
    console.log(button.innerHTML);
    console.log(button.parentNode.querySelector(".stepTime"));
    if(button.innerHTML == "Add Timer"){
        // button.innerHTML = "Remove Timer";
        timerActive(button, true);
        // button.parentNode.querySelector(".stepTime").hidden = false;
    }
    else{
        // button.innerHTML = "Add Timer";
        timerActive(button, false);
        // button.parentNode.querySelector(".stepTime").hidden = true;
        // button.parentNode.querySelector(".stepTime").value = "";
    }
    
}

function timerActive(input, isActive){
    if(isActive){
        input.parentNode.querySelector("#timerButton").innerHTML = "Remove Timer";
        input.parentNode.querySelector(".stepTime").hidden = false;
    }
    else{
        input.parentNode.querySelector("#timerButton").innerHTML = "Add Timer";
        input.parentNode.querySelector(".stepTime").hidden = true;
        input.parentNode.querySelector(".stepTime").value = "";



    }
}


function checkForTime(input){
    // console.log("check for time")
    // console.log(input.value);
    let match = timeRegex.exec(input.value);
    console.log(match);
    if(match === null){

        return false;
    }
    else{
        let hrs = match[1];
        if(hrs === undefined){
            hrs = "";
        }
        let mins = match[2];
        let secs = match[3];

        hrs = hrs.padStart(2, "0");
        mins = mins.padStart(2, "0");
        secs = secs.padStart(2, "0");
        timerActive(input, true);
        input.parentNode.querySelector(".stepTime").value = hrs+":"+mins+":"+secs;
        return(hrs+":"+mins+":"+secs);
    }
}
