package org.hamr.RecipeBuddy.models;

import lombok.Data;

@Data
public class IngredientWithMeasurement {
    private String name;
    private String measurement;
    private float size;
}
