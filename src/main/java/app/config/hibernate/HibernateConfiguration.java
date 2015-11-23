package app.config.hibernate;


import org.apache.commons.dbcp2.BasicDataSource;
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


            BasicDataSource basicDataSource = new BasicDataSource();


            basicDataSource.setDriverClassName(environment.getRequiredProperty("jdbc.driverClassName"));
            basicDataSource.setUrl(environment.getRequiredProperty("jdbc.url"));
            basicDataSource.setUsername(environment.getRequiredProperty("jdbc.username"));
            basicDataSource.setPassword(environment.getRequiredProperty("jdbc.password"));
            basicDataSource.setInitialSize(8);
            return basicDataSource;
        } else {
            URI dbUri = new URI(env);
            String username = dbUri.getUserInfo().split(":")[0];
            String password = dbUri.getUserInfo().split(":")[1];
            String dbUrl = "jdbc:mysql://" + dbUri.getHost() + dbUri.getPath();
            BasicDataSource basicDataSource = new BasicDataSource();
            basicDataSource.setUrl(dbUrl);
            basicDataSource.setUsername(username);
            basicDataSource.setPassword(password);
            basicDataSource.setInitialSize(8);
            basicDataSource.setMaxIdle(20);
            basicDataSource.setMinIdle(5);
//            <property name="hibernate.dbcp.initialSize">8</property>
//            <property name="hibernate.dbcp.maxActive">20</property>
//            <property name="hibernate.dbcp.maxIdle">20</property>
//            <property name="hibernate.dbcp.minIdle">0</property>

            return basicDataSource;
        }

    }

    private Properties hibernateProperties() {
        Properties properties = new Properties();
        if (env == null) {
            properties.put("hibernate.dialect", environment.getRequiredProperty("hibernate.dialect"));
        }
//        properties.put("hibernate.show_sql", environment.getRequiredProperty("hibernate.show_sql"));
//        properties.put("hibernate.format_sql", environment.getRequiredProperty("hibernate.format_sql"));

//        <property name="hibernate.dbcp.initialSize">8</property>
//        <property name="hibernate.dbcp.maxActive">20</property>
//        <property name="hibernate.dbcp.maxIdle">20</property>
//        <property name="hibernate.dbcp.minIdle">0</property>


        properties.put("hibernate.hbm2ddl.auto", "update");
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