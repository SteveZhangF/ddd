package app.service.form;

import app.dao.form.FormDao;
import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by steve on 10/9/15.
 */

@Service("formService")
@Transactional
public class FormServiceImpl implements   FormService{
    @Autowired
    FormDao formDao;

    @Override
    public void save(FormTable formTable) {
        formDao.persist(formTable);

    }

    @Override
    public void update(FormTable formTable) {
        formDao.update(formTable);
    }

    @Override
    public void delete(FormTable formTable) {
        formDao.delete(formTable);
    }

    @Override
    public FormTable findbyID(int id) {
        FormTable ft = formDao.getByKey(id);
        List<ColumnAttribute> lists = ft.getColumnAttributes();
        for(ColumnAttribute ca : lists){
            System.out.println(ca.getContent());
        }
        return ft;
    }

    @Override
    public List<FormTable> list() {
        return formDao.list();
    }
}
