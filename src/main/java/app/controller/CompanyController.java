package app.controller;


import app.model.user.User;
import app.model.userconstructure.Company;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
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
        List<Company> companies = companyService.loadAll();
        if (companies.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @RequestMapping(value = "/company/getbyuserid/{id}", method = RequestMethod.GET)
    public ResponseEntity<Company> getCompanybyUserId(@PathVariable("id") int id) {
        Company company = companyService.getCompanybyUser(id);
        if (company == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(company, HttpStatus.OK);
        }

    }

    //-------------------Retrieve Single Company--------------------------------------------------------

    @RequestMapping(value = "/company/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Company> getCompany(@PathVariable("id") String id) {
        Company company = companyService.get(id);
        System.out.println(company);
        if (company == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(company, HttpStatus.OK);
    }


    //-------------------Create a Company--------------------------------------------------------

    @RequestMapping(value = "/company/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Company> createCompany(@RequestBody Company company, HttpServletResponse response) {
        System.out.println(company);
        companyService.save(company);
        int user_id = company.getUserId();
        User user = userService.findById(user_id);
        user.setCompanyId(company.getUuid());
        userService.update(user);
        return new ResponseEntity<>(company, HttpStatus.CREATED);
    }


    //------------------- Update a Company --------------------------------------------------------

    @RequestMapping(value = "/company/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Company> updateCompany(@PathVariable("id") String id, @RequestBody Company company) {
        if (companyService.get(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        try {
            companyService.update(company);
            return new ResponseEntity<>(company, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }


    //------------------- Delete a company --------------------------------------------------------

    @RequestMapping(value = "/company/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Company> deleteUser(@PathVariable("id") String id) {
        Company company = companyService.get(id);
        if (company == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        companyService.delete(companyService.get(id));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}