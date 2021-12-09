var recipe;
var currentStepIndex = 0;
var alarmAudio = new Audio('/cookAlarm.mp3');
//Taken from https://www.youtube.com/watch?v=8_EQneRq52c
var alarmGoingOff = false;



var liquidIngredients = ["mL", "cups", "tsp", "tbsp", "qt", "gal", "oz"];
var ingredientUnitSelectLiquid = `
<select class="ingredientMeasurement" onchange="cookRecipechangeMeasurement(this)" value="REPLACEVALUE">
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

var ingredientUnitSelectDummy = `<select class="ingredientMeasurement" onchange="cookRecipechangeMeasurement(this)" value="mL" hidden>
</select>`
$(document).ready(function() {








    let params = new URLSearchParams(window.location.search);
    let name = $.cookie("viewRecipeName");
    let author = $.cookie("viewRecipeAuthor");
    console.log(name);
    console.log(author);

    $.ajax({    //Get recipe
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
    }).then(function(data){ //Once we have the recipe, display it
        recipe = data;
        console.log(data);

        $("#name").append(recipe["name"]);
        $("#author").append(recipe["author"]);

        displayRating();
        
        displayDifficulty(); //holly added

        viewImage(); //holly added

        fillIngTable();


        let cookTime = recipe["cookTime"];
        if(cookTime == 0){
            $("#cookTime").append("No cook time specified.");
        }
        else{
            $("#cookTime").append(`Total Cook Time: ${timerDisplay(cookTime)}`); 
        }

        let steps = recipe["steps"];
        for(let step of steps){
            let stepText = parseStepText(step["stepText"]); //call from stepScale.js THIS IS PROBABLY BAD PRACTICE
            let timer = step["timer"];
            let stepHTML;
            if(timer == -1){
                stepHTML = 
                `<div class="step" onclick="setCurrentStep(this)">
                    <p class="stepText">${stepText}<p>
                </div>`;
            }
            else{
                stepHTML = 
            `<div class="step" onclick="setCurrentStep(this)">
                <p class="stepText">${stepText}<p>
                <div class="timer">
                <p class="timerTimeMS" hidden >${timer}</p>
                <p class="timerControl" hidden>stopped</p>
                <p class="timerTimeDisplay" >${timerDisplay(timer)}</p>
                <button class="startTimerButton" onclick="mainTimerButton(this)">Start</button> 
                <button class="stopTimerButton" onclick="stopTimer(this)">Reset</button>
                </div>
            </div>`;
            }
            
            $("#steps").append(stepHTML);
            console.log(step);
        }
        if($(".step").length > 0){
            $(".step")[0].classList.add("currentStep");
        }
        else{
            $(".step").classList.add("currentStep");

        }

        /* THERE COULD BE SOMETHING ADDED HERE TO ADD STYLING TO THE CURRENT STEP CLASS */

    }).then(data => {
        if($(".step").length == 1){
            $(".nextStepButton").html("Finish");
        }
        
    })
});



function cookRecipechangeMeasurement(input){
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
            if(data["result" != Infinity])
                console.log(input.parentNode);
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

//from https://stackoverflow.com/questions/4611754/javascript-convert-seconds-to-a-date-object
function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

function pauseTimer(button){
    alarmGoingOff = false;
    if(button.parentNode.querySelector(".timerControl").innerHTML == "running"){
        setTimerStatus(button, "paused");
        button.innerHTML = "resume";
    }
    else if(button.parentNode.querySelector(".timerControl").innerHTML == "paused")
        setTimerStatus(button, "running");


}

function stopTimer(button){
    setTimerStatus(button, "stopped");
    let resetTime = button.parentNode.querySelector(".timerTimeMS").innerHTML;
    button.parentNode.querySelector(".timerTimeDisplay").innerHTML = timerDisplay(resetTime);
    button.parentNode.querySelector(".startTimerButton").innerHTML = "Start";
    alarmGoingOff = false;
}

function setTimerStatus(button, status){
    button.parentNode.querySelector(".timerControl").innerHTML = status;

}

async function mainTimerButton(button){
    alarmGoingOff = false;
    let buttonText = button.innerHTML;
    if(buttonText == "Start"){
        button.innerHTML = "Pause";
        let timerTimeTag = button.parentNode.querySelector(".timerTimeDisplay");
        let timerTime = button.parentNode.querySelector(".timerTimeMS").innerHTML;
        let alarmState = false;
        button.parentNode.querySelector(".timerControl").innerHTML = "running";
        let x = setInterval(function() {

            if(alarmState){
                if(!alarmGoingOff){
                    clearInterval(x);
                }
                else{
                        alarmAudio.play();
                }
                
            }
            else{ //Normal timer stuff
    
                if(button.parentNode.querySelector(".timerControl").innerHTML == "stopped"){
                    clearInterval(x);
                }
                else if(button.parentNode.querySelector(".timerControl").innerHTML == "running"){
                    timerTime -= 1;
                    console.log(timerTime);
                    timerTimeTag.innerHTML = timerDisplay(timerTime);
                }
        
                
        
                if(timerTime <= 0){
                    alarmGoingOff = true;
                    alarmState = true;
                }
        }
    
           
          }, 1000)
    }
    else if(buttonText == "Pause"){
        setTimerStatus(button, "paused");
        button.innerHTML = "Resume";
    }
    else if(buttonText == "Resume"){
        setTimerStatus(button, "running");
        button.innerHTML = "Pause";
    }
    // console.log(startTimerButton.parentNode.parentNode.removeChild(a.parentNode);
    // console.log(startTimerButton.parentNode.querySelector(".timerTimeMS").innerHTML);
  
}


function nextStep(button){

    if(button.innerHTML != "Finish"){
        $(".step")[currentStepIndex].classList.remove("currentStep");
        $(".step")[currentStepIndex].classList.add("completedStep");
        currentStepIndex++;
        if(currentStepIndex + 1 == $(".step").length){
            button.innerHTML = "Finish"
        }
        $(".step")[currentStepIndex].classList.add("currentStep");
    }
    else{
        document.location = "/viewRecipe";
    }
}

function setCurrentStep(stepEl){
    let steps = $(".step");
    for(let i = 0; i < steps.length; i++){
        steps[i].classList.remove("currentStep");
        steps[i].classList.remove("completedStep");
    }

    
    // console.log(allSteps);
    classToAdd = "complatedStep";
    for(let i = 0; i < steps.length; i++){
        steps[i].classList.add(classToAdd);
        if(steps[i] == stepEl){
            steps[i].classList.add("currentStep");
            currentStepIndex = i;
            if(currentStepIndex == steps.length - 1){
                $(".nextStepButton").html("Finish");
            }
            else{
                $(".nextStepButton").html("Next Step");

            }
            break;
        }
    }
    
}


function getRecipe(){
    console.log(recipe);
}

function displayRating(){
    let rating = Math.round(recipe["rating"] * 100) / 100;
    if(rating == -1){
        rating = "Not yet rated.";
    }
    $("#displayRating").html("Rating: " + rating);
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