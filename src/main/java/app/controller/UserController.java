package app.controller;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import app.config.test.TokenAuthenticationService;
import app.config.test.UserAuthentication;
import app.message.Message;
import app.model.user.User;
import app.model.userconstructure.Company;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;

@RestController
public class UserController {
	@Autowired
	UserService userService;
	@Autowired
	CompanyService companyService;
	@Autowired
	@Qualifier("customUserDetailsService")
	UserDetailsService userDetailsService;
	@Autowired
	private TokenAuthenticationService tokenAuthenticationService;
	@ResponseBody
    public boolean readShortMsg(Model model, String msgId,
            HttpServletRequest request) {
		
        return false;
    }
	
	
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public ResponseEntity<Message> register(@RequestBody User user, HttpServletResponse response) {
		System.out.println("registering .." + user + "....");
		Message msg = new Message();
		if(userService.findBySso(user.getSsoId())==null){
			userService.save(user);
			
			msg.setTitle("success");
			msg.setContent("Register Success");
		}else{
			msg.setTitle("failed");
			msg.setContent("SSOID(User Name) Existing!");
		}
		return new ResponseEntity<Message>(msg,HttpStatus.OK);
	}
	
	
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<UserInfo> login(@RequestBody User ssoId, HttpServletResponse response) {

		UserDetails user = null;
		try {
			user = userDetailsService.loadUserByUsername(ssoId.getSsoId());
		} catch (UsernameNotFoundException e) {
			try {
				response.getWriter().write("nosuchuser");
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			UserAuthentication authentication = new UserAuthentication(user);
			System.out.println(authentication.isAuthenticated());
		}
		UserAuthentication authentication = new UserAuthentication(user);
		String token = tokenAuthenticationService.addAuthentication(response, authentication);
		System.out.println(token);
		UserInfo userInfo = new UserInfo(user, token);
		return new ResponseEntity<UserInfo>(userInfo, HttpStatus.OK);
		// headers.setLocation(ucBuilder.path("/company/{id}").buildAndExpand(company.getUuid()).toUri());
	}

	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			new SecurityContextLogoutHandler().logout(request, response, auth);
		}
		return "logoutsuccess!";
	}
	@RequestMapping(value = "/logoutsuccess", method = RequestMethod.GET)
	public void  logoutsuccess(HttpServletRequest request, HttpServletResponse response) {
		try {
			response.getWriter().write("logout");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	class UserInfo {
		private String accessToken;
		private String userName;
		private int userId;
		private String companyId;

		UserInfo() {
		}

		UserInfo(UserDetails user, String accessToken) {
			User user2 = userService.findBySso(user.getUsername());
			Company company = companyService.findCompanybyUserID(user2.getId());
			this.setUserName(user2.getSsoId());
			this.setUserId(user2.getId());
			String companyid = company==null?"null":company.getUuid();
			this.setCompanyId(companyid);
			this.setAccessToken(accessToken);
		}

		public String getAccessToken() {
			return accessToken;
		}

		public void setAccessToken(String accessToken) {
			this.accessToken = accessToken;
		}

		public String getUserName() {
			return userName;
		}

		public void setUserName(String userName) {
			this.userName = userName;
		}

		public String getCompanyId() {
			return companyId;
		}

		public void setCompanyId(String companyId) {
			this.companyId = companyId;
		}

		public int getUserId() {
			return userId;
		}

		public void setUserId(int userId) {
			this.userId = userId;
		}

	}

}
