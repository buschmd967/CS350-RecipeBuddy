package org.hamr.RecipeBuddy.payload.request;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RecipeSearchRequest {
    @NotBlank
    private String searchString;

    private boolean dietaryRestrictions = true;
    private boolean appliances = true;

}
