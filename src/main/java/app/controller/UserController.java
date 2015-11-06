package app.controller;

import app.config.configuration.TokenAuthenticationService;
import app.config.configuration.UserAuthentication;
import app.dao.system.UserProfileDao;
import app.message.Message;
import app.model.user.User;
import app.model.user.UserProfile;
import app.model.user.UserProfileType;
import app.model.userconstructure.Company;
import app.newDao.HibernateBaseGenericDAOImpl;
import app.newService.BaseGenericServiceImpl;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
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

    // get one user
    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getUser(@PathVariable("id") int id) {
        User user = userService.findById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    /**
     * update a user
     * */
    @RequestMapping(value="/user/{id}",method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> updateUser(@PathVariable("id") int id, @RequestBody User user){

        if(userService.findById(id)==null)
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        userService.update(user);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }
    /**
     * delete a user
     * */
    @RequestMapping(value = "/user/{id}",method=RequestMethod.DELETE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> deleteUser(@PathVariable("id") int id){

        return new ResponseEntity<User>(HttpStatus.OK);
    }

    // get all users
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
        userInfo.setCompanyId(userService.findById(userInfo.userId).getCompanyId());
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
    @Autowired
    SessionFactory sessionFactory;
    @RequestMapping(value="/user/{id}",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public void updateUserWorkflow(@PathVariable("id") int id,@RequestBody String workflows,HttpServletResponse response){
        User user = userService.findById(id);
        System.out.println(workflows);
        user.setWorkflows(workflows);
        try{
//            userService.update(user);
            userService.update(user);
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e){
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
        }
    }

    @RequestMapping(value = "/user/getworkflow/{id}", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public String getUserWorkflow(@PathVariable("id") int id){
        User user = userService.findById(id);
        if(user == null)
            return "no user found";
        return user.getWorkflows();
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
            this.setUserName(user2.getSsoId());
            this.setUserId(user2.getId());
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
