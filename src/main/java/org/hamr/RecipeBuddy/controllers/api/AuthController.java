package org.hamr.RecipeBuddy.controllers.api;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.hamr.RecipeBuddy.models.ERole;
import org.hamr.RecipeBuddy.models.Role;
import org.hamr.RecipeBuddy.models.User;
import org.hamr.RecipeBuddy.payload.request.LoginRequest;
import org.hamr.RecipeBuddy.payload.request.SignupRequest;
import org.hamr.RecipeBuddy.payload.response.JwtResponse;
import org.hamr.RecipeBuddy.payload.response.StatusResponse;
import org.hamr.RecipeBuddy.repository.RoleRepository;
import org.hamr.RecipeBuddy.repository.UserRepository;
import org.hamr.RecipeBuddy.security.jwt.JwtUtils;
import org.hamr.RecipeBuddy.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Value("${hamr.app.enableAdminRegistraton}")
    private boolean enableAdminRegistration;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(sanitize(loginRequest.getUsername()), loginRequest.getPassword()));
            
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                                        .map(item -> item.getAuthority())
                                        .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                                                userDetails.getId(),
                                                userDetails.getUsername(),
                                                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        String username = sanitize(signUpRequest.getUsername());
        if(userRepository.existsByUsername(username)){
            return ResponseEntity.badRequest()
                    .body(new StatusResponse(true, "Username is already taken!"));
        }

        //Create new user's account
        User user = new User(username,
                                encoder.encode(signUpRequest.getPassword()));


        user.setDietaryRestrictions(signUpRequest.getDietaryRestrictions());
        user.setOwnedAppliances(signUpRequest.getOwnedAppliances());
        user.setImage(signUpRequest.getPicture());
        //Roles stuff that I don't understand
        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if(strRoles == null){
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if(enableAdminRegistration && role.equals("admin")) {
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                }
                else{
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new StatusResponse(false, "User registered successfully!"));
    }

    private static String sanitize(String string){
        return string.replace("<", "&lt;").replace(">","&gt;").replace("&","&amp;");
        
    }
}
