package app.service.form;

import app.dao.form.FormDao;
import app.model.forms.Form;
import app.newService.BaseGenericServiceImpl;
import org.hibernate.Criteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by steve on 10/9/15.
 */

@Service("formService")
@Transactional
public class FormServiceImpl extends BaseGenericServiceImpl<Form,Integer> implements FormService {


    @Autowired
    FormDao formDao;
    @Override
    public void delete(Form entity) {
        formDao.delete(entity);
    }
    @Override
    public Form get(Integer id) {
        return formDao.get(id);
    }

    @Override
    public Form load(Integer id) {
        return formDao.load(id);
    }

    @Override
    public List<Form> loadAll() {
        return formDao.loadAll();
    }

    @Override
    public void save(Form entity) {
        formDao.save(entity);
    }

    @Override
    public void saveOrUpdate(Form entity) {
        formDao.saveOrUpdate(entity);
    }

    @Override
    public void update(Form entity) {
        formDao.update(entity);
    }


//    private int id;
//    private String content;
//    private Date createTime;
//    private Date updateTime;
//    private String form_desc;
//    private String form_name;
//    private FormType formType;
    @Override
    public List<Form> getFormListforMenu() {
        String[] fields = {"id","createTime","updateTime","form_desc","form_name","formType"};
        return formDao.getListbyField(fields);
    }
}
