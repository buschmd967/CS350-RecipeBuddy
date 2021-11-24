package org.hamr.RecipeBuddy.controllers.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hamr.RecipeBuddy.models.Comment;
import org.hamr.RecipeBuddy.models.QuickRecipe;
import org.hamr.RecipeBuddy.models.Recipe;
import org.hamr.RecipeBuddy.payload.request.RecipeAddCommentRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeAddRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeDeleteRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeFindByParametersRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeGetRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeSearchRequest;
import org.hamr.RecipeBuddy.payload.response.MessageResponse;
import org.hamr.RecipeBuddy.payload.response.RecipeResopnse;
import org.hamr.RecipeBuddy.payload.response.RecipiesResponse;
import org.hamr.RecipeBuddy.payload.response.StatusResponse;
import org.hamr.RecipeBuddy.repository.CommentRepository;
import org.hamr.RecipeBuddy.repository.QuickRecipeRepository;
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

    @Autowired
    QuickRecipeRepository quickRecipeRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    @PostMapping("")
    public ResponseEntity<?> add(@Valid @RequestBody RecipeAddRequest recipeAddRequest, @RequestHeader("Authorization") String headerAuth){
        
        String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);

        Optional<Recipe> possibleRecipe = recipeRepository.findByNameAndAuthor(recipeAddRequest.getName(), username);
        if(possibleRecipe.isPresent()){
            return ResponseEntity.ok(new StatusResponse(true, "Recipe of that name by that user already exists."));
        }

        //Get Parameters
        String[] dietaryRestrictions = recipeAddRequest.getDietaryRestrictions();
        String[] appliances = recipeAddRequest.getAppliances();
        String[] ingredients = recipeAddRequest.getIngredients();
        String[] otherTags = recipeAddRequest.getOtherTags();

        Recipe recipe = new Recipe(recipeAddRequest.getName(), username);
        recipe.setDietaryRestrictions(dietaryRestrictions);
        recipe.setAppliances(appliances);
        recipe.setOtherTags(otherTags);
        recipe.setIngrediensts(ingredients);

        QuickRecipe quickRecipe = new QuickRecipe(recipe, dietaryRestrictions, appliances, ingredients, otherTags);

        recipeRepository.save(recipe);
        quickRecipeRepository.save(quickRecipe);

        return ResponseEntity.ok(new StatusResponse(false, "Recipe Added"));
    }

    @DeleteMapping("")
    public ResponseEntity<?> delete(@Valid @RequestBody RecipeDeleteRequest recipeDeleteRequest, @RequestHeader("Authorization") String headerAuth){
        String userName = jwtUtils.getUserNameFromAuthHeader(headerAuth);
        String recipeName = recipeDeleteRequest.getName();

        //Try to get Recipe
        Optional<Recipe> possibleRecipe = recipeRepository.findByNameAndAuthor(recipeName, userName);
        
        //If query returned nothing
        if(!possibleRecipe.isPresent()){
            return ResponseEntity.ok(new StatusResponse(true, "Recipe Not Found"));
        }

        //Get recipe from Optional object and delete it from the collection
        Recipe recipe = possibleRecipe.get();
        Optional<QuickRecipe> possibleQuickRecipe = quickRecipeRepository.findByRecipe(recipe);
        List<Comment> comments = recipe.getComments();

        recipeRepository.delete(recipe);
        if(possibleQuickRecipe.isPresent())
            quickRecipeRepository.delete(possibleQuickRecipe.get());
        
        //delete comments
        for( Comment c : comments){
            commentRepository.delete(c);
        }

        return ResponseEntity.ok(new StatusResponse(false, "Recipe Deleted"));
    }

    @PostMapping("/comment")
    public ResponseEntity<?> addComment(@Valid @RequestBody RecipeAddCommentRequest recipeAddCommentRequest, 
                                        @RequestHeader("Authorization") String headerAuth)
    {

        //Get parameters
        String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);
        String recipeName = recipeAddCommentRequest.getRecipeName();
        String recipeAuthor = recipeAddCommentRequest.getRecipeAuthor();        
        logger.info("Got Parameters");

        //Get recipe
        Optional<Recipe> possibleRecipe = recipeRepository.findByNameAndAuthor(recipeName, recipeAuthor);
        logger.info("Getting recipe: {} by {}", recipeName, recipeAuthor);
        if(!possibleRecipe.isPresent()){
            return ResponseEntity.ok(new StatusResponse(true, "Could not find Recipe"));
        }
        logger.info("Got Recipe");

        //Save comment and get reference for recipe
        Comment newComment = new Comment(recipeAddCommentRequest.getContent(), 
                                        username,
                                        recipeAddCommentRequest.getType());
        commentRepository.save(newComment);

        
        Recipe recipe = possibleRecipe.get();
        List<Comment> currentComments = recipe.getComments();
        
        if(currentComments != null){
            logger.info("Type of comments: {}", currentComments.getClass());
            currentComments.add(newComment);
        }
        else{
            logger.info("Type of comments: NULL");
            return ResponseEntity.ok(new StatusResponse(true, "Could not add comment, comments[] is null."));

        }
        recipe.setComments(currentComments);
        recipeRepository.save(recipe);
        return ResponseEntity.ok(new StatusResponse(false, "Added Comment"));
    }

    @GetMapping("")
    public ResponseEntity<?> getRecipe(@Valid @RequestBody RecipeGetRequest recipeGetRequest, @RequestHeader("Authorization") String headerAuth){
        
        
        //Get Parameters
        String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);
        String author = recipeGetRequest.getAuthor();
        String recipeName = recipeGetRequest.getName();

        logger.info("Getting Recipe");
        //Get Recipe
        Optional<Recipe> possibleRecipe = recipeRepository.findByNameAndAuthor(recipeName, author);
        if(!possibleRecipe.isPresent()){
            return ResponseEntity.ok(new StatusResponse(true, "Could not find recipe"));
        }
        Recipe recipe = possibleRecipe.get();

        logger.info("Sending Response");
        return ResponseEntity.ok(new RecipeResopnse(recipe));

    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@Valid @RequestBody RecipeSearchRequest recipeSearchRequest, @RequestHeader("Authorization") String headerAuth){
        RecipeFindByParametersRequest recipeFindByParametersRequest = parseSearchString(recipeSearchRequest.getSearchString());




        return findByParameters(recipeFindByParametersRequest, headerAuth);
    }

    private RecipeFindByParametersRequest parseSearchString(String searchString){
        RecipeFindByParametersRequest result = new RecipeFindByParametersRequest();
        //TODO

        return result;
    }


    @GetMapping("/findByParameters")
    public ResponseEntity<?> findByParameters(@Valid @RequestBody RecipeFindByParametersRequest recipeFindByParametersRequest, @RequestHeader("Authorization") String headerAuth){
        String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);

        // List<QuickRecipe> possibleRecipies = quickRecipeRepository.findByAllCategories(
        //     recipeFindByParametersRequest.getDietaryRestrictions(),
        //     recipeFindByParametersRequest.getAppliances(), 
        //     recipeFindByParametersRequest.getIngredients(), 
        //     recipeFindByParametersRequest.getOtherTags());

        Object[] dietaryRestrictions = recipeFindByParametersRequest.getDietaryRestrictions();
        Object[] appliances = recipeFindByParametersRequest.getAppliances();
        Object[] ingredients = recipeFindByParametersRequest.getIngredients();
        Object[] otherTags = recipeFindByParametersRequest.getOtherTags();

        Query query = new Query();
        if(dietaryRestrictions.length > 0)
            query.addCriteria(Criteria.where("dietaryRestrictions").all(dietaryRestrictions));
        if(appliances.length > 0)
            query.addCriteria(Criteria.where("appliances").all(appliances));
        if(ingredients.length > 0)
            query.addCriteria(Criteria.where("ingredients").all(ingredients));
        if(otherTags.length > 0)
            query.addCriteria(Criteria.where("otherTags").all(otherTags));
        
        List<QuickRecipe> possibleRecipies = mongoTemplate.find(query, QuickRecipe.class);
        
        if(possibleRecipies.isEmpty())
            return ResponseEntity.ok(new StatusResponse(true, "Could not find any matching recipies"));

        List<Recipe> recipies = new ArrayList<>();
        for(QuickRecipe quickRecipe : possibleRecipies){
            //TODO: add private check
            recipies.add(quickRecipe.getRecipe());
        }
        return(ResponseEntity.ok(new RecipiesResponse(recipies)));
    }
}
