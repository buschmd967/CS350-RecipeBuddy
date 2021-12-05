package org.hamr.RecipeBuddy.models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "users")
@Data
public class User {
  @Id
  private String id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 40)
  private String displayName;

  @NotBlank
  @Size(max = 120)
  private String password;

  @DBRef
  private Set<Role> roles = new HashSet<>();

  private String image;

  private List<String> dietaryRestrictions;

  private List<String> ownedAppliances;

  @DBRef
  private List<Recipe> savedRecipes;

  private List<IngredientWithMeasurement> ownedIngredients;

  private List<Ingredient> shoppingCartIngredients;

  private List<String> utensils;

  public User() {
  }

  public User(String username, String displayName, String password) {
    this.username = username;
    this.displayName = displayName;
    this.password = password;
    this.dietaryRestrictions = new ArrayList<>();
    this.savedRecipes = new ArrayList<>();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

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

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public void setDietaryRestrictions(List<String> dietaryRestrictions){
    this.dietaryRestrictions = dietaryRestrictions;
  }

  public void setDietaryRestrictions(String[] dietaryRestrictions){
    this.dietaryRestrictions = new ArrayList<>();
    for(int i = 0; i < dietaryRestrictions.length; i++){
      this.dietaryRestrictions.add(dietaryRestrictions[i]);
    }
  }

  public List<String> getDietaryRestrictions(){
    return dietaryRestrictions;
  }

  public void setOwnedAppliances(String[] ownedAppliances){
    this.ownedAppliances = new ArrayList<>();
    for(int i = 0; i < ownedAppliances.length; i++){
      this.ownedAppliances.add(ownedAppliances[i]);
    }
  }

}
