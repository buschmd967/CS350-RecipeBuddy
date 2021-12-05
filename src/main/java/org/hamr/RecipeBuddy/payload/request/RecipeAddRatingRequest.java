package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

public class RecipeAddRatingRequest {

    private double recipeRating;

    @NotBlank
    private String recipeName;

    @NotBlank
    private String recipeAuthor;


    public double getRecipeRating(){
        return recipeRating;
    }
   
    public String getRecipeName(){
        return recipeName;
    }
    public String getRecipeAuthor(){
        return recipeAuthor;
    }

}
