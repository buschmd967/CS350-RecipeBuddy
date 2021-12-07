package org.hamr.RecipeBuddy.payload.request;

import java.util.List;
import java.util.Set;

import javax.validation.constraints.*;

import org.hamr.RecipeBuddy.models.IngredientWithMeasurement;

import lombok.Data;
 
@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(min = 3, max = 50)
    private String displayName;
    
    private Set<String> roles;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    private String picture;
    private String[] dietaryRestrictions;
    private String[] ownedAppliances;
    private List<IngredientWithMeasurement> ownedIngredients;
  
    public String getUsername() {
        return username;
    }
 
    public void setUsername(String username) {
        this.username = username;
    }
 
    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Set<String> getRoles() {
      return this.roles;
    }
    
    public void setRole(Set<String> roles) {
      this.roles = roles;
    }
}