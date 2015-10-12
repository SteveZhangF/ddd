package app.controller;

import app.config.configuration.TokenAuthenticationService;
import app.config.configuration.UserAuthentication;
import app.dao.system.UserProfileDao;
import app.message.Message;
import app.model.user.User;
import app.model.user.UserProfile;
import app.model.user.UserProfileType;
import app.model.userconstructure.Company;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

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
    @Autowired
    UserProfileDao userProfileDao;

    @ResponseBody
    public boolean readShortMsg(Model model, String msgId,
                                HttpServletRequest request) {

        return false;
    }

    @RequestMapping(value = "/user/",method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> listAllUser(){
        List<User> users = userService.list();
        return new ResponseEntity<List<User>>(users,HttpStatus.OK);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<Message> register(@RequestBody User user, HttpServletResponse response) {
        System.out.println("registering .." + user + "....");
        Message msg = new Message();
        if (userService.findBySso(user.getSsoId()) == null) {
            UserProfile userProfile = userProfileDao.findbyType(UserProfileType.USER);
            user.getUserProfiles().add(userProfile);
            userService.save(user);

            msg.setTitle("success");
            msg.setContent("Register Success");
        } else {
            msg.setTitle("failed");
            msg.setContent("SSOID(User Name) Existing!");
        }
        return new ResponseEntity<Message>(msg, HttpStatus.OK);
    }


    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<UserInfo> login(@RequestBody User userinfo, HttpServletResponse response) {

        UserDetails user = null;
        try {
            user = userDetailsService.loadUserByUsername(userinfo.getSsoId());
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
    public void logoutsuccess(HttpServletRequest request, HttpServletResponse response) {
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
            String companyid = null;
            if(user2.getCompanyId()==null || user2.getCompanyId().equals("")){
                Company company = companyService.findCompanybyUserID(user2.getId());
                companyid = company == null ? "null" : company.getUuid();
                user2.setCompanyId(companyid);
                userService.update(user2);
            }else{
                companyid = user2.getCompanyId();
            }

            this.setUserName(user2.getSsoId());
            this.setUserId(user2.getId());
            this.setAccessToken(accessToken);
            this.setCompanyId(companyid);
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
