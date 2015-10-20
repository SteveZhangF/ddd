package test;

import app.config.hibernate.HibernateConfiguration;
import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
public class SpringTest extends AbstractJUnit4SpringContextTests {

    @Configuration
    @ComponentScan("app.config.hibernate")
    static class ContextConfig{

        HibernateConfiguration hibernateConfiguration = new HibernateConfiguration();
        @Bean
        public HibernateConfiguration getHibernateConfiguration(){
            return hibernateConfiguration;
        }
    }
    @Test
    public void testSpring(){
        System.out.println();
    }
}