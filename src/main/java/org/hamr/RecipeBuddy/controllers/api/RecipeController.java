package org.hamr.RecipeBuddy.controllers.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.util.StringUtils;

import java.util.Set;

import javax.validation.Valid;

import org.hamr.RecipeBuddy.models.Recipe;
import org.hamr.RecipeBuddy.payload.request.RecipeAddRequest;
import org.hamr.RecipeBuddy.payload.response.MessageResponse;
import org.hamr.RecipeBuddy.repository.RecipeRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/recipe")
public class RecipeController {

    @Autowired
    RecipeRepository recipeRepository;

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody RecipeAddRequest recipeAddRequest){
        

        recipeRepository.save(parseAddRequest(recipeAddRequest));
        return ResponseEntity.ok(new MessageResponse("Recipe Added"));
    }

    private Recipe parseAddRequest(RecipeAddRequest recipeAddRequest){
        Recipe recipe = new Recipe(
            recipeAddRequest.getName(),
            recipeAddRequest.getAuthor()
        );
        Set<String> dietaryRestrictionsSet = recipeAddRequest.getDietaryRestrictions();


        String[] dietaryRestrictions = new String[dietaryRestrictionsSet.size()];
        dietaryRestrictionsSet.toArray(dietaryRestrictions);

        recipe.setDietaryRestrictions(dietaryRestrictions);


        return recipe;
    }

    
}
