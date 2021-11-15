package org.hamr.RecipeBuddy.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


/**
 * You may have noticed that this class appears to have no methods or constructors.
 * This is the only way after ~3 hours of working I was able to properly add comments to a recipe.
 * The @Data tag automatically creates getters, setters, and constructors. I don't know what it adds, 
 *  but it adds the right constructors.
 * 
 * The @requiredArgsConstructor forces a constructor to be added that includes any @nonNull tagged properties.
 * 
 * I hope we never need to touch this again
 * - @buschmd967 
 */

@Document(collection = "comments")
@Data
@RequiredArgsConstructor
public class Comment {
    @Id
    private String id;

    @NonNull
    @NotBlank
    String content;

    @NonNull
    @NotBlank
    @Size(max=20)
    private String author;

    private short type; //0 - normal comment

    private int rating;

    // private String[] usersLiked;

    // public Comment(String content, String author, short type, int rating){
    //     this.content = content;
    //     this.author = author;
    //     this.type = type;
    //     this.rating = rating;
    //     // this.usersLiked = usersLiked;
    // }

    // public Comment(String content, String author){
    //     this.content = content;
    //     this.author = author;
    //     this.type = type;
    // }

    // public Comment(String content, String author){
    //     this(content, author, (short) 0);
    // }

    // public void setContent(String content){
    //     this.content = content;
    // }

    // public String getContent(){
    //     return content;
    // }

    // public void setRating(int rating){
    //     this.rating = rating;
    // }

    // public int getRating(){
    //     return rating;
    // }

    // public void setAuthor(String author){
    //     this.author = author;
    // }

    // public String getAuthor(){
    //     return author;
    // }

    // public void setUsersLiked(String[] usersLiked){
    //     this.usersLiked = usersLiked;
    // }

    // public String[] getUsersLiked(){
    //     return usersLiked;
    // }

}
