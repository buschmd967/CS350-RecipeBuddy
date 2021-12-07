package org.hamr.RecipeBuddy.payload.response;

import java.util.List;

import org.hamr.RecipeBuddy.models.Recipe;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipiesResponse {
    private List<Recipe> recipies;
    private String message="";

    public RecipiesResponse(List<Recipe> recipies){
        this.recipies = recipies;
    }
    
    public RecipiesResponse(List<Recipe> recipies, String message){
        this.recipies = recipies;
        this.message = message;
    }

}
