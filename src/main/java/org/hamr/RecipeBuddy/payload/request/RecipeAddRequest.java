package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

import org.hamr.RecipeBuddy.models.Ingredient;

public class RecipeAddRequest {

    @NotBlank
    private String name;

    private String[] dietaryRestrictions;

    private Ingredient[] ingredients;

    private String[] otherTags;

    private String[] appliances;

    public String getName(){
        return name;
    }

    public String[] getDietaryRestrictions(){
        return dietaryRestrictions;
    }

    public Ingredient[] getIngredients(){
        return ingredients;
    }

    public String[] getOtherTags(){
        return otherTags;
    }

    public String[] getAppliances(){
        return appliances;
    }
}
