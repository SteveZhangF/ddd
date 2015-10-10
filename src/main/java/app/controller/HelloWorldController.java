package app.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import app.model.user.User;
import app.model.userconstructure.Company;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
 
@Controller
public class HelloWorldController {
 
     
    @RequestMapping(value = { "/", "/home" }, method = RequestMethod.GET)
    public String homePage(ModelMap model) {
        model.addAttribute("greeting", "Hi, Welcome to mysite");
        return "welcome";
    }
 
    @RequestMapping(value = "/admin", method = RequestMethod.GET)
    public String adminPage(ModelMap model) {
        model.addAttribute("user", getPrincipal());
        return "admin";
    }
 
    @RequestMapping(value = "/db", method = RequestMethod.GET)
    public String dbaPage(ModelMap model) {
        model.addAttribute("user", getPrincipal());
        return "dba";
    }
 
    @RequestMapping(value = "/Access_Denied", method = RequestMethod.GET)
    public String accessDeniedPage(ModelMap model) {
        model.addAttribute("user", getPrincipal());
        return "accessDenied";
    }
 

    
    @Autowired
   	UserService userService;
    @Autowired
    CompanyService companyService;

    private String getPrincipal(){
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
       System.out.println( ((UserDetails)principal)
        .getAuthorities().toArray()[0].toString());
        if (principal instanceof UserDetails) {
            userName = ((UserDetails)principal).getUsername();
        } else {
            userName = principal.toString();
        }
        User user = userService.findBySso(userName);
        Company company = companyService.findCompanybyUserID(user.getId());
        String result = "";
        if(company!=null)
        	 result = "{\"user_id\":\""+user.getId()+"\",\"company_id\":\""+company.getUuid()+"\"}";
        else{
        	result = "{\"user_id\":\""+user.getId()+"\",\"company_id\":\"null\"}";
        }
        return result;
    }
}