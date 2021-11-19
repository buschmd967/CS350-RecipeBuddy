package org.hamr.RecipeBuddy.controllers.api;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.hamr.RecipeBuddy.models.User;
import org.hamr.RecipeBuddy.payload.response.StatusResponse;
import org.hamr.RecipeBuddy.repository.UserRepository;
import org.hamr.RecipeBuddy.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins="*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/addDietaryRestriction")
    public ResponseEntity<?> addDietaryRestriction(
        @RequestParam(value="dietaryRestriction") String newDietaryRestriction,
        @RequestHeader("Authorization") String headerAuth
        ){
            
        //Get User
        String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);
        Optional<User> possibleUser = userRepository.findByUsername(username);
        if(!possibleUser.isPresent()){
            return ResponseEntity.ok(new StatusResponse(true, "Could not find user"));
        }
        User user = possibleUser.get();

        //Get dietaryRestrictions
        List<String> dietaryRestrictions = user.getDietaryRestrictions();
        if(dietaryRestrictions != null){
            dietaryRestrictions.add(newDietaryRestriction);
        }
        else{
            return ResponseEntity.ok(new StatusResponse(true, "Could not add dietary restriction, dietaryRestrictions was null"));
        }

        //Update user
        user.setDietaryRestrictions(dietaryRestrictions);
        userRepository.save(user);

        return ResponseEntity.ok(new StatusResponse(false, "DietaryRestriction Added")); 
    }

    @DeleteMapping("/removeDietaryRestriction")
    public ResponseEntity<?> removeDietaryRestriction(
        @RequestParam(value="dietaryRestriction") String targetDietaryRestriction,
        @RequestHeader("Authorization") String headerAuth
        ){

        //Get User
        String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);
        Optional<User> possibleUser = userRepository.findByUsername(username);
        if(!possibleUser.isPresent()){
            return ResponseEntity.ok(new StatusResponse(true, "Could not find user"));
        }
        User user = possibleUser.get();

        //Get dietaryRestrictions
        List<String> dietaryRestrictions = user.getDietaryRestrictions();
        if(dietaryRestrictions == null){
            return ResponseEntity.ok(new StatusResponse(true, "Could not remove, no dietary restrictions found for user"));
        }

        //Try to remove
        if(!dietaryRestrictions.remove(targetDietaryRestriction)){
            return ResponseEntity.ok(new StatusResponse(true, "Could not find specified dietary restriction."));
        }

        //Save
        user.setDietaryRestrictions(dietaryRestrictions);
        userRepository.save(user);

        return ResponseEntity.ok(new StatusResponse(false, "DietaryRestriction Removed"));
    }
}
