package org.hamr.RecipeBuddy.payload.response;

import java.util.List;

import org.hamr.RecipeBuddy.models.Ingredient;
import org.hamr.RecipeBuddy.models.IngredientWithMeasurement;
import org.hamr.RecipeBuddy.models.User;

import lombok.Data;

@Data
public class UserInfoResponse {

    private List<String> dietaryRestrictions;
    private List<IngredientWithMeasurement> ingredients;
    private List<Ingredient> shoppingCart;
    private List<String> utensils;
    private List<String> appliances;

    public UserInfoResponse(User user){
        this.dietaryRestrictions = user.getDietaryRestrictions();
        this.ingredients = user.getOwnedIngredients();
        this.shoppingCart = user.getShoppingCartIngredients();
        this.utensils = user.getUtensils();
        this.appliances = user.getOwnedAppliances();
    }
    
}
