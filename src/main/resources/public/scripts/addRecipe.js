var ingredientTemplate;
var applianceTemplate;
var dietaryRestrictionTemplate;

$(document).ready(function() {
    
    let c = $.cookie("jwt");
    if(c === undefined){
        document.location="/login?redir=addRecipe";
    }

    ingredientTemplate = $("#ingredientInputs").clone();
    ingredientTemplate.children(".ingredient").val("");

    applianceTemplate = $("#applianceInputs").clone();
    applianceTemplate.children(".appliance").val("");

    dietaryRestrictionTemplate = $("#dietaryRestrictionInputs").clone();
    dietaryRestrictionTemplate.children(".dietaryRestriction").val("");
});

function addRecipe() {
    $.ajax({
        url: 'http://localhost:8080/api/recipe',
        type: 'post',
        headers: {"Authorization": "Bearer " + $.cookie("jwt")},
        data: JSON.stringify({
            "name": $("#recipeName").val(),
            "ingredients": getEntries(".ingredient"),
            "appliances": getEntries(".appliance"),
            "dietaryRestrictions": getEntries(".dietaryRestriction")
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

function removeEntry(a){
    a.parentNode.parentNode.removeChild(a.parentNode);
}