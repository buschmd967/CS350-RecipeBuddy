package org.hamr.RecipeBuddy.security.jwt;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


import org.hamr.RecipeBuddy.security.services.UserDetailsImpl;

import io.jsonwebtoken.*;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${hamr.app.jwtSecret}")
    private String jwtSecret;

    @Value("${hamr.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication){
        
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        //  logger.info("generating JWT token UserDetails: " + userPrincipal.debugString());
        //  logger.info("signing with jwtSecret: {}", jwtSecret);

        return Jwts.builder()
                    .setSubject((userPrincipal.getUsername()))
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
    }

    public String getUserNameFromJwtToken(String token){
        logger.info("getUserNameFromJwtToken==Using signing key: " + jwtSecret);
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    
    public String getUserNameFromAuthHeader(String headerAuth){
        
        String jwt = headerAuth.substring(7, headerAuth.length());
        if(!validateJwtToken(jwt))
            return ""; //No user will have "" as a username. Simplifies recipe isPrivate checks

        return getUserNameFromJwtToken(jwt);
		
    }

    public boolean validateJwtToken(String authToken){
        try{
            // logger.info("validateJwtToken==Using signing key: {}, authToken: {}", jwtSecret, authToken);
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch(ExpiredJwtException e){
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch(UnsupportedJwtException e){
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch(IllegalArgumentException e){
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
