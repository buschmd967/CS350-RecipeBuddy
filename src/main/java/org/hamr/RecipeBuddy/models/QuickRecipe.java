package org.hamr.RecipeBuddy.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "quickRecipes")
@Data
public class QuickRecipe {
    @Id
    private String id;

    @DBRef
    private Recipe recipe;

    private String[] dietaryRestrictions;
    private String[] appliances;
    private Ingredient[] ingredients;
    private String[] otherTags;

    public QuickRecipe(Recipe recipe,
                        String[] dietaryRestrictions,
                        String[] appliances,
                        Ingredient[] ingredients,
                        String[] otherTags){
        this.recipe = recipe;
        this.dietaryRestrictions = dietaryRestrictions;
        this.appliances = appliances;
        this.ingredients = ingredients;
        this.otherTags = otherTags;
    }
}
