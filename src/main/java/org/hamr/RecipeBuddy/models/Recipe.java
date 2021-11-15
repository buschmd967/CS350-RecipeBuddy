package org.hamr.RecipeBuddy.models;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import io.github.kaiso.relmongo.annotation.CascadeType;
import io.github.kaiso.relmongo.annotation.FetchType;
import io.github.kaiso.relmongo.annotation.JoinProperty;
import io.github.kaiso.relmongo.annotation.OneToMany;


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

    private String[] ingredients;

    @DBRef
    @NotEmpty
    @NotNull
    private List<Comment> comments;

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
        this.comments = new ArrayList<>();
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

    public void setComments(List<Comment> comments){
        this.comments = comments;
    }

    public List<Comment> getComments(){
        return comments;
    }
    
    public String getAuthor(){
        return author;
    }

    public void setAuthor(String author){
        this.author = author;
    }

    public void setIngrediensts(String[] ingredients){
        this.ingredients = ingredients;
    }

    public String[] getIngredients(){
        return ingredients;
    }
}