package org.hamr.RecipeBuddy.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeFindByParametersRequest {
    private String[] ingredients;
    private String[] appliances;
    private String[] dietaryRestrictions;
    private String[] otherTags;
    
}
