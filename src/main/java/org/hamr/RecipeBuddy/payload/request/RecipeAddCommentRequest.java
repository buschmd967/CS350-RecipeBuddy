package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

public class RecipeAddCommentRequest {
    @NotBlank
    // Possibly want to set a max size here.
    private String content;

    @NotBlank
    private String recipeName;

    @NotBlank
    private String recipeAuthor;

    private short type;

    public String getContent(){
        return content;
    }

    public short getType(){
        return type;
    }

    public String getRecipeName(){
        return recipeName;
    }

    public String getRecipeAuthor(){
        return recipeAuthor;
    }

}
