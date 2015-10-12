package app.service.form;

import app.model.form.FormTable;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/9/15.
 */
public interface FormService {

    void save(FormTable formTable);

    void update(FormTable formTable);

    void delete(FormTable formTable);

    void generatorTable(FormTable formTable);

    String generateInsertSQL(int formTable_id);

    Map<String, Object> generateSelectSQL(int formTable_id, Map<String, Object> foreignMap) throws ClassNotFoundException;

    FormTable findbyID(int id);

    List<FormTable> list();

}
