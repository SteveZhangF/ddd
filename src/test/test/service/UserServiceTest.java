/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package test.service;

import app.config.hibernate.HibernateConfiguration;
import app.dao.system.UserProfileDao;
import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import app.model.user.User;
import app.model.user.UserProfile;
import app.model.user.UserProfileType;
import app.service.system.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;
import java.io.StringWriter;
import java.util.*;

/**
 * Created by steve on 10/10/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
public class UserServiceTest {

    @Autowired
    UserService userService;
    @Autowired
    HibernateConfiguration hibernateConfiguration;
    @Autowired
    UserProfileDao userProfileDao;
    @Test
    public void listTest() throws IOException {
        List<User> users = userService.list();
        ObjectMapper mapper = new ObjectMapper();
        StringWriter sw = new StringWriter();
        mapper.writeValue(sw, users);
        System.out.print(sw.toString());
    }



   @Test
    public void updateTest(){
        User user = userService.findById(1);
        user.setCompanyId("4028809150452dc2015045377bd40005");
        userService.update(user);
    }

    @Test
    public void saveTest(){

        if(userService.findBySso("denglu")!=null){
            return;
        }

        User user = new User();
        user.setEmail("d@a.c");
        user.setPassword("e");
        user.setSsoId("denglu");
        user.setState("Active");
        Set<UserProfile> userProfiles = new HashSet<>();
        UserProfile userProfile1 = userProfileDao.findbyType(UserProfileType.USER);
        userProfiles.add(userProfile1);
        user.setUserProfiles(userProfiles);

        userService.save(user);

        int id = user.getId();
        User user1 = userService.findById(id);
        UserProfile userProfile2 = user1.getUserProfiles().iterator().next();
        assert (userProfile2!=null);
    }

    @Test
    public void deleteTest(){

    }
    @Configuration
    @ComponentScan("app.config.hibernate")
    static class ContextConfig{
        HibernateConfiguration hibernateConfiguration = new HibernateConfiguration();
        @Bean
        public HibernateConfiguration getHibernateConfiguration(){
            return hibernateConfiguration;
        }
    }
}
