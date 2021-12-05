package org.hamr.RecipeBuddy.models;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "recipes")
@Data
public class Recipe {
    @Id
    private String id;

    @NotBlank
    @Size(max=80)
    private String name;

    @NotBlank
    @Size(max=20)
    private String author;

    @NotBlank
    @Size(max=40)
    private String displayAuthor;

    private String[] dietaryRestrictions;

    private String[] appliances;

    private String[] otherTags;

    private IngredientWithMeasurement[] ingredients;
    
    @DBRef
    @NotEmpty
    @NotNull
    private List<Comment> comments;

    private List<Rating> allRating;

    private Step[] steps;

    private float rating;

    private short difficulty;

    private String image;

    private short servings;

    //Time to cook in seconds
    private int cookTime;

    private Boolean isPrivate;

    public Recipe(String name, String author){
        this.isPrivate = false;
        this.name = name;
        this.author = author;
        this.comments = new ArrayList<>();
        this.allRating = new ArrayList<>();
    }

    public String getName(){
        return name;
    }
    
    public void setDietaryRestrictions(String[] dietaryRestrictions){
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public String[] getDietaryRestrictions(){
        return dietaryRestrictions;
    }

    public void setAppliances(String[] appliances){
        this.appliances = appliances;
    }

    public String[] getAppliances(){
        return appliances;
    }

    public void setOtherTags(String[] otherTags){
        this.otherTags = otherTags;
    }

    public String[] getOtherTags(){
        return otherTags;
    }

    public void setRating(float rating){
        this.rating = rating;
    }

    public float getRating(){
        return rating;
    }

    public void setDifficulty(short difficulty){
        this.difficulty = difficulty;
    }

    public short getDifficulty(){
        return difficulty;
    }

    public void setImage(String image){
        this.image = image;
    }

    public String getImage(){
        return image;
    }

    public void setServings(short servings){
        this.servings = servings;
    }
    
    public short getServings(){
        return servings;
    }

    public void setCookTime(int cookTime){
        this.cookTime = cookTime;
    }

    public int getCookTime(){
        return cookTime;
    }

    public void setComments(List<Comment> comments){
        this.comments = comments;
    }

    public List<Comment> getComments(){
        return comments;
    }
    public void setAllRating(List<Rating> allRating){
        this.allRating = allRating;
    }

    public List<Rating> getAllRating(){
        return allRating;
    }
    
    public String getAuthor(){
        return author;
    }

    public void setAuthor(String author){
        this.author = author;
    }

    public void setIngrediensts(IngredientWithMeasurement[] ingredients){
        this.ingredients = ingredients;
    }

    public IngredientWithMeasurement[] getIngredients(){
        return ingredients;
    }

    public void setIsPrivate(boolean isPrivate){
        this.isPrivate = isPrivate;
    }

    public boolean getIsPrivate(){
        return isPrivate;
    }
}
