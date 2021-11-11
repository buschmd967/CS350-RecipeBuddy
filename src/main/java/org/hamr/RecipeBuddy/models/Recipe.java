package org.hamr.RecipeBuddy.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "recipes")
public class Recipe {
    @Id
    private String id;

    @NotBlank
    @Size(max=80)
    private String name;

    @NotBlank
    @Size(max=20)
    private String author;

    private String[] dietaryRestrictions;

    private String[] appliances;

    private String[] otherTags;

    //private Comment[] comments

    //private Step[] steps

    private short rating;

    private short difficulty;

    private String image;

    private short servings;

    //Time to cook in seconds
    private int cookTime;

    public Recipe(String name, String author){
        this.name = name;
        this.author = author;
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

    public void setRating(short rating){
        this.rating = rating;
    }

    public short getRating(){
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
}
