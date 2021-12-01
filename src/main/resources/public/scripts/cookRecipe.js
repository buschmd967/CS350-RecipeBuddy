var recipe;

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

        let steps = recipe["steps"];
        for(let step of steps){
            let stepText = step["stepText"];
            let timer = step["timer"];
            let stepHTML;
            if(timer == -1){
                stepHTML = 
                `<div class="step">
                    <p class="stepText">${stepText}<p>
                </div>`;
            }
            else{
                stepHTML = 
            `<div class="step">
                <p class="stepText">${stepText}<p>
                <div class="timer">
                <p class="timerTimeMS" hidden >${timer}</p>
                <p class="timerControl" hidden>stopped</p>
                <p class="timerTimeDisplay" >${timerDisplay(timer)}</p>
                <button class="startTimerButton" onclick="startTimer(this)">Start</button> 
                <button class="pauseTimerButton" onclick="pauseTimer(this)">Pause</button>
                <button class="stopTimerButton" onclick="stopTimer(this)">Reset</button>
                </div>
            </div>`;
            }
            
            $("#steps").append(stepHTML);
            console.log(step);
        }
    })
});


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
}

function setTimerStatus(button, status){
    button.parentNode.querySelector(".timerControl").innerHTML = status;

}

async function startTimer(startTimerButton){
    // console.log(startTimerButton.parentNode.parentNode.removeChild(a.parentNode);
    // console.log(startTimerButton.parentNode.querySelector(".timerTimeMS").innerHTML);
    let timerTimeTag = startTimerButton.parentNode.querySelector(".timerTimeDisplay");
    let timerTime = startTimerButton.parentNode.querySelector(".timerTimeMS").innerHTML;
    startTimerButton.style.visibility = "hidden";
    startTimerButton.parentNode.querySelector(".timerControl").innerHTML = "running";
    let x = setInterval(function() {

        if(startTimerButton.parentNode.querySelector(".timerControl").innerHTML == "stopped"){
            clearInterval(x);
        }
        else if(startTimerButton.parentNode.querySelector(".timerControl").innerHTML == "running"){
            timerTime -= 1;
            console.log(timerTime);
            timerTimeTag.innerHTML = timerDisplay(timerTime);
        }

        

        if(timerTime < 0){
            //do alarm or something
            clearInterval(x);
        }

       
      }, 1000)
}





function getRecipe(){
    console.log(recipe);
}

