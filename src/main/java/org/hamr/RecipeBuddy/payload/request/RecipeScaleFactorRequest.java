package org.hamr.RecipeBuddy.payload.request;

import lombok.Data;

@Data
public class RecipeScaleFactorRequest {

    private double size;

    private String unit;
    
}
