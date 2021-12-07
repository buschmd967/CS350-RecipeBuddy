package org.hamr.RecipeBuddy.models;

import lombok.Data;

@Data
public class IngredientWithMeasurement {
    private String name;
    private String measurement;
    private double size;

    public IngredientWithMeasurement(String name, double size, String measurement){
        this.name = name;
        this.size = size;
        this.measurement = measurement;
    }
}
