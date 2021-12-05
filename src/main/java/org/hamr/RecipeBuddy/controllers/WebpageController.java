package org.hamr.RecipeBuddy.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebpageController {

    @GetMapping("/addRecipe")
    public String addRecipe(){
        return "addRecipe";
    }

    @GetMapping("/login")
	public String login() {
		return "login";
	}

    @GetMapping("/searchRecipe")
    public String searchRecipe(){
        return "searchRecipe";
    }

    @GetMapping("/signup")
    public String signup(){
        return "signup";
    }

    @GetMapping("/viewRecipe")
    public String viewRecipe(){
        return "viewRecipe";
    }

    @GetMapping("/cookRecipe")
    public String cookRecipe(){
        return "cookRecipe";
    }

    @GetMapping("/pantry")
    public String myPantry(){
        return "myPantry";
    }

    @GetMapping("/homepage")
    public String homepage(){
        return "homepage";
    }
}
