package org.hamr.RecipeBuddy.payload.request;

import java.util.Set;

import javax.validation.constraints.NotBlank;

public class RecipeAddRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String author;

    private Set<String> dietaryRestrictions;


    public String getName(){
        return name;
    }

    public String getAuthor(){
        return author;
    }

    public Set<String> getDietaryRestrictions(){
        return dietaryRestrictions;
    }
}
