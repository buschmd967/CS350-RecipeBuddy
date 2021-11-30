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
}
