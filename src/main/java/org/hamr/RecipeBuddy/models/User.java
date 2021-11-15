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

@Document(collection = "users")
public class User {
  @Id
  private String id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 120)
  private String password;

  @DBRef
  private Set<Role> roles = new HashSet<>();

  private String imageURL;

  private List<String> dietaryRestrictions;

  @DBRef
  private List<Recipe> savedRecipes;

  public User() {
  }

  public User(String username, String password) {
    this.username = username;
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

  public List<String> getDietaryRestrictions(){
    return dietaryRestrictions;
  }
}
