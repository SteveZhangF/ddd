package app.config.hibernate;


import org.apache.commons.dbcp.BasicDataSource;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;

@Configuration()
@EnableTransactionManagement
@ComponentScan({"app.service,app.dao,app.newDao,app.newService"})
@PropertySource(value = {"classpath:application.properties"})
public class HibernateConfiguration {

    @Autowired
    private Environment environment;

    @Bean
    public LocalSessionFactoryBean sessionFactory() throws URISyntaxException {
        LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setDataSource(dataSource());
        sessionFactory.setPackagesToScan("app.model");
        sessionFactory.setHibernateProperties(hibernateProperties());
        return sessionFactory;
    }

    String env;
    @Bean
    public DataSource dataSource() throws URISyntaxException {
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        dataSource.setDriverClassName(environment.getRequiredProperty("jdbc.driverClassName"));
//        dataSource.setUrl(environment.getRequiredProperty("jdbc.url"));
//        dataSource.setUsername(environment.getRequiredProperty("jdbc.username"));
//        dataSource.setPassword(environment.getRequiredProperty("jdbc.password"));
        env = System.getenv("CLEARDB_DATABASE_URL");
        if (env == null) {
            DriverManagerDataSource dataSource = new DriverManagerDataSource();
            dataSource.setDriverClassName(environment.getRequiredProperty("jdbc.driverClassName"));
            dataSource.setUrl(environment.getRequiredProperty("jdbc.url"));
            dataSource.setUsername(environment.getRequiredProperty("jdbc.username"));
            dataSource.setPassword(environment.getRequiredProperty("jdbc.password"));
            return dataSource;
        } else {
            URI dbUri = new URI(env);
            System.out.println(dbUri);
            String username = dbUri.getUserInfo().split(":")[0];
            String password = dbUri.getUserInfo().split(":")[1];
            String dbUrl = "jdbc:mysql://" + dbUri.getHost() + dbUri.getPath();
            BasicDataSource basicDataSource = new BasicDataSource();
            basicDataSource.setUrl(dbUrl);
            basicDataSource.setUsername(username);
            basicDataSource.setPassword(password);
            return basicDataSource;
        }

    }

    private Properties hibernateProperties() {
        Properties properties = new Properties();
        if(env==null){
            properties.put("hibernate.dialect", environment.getRequiredProperty("hibernate.dialect"));
        }
//        properties.put("hibernate.show_sql", environment.getRequiredProperty("hibernate.show_sql"));
//        properties.put("hibernate.format_sql", environment.getRequiredProperty("hibernate.format_sql"));

        //  properties.put("hibernate.hdm2ddl.auto", environment.getRequiredProperty("hibernate.hdm2ddl.auto"));
        properties.put("hibernate.hbm2ddl.auto", "update");
//        <beans:prop key="maxwait">10000</beans:prop>
//        <beans:prop key="maxidle">25</beans:prop>
//        <beans:prop key="minidle">5</beans:prop>*
        properties.put("maxwait",10000);
        properties.put("maxidle",25);
        properties.put("minidle",5);
//        System.out.println(environment.getRequiredProperty("hibernate.hdm2ddl.auto"));
        return properties;
    }

    @Bean
    @Autowired
    public HibernateTransactionManager transactionManager(SessionFactory s) {
        HibernateTransactionManager txManager = new HibernateTransactionManager();
        txManager.setSessionFactory(s);
        return txManager;
    }
}