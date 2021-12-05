package org.hamr.RecipeBuddy.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "rating")
@Data
public class Rating {
    @Id
    private String id;
    
    private String author;
    private double value;
    
    public Rating(short value,String author){
        this.value = value;
        this.author = author;


    }
    public String getAuthor(){
        return author;
    }
    public double getValue(){
        return value;
    }
    public void setValue(short value){
        this.value = value;
    }
    public void setAuthor(String author){
        this.author = author;
    }



}
