package org.hamr.RecipeBuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.kaiso.relmongo.config.EnableRelMongo;

@SpringBootApplication
public class RecipeBuddyApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecipeBuddyApplication.class, args);
	}

}
