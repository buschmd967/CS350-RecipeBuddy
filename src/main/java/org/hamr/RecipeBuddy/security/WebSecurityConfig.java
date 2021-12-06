package org.hamr.RecipeBuddy.security;


import org.hamr.RecipeBuddy.security.jwt.AuthEntryPointJwt;
import org.hamr.RecipeBuddy.security.jwt.AuthTokenFilter;
import org.hamr.RecipeBuddy.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import io.github.kaiso.relmongo.config.EnableRelMongo;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
    // securedEnabled = true,
    // jsr250Enabled = true,
    prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter{
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwTokenFilter(){
        return new AuthTokenFilter();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception{
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception{
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception{
		http.cors().and().csrf().disable()
			.exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
			.authorizeRequests().antMatchers("/api/test/**").permitAll()
            .antMatchers("/test/**").permitAll()
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers("/api/recipe/scale").permitAll()
            .antMatchers("/api/recipe/get").permitAll()
            .antMatchers("/api/recipe/search").permitAll()
            .antMatchers("/api/recipe/trending").permitAll()
            .antMatchers("/api/**").authenticated()
            .antMatchers("/auth/**").permitAll()
            .antMatchers("/scripts/**").permitAll()
            .antMatchers("/**").permitAll();
            // .antMatchers("/login").permitAll()
            // .anyRequest().authenticated();
            // http.formLogin()
            //     .loginPage("/login")
            //     .permitAll();
        
        
        // http.headers().xssProtection();

        http.addFilterBefore(authenticationJwTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
