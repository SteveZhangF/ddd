package app.controller;


import app.model.user.User;
import app.model.userconstructure.Company;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;


@RestController
public class CompanyController {

    @Autowired
    CompanyService companyService;  //Service which will do all data retrieval/manipulation work
    @Autowired
    UserService userService;

    //-------------------Retrieve All Company--------------------------------------------------------

    @RequestMapping(value = "/company/", method = RequestMethod.GET)
    public ResponseEntity<List<Company>> listAllCompany() {
        List<Company> companies = companyService.findAllCompany();
        if (companies.isEmpty()) {
            return new ResponseEntity<List<Company>>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<Company>>(companies, HttpStatus.OK);
    }


    //-------------------Retrieve Single Company--------------------------------------------------------

    @RequestMapping(value = "/company/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Company> getUser(@PathVariable("id") String id) {
        Company company = companyService.findById(id);
        System.out.println(company);
        if (company == null) {
            return new ResponseEntity<Company>(HttpStatus.NOT_FOUND);
        }
        // System.out.println(new ResponseEntity<Company>(company, HttpStatus.OK).toString()	);
        return new ResponseEntity<Company>(company, HttpStatus.OK);
    }


    //-------------------Create a Company--------------------------------------------------------

    @RequestMapping(value = "/company/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Company> createCompany(@RequestBody Company company, HttpServletResponse response) {
        System.out.println(company);
        company.setCompany_id("1");

        companyService.saveCompany(company);
        int user_id = company.getUser_id();
        User user = userService.findById(user_id);
        user.setCompanyId(company.getUuid());
        userService.update(user);
        company.setCompany_id(company.getUuid());
        companyService.updateCompany(company);
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<Company>(company, HttpStatus.CREATED);
    }


    //------------------- Update a Company --------------------------------------------------------

    @RequestMapping(value = "/company/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Company> updateCompany(@PathVariable("id") String id, @RequestBody Company company) {
        System.out.println("Updating User " + id);

        Company currentCompany = companyService.findById(id);

        if (currentCompany == null) {
            return new ResponseEntity<Company>(HttpStatus.NOT_FOUND);
        }

        currentCompany.setAddress(company.getAddress());
        currentCompany.setCompany_id(company.getCompany_id());
        currentCompany.setFormType(company.getFormType());
//        currentCompany.setModules(company.getModules());
        currentCompany.setName(company.getName());
        currentCompany.setPhone(company.getPhone());
//        currentCompany.setRecords(company.getRecords());
        currentCompany.setUser_id(company.getUser_id());

        companyService.updateCompany(currentCompany);
        return new ResponseEntity<Company>(currentCompany, HttpStatus.OK);
    }


    //------------------- Delete a company --------------------------------------------------------

    @RequestMapping(value = "/company/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Company> deleteUser(@PathVariable("id") String id) {
        System.out.println("Fetching & Deleting User with id " + id);

        Company company = companyService.findById(id);

        if (company == null) {
            System.out.println("Unable to delete. Company with id " + id + " not found");
            return new ResponseEntity<Company>(HttpStatus.NOT_FOUND);
        }

        companyService.deleteCompanyById(id);
        return new ResponseEntity<Company>(HttpStatus.NO_CONTENT);
    }
}