package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

public class RecipeAddRatingRequest {
    @NotBlank
    private short recipeRating;

    @NotBlank
    private String recipeName;

    @NotBlank
    private String recipeAuthor;


    public short getRecipeRating(){
        return recipeRating;
    }

   
    public String getRecipeName(){
        return recipeName;
    }
    public String getRecipeAuthor(){
        return recipeAuthor;
    }

}
