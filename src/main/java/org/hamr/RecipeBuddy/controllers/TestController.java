package org.hamr.RecipeBuddy.controllers;

import org.hamr.RecipeBuddy.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/test")
public class TestController {

    @Autowired
	private JwtUtils jwtUtils;

    @GetMapping("/all")
	public String allAccess(Model model) {
        model.addAttribute("test", "all");
		return "test";
	}

    @GetMapping("/user")
    public String user(@CookieValue("jwt") String jwt, Model model){
        if(jwtUtils.validateJwtToken(jwt)){
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            model.addAttribute("test", username);
            return "test";
        }
        model.addAttribute("test", "invalid or non-existant token");
        return "test";
    }
    
}
