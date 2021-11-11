package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

public class RecipeDeleteRequest {
    @NotBlank
    String name;

    public String getName(){
        return name;
    }
}
