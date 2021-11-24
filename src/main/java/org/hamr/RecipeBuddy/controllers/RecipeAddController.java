package org.hamr.RecipeBuddy.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RecipeAddController {
 
    @GetMapping("/addRecipe")
    public String addRecipe(){
        return "addRecipe";
    }
}
