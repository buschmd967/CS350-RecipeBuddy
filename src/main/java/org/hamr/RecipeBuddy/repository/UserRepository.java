package org.hamr.RecipeBuddy.repository;

import java.util.Optional;

import org.hamr.RecipeBuddy.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String>{
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);
}
