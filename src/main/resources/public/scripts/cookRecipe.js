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
                <p class="timerTimeDisplay" >${timerDisplay(timer)}</p>
                <button class="startTimerButton" onclick="startTimer(this)">Start</button>
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

async function startTimer(startTimerButton){
    // console.log(startTimerButton.parentNode.parentNode.removeChild(a.parentNode);
    // console.log(startTimerButton.parentNode.querySelector(".timerTimeMS").innerHTML);
    let timerTimeTag = startTimerButton.parentNode.querySelector(".timerTimeDisplay");
    let timerTime = startTimerButton.parentNode.querySelector(".timerTimeMS").innerHTML;
    console.log(timerTime);
    
    let x = setInterval(function() {
        timerTime -= 1;
        console.log(timerTime);
        timerTimeTag.innerHTML = timerDisplay(timerTime);

        if(timerTime < 0){
            clearInterval(x);
        }

/*
        // Get today's date and time
        var now = new Date().getTime();
          
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
          
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
        // Output the result in an element with id="demo"
        document.getElementById("demo").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";
          
        // If the count down is over, write some text 
        if (distance < 0) {
          clearInterval(x);
          document.getElementById("demo").innerHTML = "EXPIRED";
        }*/
        // console.log("test");
      }, 1000)
}





function getRecipe(){
    console.log(recipe);
}

