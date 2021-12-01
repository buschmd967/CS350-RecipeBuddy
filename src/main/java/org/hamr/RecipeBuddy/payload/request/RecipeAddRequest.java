package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

import org.hamr.RecipeBuddy.models.IngredientWithMeasurement;
import org.hamr.RecipeBuddy.models.Step;

import lombok.Data;

@Data
public class RecipeAddRequest {

    @NotBlank
    private String name;

    private short servings; //newly added

    private int cookTime; //newly added

    private String[] dietaryRestrictions;

    private IngredientWithMeasurement[] ingredients;

    private String[] otherTags;

    private String[] appliances;

    private Step[] steps;

    private short difficulty; //newly added

    private Boolean isPrivate;

    public String getName(){
        return name;
    }

    public short getServings(){ //newly added
        return servings; 
    }

    public int getCookTime(){ //newly added
        return cookTime;
    }

    public String[] getDietaryRestrictions(){
        return dietaryRestrictions;
    }

    public IngredientWithMeasurement[] getIngredients(){
        return ingredients;
    }

    public String[] getOtherTags(){
        return otherTags;
    }

    public String[] getAppliances(){
        return appliances;
    }

    public short getDifficulty(){ //newly added
        return difficulty;
    }

    public Boolean getPrivate(){ //newly added - saw it was missing, not sure if needed
        return isPrivate;
    }
}

