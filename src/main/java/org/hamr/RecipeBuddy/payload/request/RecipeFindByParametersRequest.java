package org.hamr.RecipeBuddy.payload.request;

import org.hamr.RecipeBuddy.models.Ingredient;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeFindByParametersRequest {
    private Ingredient[] ingredients;
    private String[] appliances;
    private String[] dietaryRestrictions;
    private String[] otherTags;
    private long page = 1;
    
}
