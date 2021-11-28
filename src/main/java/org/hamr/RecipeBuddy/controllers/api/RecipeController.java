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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.hamr.RecipeBuddy.models.Comment;
import org.hamr.RecipeBuddy.models.Ingredient;
import org.hamr.RecipeBuddy.models.IngredientWithMeasurement;
import org.hamr.RecipeBuddy.models.QuickRecipe;
import org.hamr.RecipeBuddy.models.Recipe;
import org.hamr.RecipeBuddy.payload.request.RecipeAddCommentRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeAddRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeDeleteRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeFindByParametersRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeGetRequest;
import org.hamr.RecipeBuddy.payload.request.RecipeSearchRequest;
import org.hamr.RecipeBuddy.payload.response.RecipeResopnse;
import org.hamr.RecipeBuddy.payload.response.RecipiesResponse;
import org.hamr.RecipeBuddy.payload.response.StatusResponse;
import org.hamr.RecipeBuddy.repository.CommentRepository;
import org.hamr.RecipeBuddy.repository.IngredientRepository;
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
    IngredientRepository ingredientRepository;

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
        IngredientWithMeasurement[] ingredientswithMeasurements = recipeAddRequest.getIngredients();
        String[] otherTags = recipeAddRequest.getOtherTags();
        Ingredient[] ingredients = new Ingredient[ingredientswithMeasurements.length];

        for(int i = 0; i<ingredientswithMeasurements.length; i++){
            IngredientWithMeasurement ingredientWithMeasurement = ingredientswithMeasurements[i];
            ingredients[i] = new Ingredient(ingredientWithMeasurement.getName(), ingredientWithMeasurement.getSize() * getMetricScaleFactor(ingredientWithMeasurement.getMeasurement()));
        }

        Recipe recipe = new Recipe(recipeAddRequest.getName(), username);
        recipe.setDietaryRestrictions(dietaryRestrictions);
        recipe.setAppliances(appliances);
        recipe.setOtherTags(otherTags);
        recipe.setIngrediensts(ingredients);
        recipe.setIsPrivate(recipeAddRequest.getIsPrivate());

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

        if(recipe.getIsPrivate() && !(username.equals(recipe.getAuthor())) ){
            return ResponseEntity.ok(new StatusResponse(true, "This recipe is private and not owned by '" + username + "'"));
        }

        logger.info("Sending Response");
        return ResponseEntity.ok(new RecipeResopnse(recipe));

    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@Valid @RequestBody RecipeSearchRequest recipeSearchRequest, @RequestHeader("Authorization") String headerAuth){
        logger.info("Search api");
        RecipeFindByParametersRequest recipeFindByParametersRequest = parseSearchString(recipeSearchRequest.getSearchString());




        return findByParameters(recipeFindByParametersRequest, headerAuth);
    }

    private RecipeFindByParametersRequest parseSearchString(String searchString){
        logger.info("Parsing search string");
        RecipeFindByParametersRequest result = new RecipeFindByParametersRequest();
        
        String[] tags = searchString.split(",");


        //Ingredients
        //format: "2c water" for 2 cups of water 
        Pattern ingredient = Pattern.compile("(\\d+)(\\w+)\\s+(.+)");
        Matcher ingredientMatcher;

        List<Ingredient> ingredients = new ArrayList<>();
        List<String> dietaryRestrictions = new ArrayList<>();
        List<String> appliances = new ArrayList();
        List<String> otherTags = new ArrayList();

        for(int i = 0; i < tags.length; i++){
            ingredientMatcher = ingredient.matcher(tags[i]);
            //check if ingredient
            if(ingredientMatcher.find()){
                // logger.info(ingredientMatcher.group());
                // searchString = searchString.replace(ingredientMatcher.group(), "");
                // logger.info("group count: {}",ingredientMatcher.groupCount());
                // for(int i = 0; i < ingredientMatcher.groupCount()+1; i++){
                //     logger.info("group {}: {}", i, ingredientMatcher.group(i));
                // }
                Float servingSize = Float.parseFloat(ingredientMatcher.group(1)) * getMetricScaleFactor(ingredientMatcher.group(2));
                logger.info("group 1: {}", ingredientMatcher.group(1));
                logger.info("searching for: {} serving size: {}", ingredientMatcher.group(3), servingSize);
                ingredients.add(new Ingredient(ingredientMatcher.group(3), servingSize));

                
            }
            else{
                //TODO: dietaryRestrictions, otherTags, appliances
            }
        }

        // logger.info("searchString: {}", searchString);


        result.setIngredients(ingredients.toArray(new Ingredient[0]));
        result.setDietaryRestrictions(dietaryRestrictions.toArray(new String[0]));
        result.setAppliances(appliances.toArray(new String[0]));
        result.setOtherTags(otherTags.toArray(new String[0]));


        return result;
    }

    private int getMetricScaleFactor(String measurement){ //TODO: finish adding all relevant measurements
        //Standard liquid: mL
        //https://www.thespruceeats.com/metric-conversions-for-cooking-2355731


        measurement = measurement.replace(".","");

        //handle uppercase-specific units

        //tablespoon
        if(measurement.equals("T")){
            return 15;
        }

        switch(measurement.toLowerCase()){

            //teaspoon
            case "t":
            case "tsp":
            case "ts":
            case "tspn":
            case "teaspoon":
            case "teaspoons":
            return 5;

            //tablespoon
            case "tablespoon":
            case "tablespoons":
            case "tb":
            case "tbl":
            case "tbs":
            case "tbsp":
            return 15;

            //cups
            case "c":
            case "cup":
            case "cups":
            return 250;

            case "pinch":
            return 1;

            //quart
            case "quart":
            case "quarts":
            case "qt":
            return 950;

            //pint
            case "pint":
            case "pints":
            case "pt":
            return 500;

            //gallon
            case "gallon":
            case "gallons":
            case "gal":

            // GRAMS **********

            // ounce (this is not fluid ounces)
            case "ounce":
            case "ounces":
            case "oz":
            return 20;

            //pounds
            case "pound":
            case "pounds":
            case "ib":
            case "ibs":
            return 450;

            default:
            return 0;
        }
    }

    @GetMapping("/TESTSEARCH")
    public ResponseEntity<?> testsearch(){
        List<Ingredient>  ingredients = new ArrayList<>();
        ingredients.add(new Ingredient("sugar", 1));
        ingredients.add(new Ingredient("more sugar", 2));


        Query query = new Query();


        if(!ingredients.isEmpty()){
            Criteria c = Criteria.where("ingredients");
            for(Ingredient ingredient : ingredients){
                c = c.elemMatch(Criteria.where("name").is(ingredient.getName()).and("size").lte(ingredient.getSize()));
            }
            query.addCriteria(c);
        }

        
        // Criteria c2 = c.elemMatch(Criteria.where("name").is("i2").and("size").lte(10));
        // c = Criteria.where("name").is("i2").and("size").lt(10).elemMatch(c);


        // query.addCriteria(Criteria.where("qty").elemMatch(Criteria.where("size").is("M").and("num").gt(50).elemMatch(Criteria.where("num").is(100).and("color").is("green"))));
        

        List<QuickRecipe> quickRecipies = mongoTemplate.find(query, QuickRecipe.class);
        if(quickRecipies.isEmpty()){
            return ResponseEntity.ok(new StatusResponse(true, "Could not find any matching recipies"));
        }

        List<Recipe> recipies = new ArrayList<>();
        for(QuickRecipe qr : quickRecipies){
            recipies.add(qr.getRecipe());
        }

        return(ResponseEntity.ok(new RecipiesResponse(recipies)));
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
        Ingredient[] ingredients = recipeFindByParametersRequest.getIngredients();
        Object[] otherTags = recipeFindByParametersRequest.getOtherTags();

        Query query = new Query();

        //ingredients
        if(ingredients.length > 0){
            Criteria c = Criteria.where("ingredients");
            for(int i = 0; i < ingredients.length; i++){
                //magical telescoping serving-size-matching query
                c = c.elemMatch(Criteria.where("name").is(ingredients[i].getName()).and("size").lte(ingredients[i].getSize())); 
            }
            query.addCriteria(c);
        }

        //everything else
        if(dietaryRestrictions.length > 0)
            query.addCriteria(Criteria.where("dietaryRestrictions").all(dietaryRestrictions));
        if(appliances.length > 0)
            query.addCriteria(Criteria.where("appliances").all(appliances));
        // if(ingredients.length > 0)
            // query.addCriteria(Criteria.where("ingredients").all(ingredients));
        if(otherTags.length > 0)
            query.addCriteria(Criteria.where("otherTags").all(otherTags));
        
        List<QuickRecipe> possibleRecipies = mongoTemplate.find(query, QuickRecipe.class);
        
        if(possibleRecipies.isEmpty())
            return ResponseEntity.ok(new StatusResponse(true, "Could not find any matching recipies"));
        
        List<Recipe> recipies = new ArrayList<>();
        for(QuickRecipe quickRecipe : possibleRecipies){
            Recipe recipe = quickRecipe.getRecipe();
            if(recipe.getIsPrivate() && !(username.equals(recipe.getAuthor()))){ //if private recipe and user is not the author
                continue; //do not add
            }
            recipies.add(quickRecipe.getRecipe());
        }
        if(recipies.isEmpty()){
            return ResponseEntity.ok(new StatusResponse(true, "Could not find any matching recipies"));
        }
        return(ResponseEntity.ok(new RecipiesResponse(recipies)));
    }
}
