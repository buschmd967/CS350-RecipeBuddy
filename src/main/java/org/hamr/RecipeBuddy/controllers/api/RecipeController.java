package org.hamr.RecipeBuddy.controllers.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Update;
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

import java.util.Optional;
import java.util.Set;

import org.hamr.RecipeBuddy.models.Recipe;
import org.hamr.RecipeBuddy.payload.request.RecipeAddRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeDeleteRequest;
import org.hamr.RecipeBuddy.payload.response.MessageResponse;
import org.hamr.RecipeBuddy.repository.RecipeRepository;
import org.hamr.RecipeBuddy.security.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/recipe")
public class RecipeController {

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);
    
    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RecipeRepository recipeRepository;

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody RecipeAddRequest recipeAddRequest){
        

        recipeRepository.save(parseAddRequest(recipeAddRequest));
        return ResponseEntity.ok(new MessageResponse("Recipe Added"));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@Valid @RequestBody RecipeDeleteRequest recipeDeleteRequest, @RequestHeader("Authorization") String headerAuth){
        String userName = jwtUtils.getUserNameFromAuthHeader(headerAuth);
        String recipeName = recipeDeleteRequest.getName();

        //Try to get Recipe
        Optional<Recipe> possibleRecipe = recipeRepository.findByNameAndAuthor(recipeName, userName);
        
        //If query returned nothing
        if(!possibleRecipe.isPresent()){
            return ResponseEntity.ok(new MessageResponse("Recipe Not Found"));
        }

        //Get recipe from Optional object and delete it from the collection
        Recipe recipe = possibleRecipe.get();
        recipeRepository.delete(recipe);

        return ResponseEntity.ok(new MessageResponse("Recipe Deleted"));
    }

    private Recipe parseAddRequest(RecipeAddRequest recipeAddRequest){
        Recipe recipe = new Recipe(
            recipeAddRequest.getName(),
            recipeAddRequest.getAuthor()
        );

        recipe.setDietaryRestrictions(recipeAddRequest.getDietaryRestrictions());

        return recipe;
    }

    // @PostMapping("/addComment")
    // public ResponseEntity<?> addComment(@Valid @RequestBody RecipeAddCommentRequest recipeAddCommentRequest, @RequestHeader("Authorization") String headerAuth){
    // }
    
}
