package app.service.form;

import app.model.form.FormTable;
import app.newDao.IBaseGenericDAO;
import app.newService.IBaseGenericService;

import java.text.Normalizer;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/9/15.
 */
public interface FormService extends IBaseGenericService<FormTable,Integer>{

//    void save(FormTable formTable);
//
//    void update(FormTable formTable);
//
//    void delete(FormTable formTable);

    void generatorTable(FormTable formTable);

    String generateInsertSQL(FormTable formTable);

    Map<String, Object> generateSelectSQL(FormTable formTable, Map<String, Object> foreignMap) throws ClassNotFoundException;

//    FormTable findbyID(int id);

//    List<FormTable> list();

}
