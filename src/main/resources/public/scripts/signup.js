var allowedFileTypes = ["image/png"];

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
     let error = true;
     for(let filetype of allowedFileTypes){
         if(file.type == filetype){
             error = false;
             break;
         }
     }
     if(error){//TODO: add error thingy
         return null;
     }
     
     let promise = getBase64(file);
    //  console.log(result);
     return await promise;

 }

 function viewImage(){
    getPicture().then( data => $("#profileImage").attr("src", data));
 }