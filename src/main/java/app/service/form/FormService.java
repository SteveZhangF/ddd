package app.service.form;

import app.model.forms.Form;
import app.newService.IBaseGenericService;

import java.io.IOException;
import java.util.List;


/**
 * Created by steve on 10/9/15.
 */
public interface FormService extends IBaseGenericService<Form, Integer> {
    List<Form> getFormListforMenu();
    boolean updateFormContent(int id,String json) throws IOException;
}
