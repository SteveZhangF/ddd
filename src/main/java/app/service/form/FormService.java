package app.service.form;

import app.model.form.FormTable;

import java.util.List;

/**
 * Created by steve on 10/9/15.
 */
public interface FormService {
    void save(FormTable formTable);
    void update(FormTable formTable);
    void delete(FormTable formTable);
    FormTable findbyID(int id);
    List<FormTable> list();

}
