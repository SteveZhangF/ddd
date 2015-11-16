package app.controller;

import app.config.configuration.TokenAuthenticationService;
import app.config.configuration.UserAuthentication;
import app.dao.system.UserProfileDao;
import app.message.Message;
import app.model.user.State;
import app.model.user.User;
import app.model.user.UserProfile;
import app.model.user.UserProfileType;
import app.model.userconstructure.Company;
import app.model.wordflow.WorkFlow;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
import app.service.workflow.WorkFlowService;
import org.hibernate.SessionFactory;
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
import java.util.Map;

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
     */
    @RequestMapping(value = "/user/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> updateUser(@PathVariable("id") int id, @RequestBody User user) {

        if (userService.findById(id) == null)
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        userService.update(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @RequestMapping(value = "/updateUser", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> updateUserByUser(@RequestBody User user) {
        User user1 = userService.findBySso(user.getSsoId());
        if (user1 == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        user1.setPassword(user.getPassword());
        userService.update(user1);
        return new ResponseEntity<>(user1, HttpStatus.OK);
    }


    /**
     * delete a user
     */
    @RequestMapping(value = "/user/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> deleteUser(@PathVariable("id") int id) {

        return new ResponseEntity<User>(HttpStatus.OK);
    }

    // get all users
    @RequestMapping(value = "/user/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> listAllUser() {
        List<User> users = userService.list();
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }


    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<Message> register(@RequestBody User user, HttpServletResponse response) {

        if (userService.findBySso(user.getSsoId()) == null) {
            UserProfile userProfile = userProfileDao.findbyType(UserProfileType.USER);
            if(userProfile == null){
                userProfile = new UserProfile();
                userProfile.setType(UserProfileType.USER.getUserProfileType());
                userProfileDao.persist(userProfile);
            }

            user.getUserProfiles().add(userProfile);
            user.setState(State.ACTIVE.getState());
            try {
                userService.save(user);
                Company company = new Company();
                company.setUserId(user.getId());
                companyService.save(company);
                user.setCompanyId(company.getUuid());
                userService.update(user);
                return new ResponseEntity<Message>(HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<Message>(HttpStatus.EXPECTATION_FAILED);
            }
        } else {
            return new ResponseEntity<Message>(HttpStatus.CONFLICT);
        }

    }


    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<UserInfo> login(@RequestBody User userinfo, HttpServletResponse response) {

        User user = userService.findBySso(userinfo.getSsoId());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            if (user.getPassword().equals(userinfo.getPassword())) {
                UserDetails userDet = null;
                try {
                    userDet = userDetailsService.loadUserByUsername(userinfo.getSsoId());
                } catch (UsernameNotFoundException e) {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }

                UserAuthentication authentication = new UserAuthentication(userDet);
                String token = tokenAuthenticationService.addAuthentication(response, authentication);
                System.out.println(token);
                UserInfo userInfo = new UserInfo(userDet, token);
                userInfo.setCompanyId(userService.findById(userInfo.userId).getCompanyId());
                return new ResponseEntity<>(userInfo, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

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

    @Autowired
    WorkFlowService workFlowService;

    @RequestMapping(value = "/user/{id}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public void updateUserWorkflow(@PathVariable("id") int id, @RequestBody Map<String, String> workflows, HttpServletResponse response) {
        User user = userService.findById(id);

        for (String key : workflows.keySet()) {
            if (workflows.get(key).equals("")) {
                WorkFlow workFlow = workFlowService.get(key);
                workflows.put(key,workFlow.getStartNode_id());
            }
        }
        user.setWorkFlowCurrentNode(workflows);
        try {
            userService.update(user);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
        }
    }

    @RequestMapping(value = "/user/getworkflow/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> getUserWorkflow(@PathVariable("id") int id) {
        User user = userService.findById(id);
        if (user == null)
            return new ResponseEntity<Map<String, String>>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<Map<String, String>>(user.getWorkFlowCurrentNode(), HttpStatus.OK);
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
