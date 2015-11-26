/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

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

/**
 * Created by steve on 11/25/15.
 */


@RestController
public class AdminUserController {
    @Autowired
    UserService userService;
    @Autowired
    CompanyService companyService;
    @Autowired
    @Qualifier("customUserDetailsService")
    UserDetailsService userDetailsService;
    @Autowired
    UserProfileDao userProfileDao;


    /**
     * update a user
     */
    @RequestMapping(value = "/admin/user/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateUser(@PathVariable("id") int id, @RequestBody User user) {

        if (userService.findById(id) == null)
            return new ResponseEntity<>(Message.getFailMsg("No such user"),HttpStatus.OK);

        User user2 = userService.get(user.getId());
        user2.setUserProfiles(user.getUserProfiles());
        user2.setState(user.getState());
        user2.setWorkFlowCurrentNode(user.getWorkFlowCurrentNode());
        user2.setCompanyId(user.getCompanyId());
        user2.setEmail(user.getEmail());
        user2.setFolders(user.getFolders());
        userService.update(user2);
        return new ResponseEntity<>(Message.getSuccessMsg("Update User Success",user2), HttpStatus.OK);
    }


    // get all users
    @RequestMapping(value = "/admin/user/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> listAllUser() {
        List<User> users = userService.list();
        for(User user:users){
            user.setPassword(null);
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load users success",users), HttpStatus.OK);
    }
}
