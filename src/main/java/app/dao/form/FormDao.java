package app.dao.form;

import app.model.form.FormTable;

import java.util.List;

/**
 * Created by steve on 10/9/15.
 */
public interface FormDao {
    void update(FormTable formTable);

    FormTable getByKey(int key);

    void persist(FormTable entity);

    void delete(FormTable entity);

    List<FormTable> list();

}
