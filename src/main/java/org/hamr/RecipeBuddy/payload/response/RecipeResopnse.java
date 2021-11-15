package org.hamr.RecipeBuddy.payload.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import org.hamr.RecipeBuddy.models.Comment;
import org.hamr.RecipeBuddy.models.Recipe;

@Setter
@Getter
public class RecipeResopnse {
    private String name;

    private String author;

    private String[] dietaryRestrictions;

    private String[] appliances;

    private String[] otherTags;

    private String[] ingredients;

    private List<Comment> comments;

    //private Step[] steps

    private short rating;

    private short difficulty;

    private String image;

    private short servings;

    //Time to cook in seconds
    private int cookTime;

    public RecipeResopnse(Recipe recipe){
        this.name = recipe.getName();
        this.author = recipe.getAuthor();
        this.dietaryRestrictions = recipe.getDietaryRestrictions();
        this.appliances = recipe.getAppliances();
        this.otherTags = recipe.getOtherTags();
        this.ingredients = recipe.getIngredients();
        // this.comments = recipe.getComments().toArray(new Comment[0]);
        this.comments = recipe.getComments();
        this.rating = recipe.getRating();
        this.difficulty = recipe.getDifficulty();
        this.image = recipe.getImage();
        this.servings = recipe.getServings();
        this.cookTime = recipe.getCookTime();
    }
}
