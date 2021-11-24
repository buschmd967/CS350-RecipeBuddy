package org.hamr.RecipeBuddy.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import org.hamr.RecipeBuddy.models.Ingredient;

public interface IngredientRepository extends MongoRepository<Ingredient, String> {
    Boolean existsByName(String name);
}
