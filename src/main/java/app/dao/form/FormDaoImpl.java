package app.dao.form;

import app.dao.AbstractDao;
import app.model.form.FormTable;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.util.Date;
import java.util.List;

/**
 * Created by steve on 10/9/15.
 */
@Repository("formDao")
public class FormDaoImpl extends AbstractDao<Integer,FormTable> implements FormDao{
    @Override
    public void update(FormTable formTable) {
        FormTable ft = super.getByKey(formTable.getId());
        if(ft!=null){

            ft.setForm_name(formTable.getForm_name());
            ft.setForm_desc(formTable.getForm_desc());

            ft.setContext(formTable.getContext());
            ft.setContext_parse(formTable.getContext_parse());

            ft.setFields_count(formTable.getFields_count());
            ft.setIs_del(formTable.is_del());

            ft.setCreator(formTable.getCreator());
            ft.setColumnAttributes(formTable.getColumnAttributes());
        }
    }

    @Override
    public FormTable getByKey(int key) {
        return super.getByKey(key);
    }

    @Override
    public List<FormTable> list() {
        return super.createEntityCriteria().list();
    }
}
