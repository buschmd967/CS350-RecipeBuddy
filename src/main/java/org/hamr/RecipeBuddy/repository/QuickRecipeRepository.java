package org.hamr.RecipeBuddy.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

import org.hamr.RecipeBuddy.models.QuickRecipe;
import org.hamr.RecipeBuddy.models.Recipe;

public interface QuickRecipeRepository extends MongoRepository<QuickRecipe, String>{
    Optional<QuickRecipe> findByRecipe(Recipe recipe);
    
    @Query(value = "{ 'dietaryRestrictions' : {$all : [?0] }}")
    public List<QuickRecipe> findAnyOfTheseValues(String[] dietaryRestrictionValues);

    @Query(value = "{ 'dietaryRestrictions' : {$all : ?0}, 'appliances' : {$all : ?1}, 'ingredients' : {$all : ?2}, 'otherTags' : {$all : ?3}}")
    public List<QuickRecipe> findByAllCategories(String[] dietaryRestrictions, String[] appliances, String[] ingredients, String[] otherTags);

}
