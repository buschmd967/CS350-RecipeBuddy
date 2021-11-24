package org.hamr.RecipeBuddy.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "ingredients")
@Data
public class Ingredient {
    @Id
    private String id;

    private String name;
    private float size;

    public Ingredient(String name, float size){
        this.name = name;
        this.size = size;
    }

}
