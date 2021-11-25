package org.hamr.RecipeBuddy.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RecipeSearchController {
    
    @GetMapping("/searchRecipe")
    public String searchRecipe(){
        return "searchRecipe";
    }
}
