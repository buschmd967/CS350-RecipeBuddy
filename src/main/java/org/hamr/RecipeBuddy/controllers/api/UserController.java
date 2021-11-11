package org.hamr.RecipeBuddy.controllers.api;

import java.util.Arrays;
import java.util.Optional;

import org.hamr.RecipeBuddy.models.User;
import org.hamr.RecipeBuddy.payload.response.MessageResponse;
import org.hamr.RecipeBuddy.repository.UserRepository;
import org.hamr.RecipeBuddy.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
            return ResponseEntity.ok(new MessageResponse("Could not find user"));
        }
        User user = possibleUser.get();

        //Get dietaryRestrictions
        String[] newDietaryRestrictions;
        String[] dietaryRestrictions = user.getDietaryRestrictions();
        if(dietaryRestrictions != null){
            int dietaryRestrictionsSize = dietaryRestrictions.length;
            newDietaryRestrictions = Arrays.copyOf(dietaryRestrictions, dietaryRestrictionsSize + 1);
            newDietaryRestrictions[dietaryRestrictionsSize] = newDietaryRestriction;
        }
        else{
            newDietaryRestrictions = new String[] {newDietaryRestriction};
        }

        //Update user
        user.setDietaryRestrictions(newDietaryRestrictions);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("DietaryRestriction Added")); 
    }

    @PostMapping("/removeDietaryRestriction")
    public ResponseEntity<?> removeDietaryRestriction(
        @RequestParam(value="dietaryRestriction") String targetDietaryRestriction,
        @RequestHeader("Authorization") String headerAuth
        ){

        //Get User
        String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);
        Optional<User> possibleUser = userRepository.findByUsername(username);
        if(!possibleUser.isPresent()){
            return ResponseEntity.ok(new MessageResponse("Could not find user"));
        }
        User user = possibleUser.get();

        //get dietary restrictions
        String[] dietaryRestrictions = user.getDietaryRestrictions();
        int dietaryRestrictionsSize = dietaryRestrictions.length;
        if(dietaryRestrictions == null){
            return ResponseEntity.ok(new MessageResponse("Could not remove, no dietary restrictions found for user"));
        }

        //find index of restriction
        int targetIndex = -1;
        for(int i = 0; i<dietaryRestrictionsSize; i++){
            if(dietaryRestrictions[i].equals(targetDietaryRestriction)){
                targetIndex = i;
                break;
            }
        }
        if(targetIndex == -1){
            return ResponseEntity.ok(new MessageResponse("Could not find specified dietary restriction."));
        }

        String[] newDietaryRestrictions = new String[dietaryRestrictionsSize-1];

        for(int i = 0; i < targetIndex; i++){
            newDietaryRestrictions[i] = dietaryRestrictions[i];
        }

        for(int i=targetIndex+1; i < dietaryRestrictionsSize; i++){
            newDietaryRestrictions[i-1] = dietaryRestrictions[i];
        }

        user.setDietaryRestrictions(newDietaryRestrictions);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("DietaryRestriction Removed"));
    }
}
