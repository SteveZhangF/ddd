package app.service.userconstructure;

import app.model.userconstructure.Company;
import app.newService.IBaseGenericService;

import java.util.List;

public interface CompanyService extends IBaseGenericService<Company, String> {
    Company getCompanybyUser(int user_id);
}
