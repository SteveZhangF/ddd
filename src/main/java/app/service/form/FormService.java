package app.service.form;

import app.model.form.FormTable;
import app.newService.IBaseGenericService;

import java.util.Map;

/**
 * Created by steve on 10/9/15.
 */
public interface FormService extends IBaseGenericService<FormTable, Integer> {
    void generatorTable(FormTable formTable);

    String generateInsertSQL(FormTable formTable);

    Map<String, Object> generateSelectSQL(FormTable formTable, Map<String, Object> foreignMap) throws ClassNotFoundException;

}
