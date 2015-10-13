/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.config.hibernate.HibernateConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Created by steve on 10/12/15.
 */
@Configuration
@ComponentScan("app.config.hibernate")
public class UserFormServiceImplTestContextConfiguration {
    HibernateConfiguration hibernateConfiguration = new HibernateConfiguration();
    @Bean
    public HibernateConfiguration getHibernateConfiguration(){
        return hibernateConfiguration;
    }
}

