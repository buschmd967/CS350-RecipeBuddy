package org.hamr.RecipeBuddy.models;

import lombok.Data;

@Data
public class Step {
    
    private String stepText;

    private int timer; //in seconds

    private String videoURL;
}
