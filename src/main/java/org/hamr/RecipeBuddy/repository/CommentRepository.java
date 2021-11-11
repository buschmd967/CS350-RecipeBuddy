package org.hamr.RecipeBuddy.repository;

import org.hamr.RecipeBuddy.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
    
}
