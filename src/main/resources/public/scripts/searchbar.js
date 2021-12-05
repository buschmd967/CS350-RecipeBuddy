$(document).ready(function() {
    $('#searchText').keydown(function (e) {
        if (e.keyCode == 13) {
            document.location = "searchRecipe?searchString=" + $("#searchText").val();
        }
    });
});

function updateSearch(){
    let searchText = $("#searchText").val();
    $("#searchButton").attr("href", "searchRecipe?searchString="+searchText);
}