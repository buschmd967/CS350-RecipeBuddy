package org.hamr.RecipeBuddy.controllers.api;

import org.hamr.RecipeBuddy.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.util.StringUtils;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class APITestController {
	@Autowired
	private JwtUtils jwtUtils;

	@GetMapping("/all")
	public String allAccess() {
		return "Public Content.";
	}
	
	@GetMapping("/user")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public String userAccess(@RequestHeader("Authorization") String headerAuth) {
		
		if(StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")){
			String username = jwtUtils.getUserNameFromAuthHeader(headerAuth);
			if(username != null)
				return username;
			return "Invalid Token";
		}
		return "Invalid header. The 'Authorization' header should be in the format 'Bearer [jwt]'\nI'm not sure how an unauthenticated user would get here...";
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public String adminAccess() {
		return "Has Admin Permissions";
	}
}