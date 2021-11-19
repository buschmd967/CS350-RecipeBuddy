package org.hamr.RecipeBuddy.payload.response;

public class StatusResponse {
    private boolean error;
    private String message;
    
    public StatusResponse(boolean error, String message){
        this.error = error;
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

    public void setMessage(String message){
        this.message = message;
    }

    public boolean getError(){
        return error;
    }

    public void setError(boolean error){
        this.error = error;
    }
}
