package org.hamr.RecipeBuddy.payload.response;

import lombok.Data;

@Data
public class DoubleResponse {
    private double result;

    public DoubleResponse(double result){
        this.result = result;
    }
    
}
