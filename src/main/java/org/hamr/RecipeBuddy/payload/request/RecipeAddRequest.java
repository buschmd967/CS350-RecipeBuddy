package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

public class RecipeAddRequest {

    @NotBlank
    private String name;

    private String[] dietaryRestrictions;

    private String[] ingredients;

    private String[] otherTags;

    private String[] appliances;

    public String getName(){
        return name;
    }

    public String[] getDietaryRestrictions(){
        return dietaryRestrictions;
    }

    public String[] getIngredients(){
        return ingredients;
    }

    public String[] getOtherTags(){
        return otherTags;
    }

    public String[] getAppliances(){
        return appliances;
    }
}
