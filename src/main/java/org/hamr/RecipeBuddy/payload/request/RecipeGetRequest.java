package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

public class RecipeGetRequest {
    @NotBlank
    String name;

    @NotBlank
    String author;

    public String getName(){
        return name;
    }   

    public String getAuthor(){
        return author;
    }
}
