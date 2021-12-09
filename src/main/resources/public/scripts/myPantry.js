var ingredientTemplate = `<td><div class="category">
                                <h3>REPLACE</h3>
                                <button type="button" class="removeButton" onclick="remove(this)">(Remove)</button>
                            </div></td>`


var appliancesTemplate = `<td>
                            <div class="category">
                                <h3>REPLACE</h3>
                                <button type="button" class="removeButton">(Remove)</button>
                            </div>
                        </td>`

var itemTemplate = `<td>
                            <div class="category">
                                <h3>REPLACE</h3>
                            </div>
                        </td>`

$(document).ready(function() {

   /* ingredientTemplate = $("#ingredientInputs").clone();
    ingredientTemplate.children(".ingredientName").val("");
    ingredientTemplate.children(".ingredientAmmount").val("");*/

    let jwt = $.cookie("jwt");
    console.log("jwt: ")
    console.log(jwt);

    let params = new URLSearchParams(window.location.search);
    let name = $.cookie("viewRecipeName");
    let author = $.cookie("viewRecipeAuthor");
    console.log(name);
    console.log(author);

    $.ajax({    //Get recipe
        url: 'http://localhost:8080/api/user/getInfo',
        type: 'post',
        headers: {"Authorization": "Bearer " + $.cookie("jwt")},
        data: JSON.stringify({
            "ingredients": getIngredients()
        }),
        xhrFields: { withCredentials:true },
        contentType: 'application/json',
        success: function(response){
            console.log("SUCCESS");
        },
        complete: function(xhr, textStatus) {
            if(xhr.status != 200){
                console.log(xhr)
                if(xhr.status == 401){
                    document.location = "/homepage";
                }
            }

        } 
    }).then(data => {
        console.log(data);
        let ingredients = data["ingredients"];
        displayIngredients(ingredients);
        let appliances = data["appliances"];
        displayAppliances(appliances);
        let shoppingCart = data["shoppingCart"];
        displayShoppingCart(shoppingCart);

        getUsername(jwt).then(data =>{
            username = data["message"];
            $("#usernamePantry").html("Welcome to your pantry, " + username);
        });
    });
});

/* This just removes from view. It will return when the page is reloaded. We will need to remove from database eventually */
function remove(el){
    el.parentNode.remove(el);
}


function displayIngredients(ingredients){
    $("#ingredientTable").empty();
    for(let ingredient of ingredients){
        let info = ingredient["size"] + " " + ingredient["measurement"] + " " + ingredient["name"];
        let html = ingredientTemplate.replace("REPLACE", info);
        $("#ingredientTable").append(html);
    }

}




function addIngredient(){
    /*$("#ingredientSection").append(ingredientTemplate.clone());*/
    getIngredients();

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







function displayAppliances(appliances){
    $("#appliancesTable").empty();
    for(let appliance of appliances){
        let html = ingredientTemplate.replace("REPLACE", appliance);
        $("#appliancesTable").append(html);
    }

}

function displayShoppingCart(shoppingCart){
    $("#shoppingCartTable").empty();
    if(shoppingCart.length == 0){
        $("#shoppingCartTable").append(`<h3>Cook recipes to add items to shopping cart automatically.</h3>`);

    }
    for(let item of shoppingCart){
        let html = itemTemplate.replace("REPLACE", item);
        $("#shoppingCartTable").append(html);
    }
}
