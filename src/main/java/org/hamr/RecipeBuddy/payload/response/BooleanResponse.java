package org.hamr.RecipeBuddy.payload.response;

import lombok.Data;

@Data
public class BooleanResponse {
    Boolean result;

    public BooleanResponse(Boolean result){
        this.result = result;
    }
}
