package org.hamr.RecipeBuddy.repository;

import java.lang.StackWalker.Option;
import java.util.Optional;

import org.hamr.RecipeBuddy.models.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecipeRepository extends MongoRepository<Recipe, String>{
    Optional<Recipe> findByName(String name);
    Optional<Recipe> findByNameAndAuthor(String name, String author);

    
}
