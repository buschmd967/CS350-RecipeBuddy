package org.hamr.RecipeBuddy.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;

    String content;

    @NotBlank
    @Size(max=20)
    String author;

    short type; //0 - normal comment

    int rating;

    public Comment(String content, String author, short type){
        this.content = content;
        this.author = author;
        this.type = type;
    }

    public Comment(String content, String author){
        this(content, author, (short) 0);
    }

    public void setContent(String content){
        this.content = content;
    }

    public String getContent(){
        return content;
    }

    public void setRating(int rating){
        this.rating = rating;
    }

    public int getRating(){
        return rating;
    }

    public void setAuthor(String author){
        this.author = author;
    }

    public String getAuthor(){
        return author;
    }

}
