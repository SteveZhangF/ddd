package app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import app.config.test.StatelessAuthenticationFilter;
import app.config.test.TokenAuthenticationService;
import app.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	@Qualifier("customUserDetailsService")
	UserDetailsService userDetailsService;

	private TokenAuthenticationService tokenAuthenticationService;

	@Autowired
	public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService);
		System.out.println(userDetailsService.getClass().getName());
		tokenAuthenticationService = new TokenAuthenticationService("dsswwqqeed", userDetailsService);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.logout().logoutSuccessUrl("/logoutsuccess");
		http.headers().frameOptions().sameOrigin();
		http.exceptionHandling().and().anonymous().and().servletApi().and().headers().cacheControl().and().and()
				.authorizeRequests()
				.antMatchers("/").permitAll().antMatchers("/favicon.ico").permitAll()
				.antMatchers("/static/**").permitAll()
				.antMatchers("/**/*.html")
				.permitAll().antMatchers("/**/*.css").permitAll().antMatchers("/**/*.js").permitAll().antMatchers("/static/font/*.*").permitAll()
				// Allow anonymous logins
				.antMatchers("/login").permitAll()
				.antMatchers("/logoutsuccess").permitAll()
				.antMatchers("/register").permitAll()
				// All other request need to be authenticated
				.anyRequest().authenticated().and()
				// Custom Token based authentication based on the header
				// previously given to the client
				.addFilterBefore(new StatelessAuthenticationFilter(tokenAuthenticationService),
						UsernamePasswordAuthenticationFilter.class).anonymous().authorities("ROLE_ANON").and().csrf().disable();
	}
	
    @Bean
    public TokenAuthenticationService tokenAuthenticationService() {
        return tokenAuthenticationService;
    }
}