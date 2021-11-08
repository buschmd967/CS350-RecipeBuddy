package org.hamr.RecipeBuddy.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import org.hamr.RecipeBuddy.models.ERole;
import org.hamr.RecipeBuddy.models.Role;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}
