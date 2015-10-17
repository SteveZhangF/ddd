package app.dao.system;

import app.dao.AbstractDao;
import app.model.user.User;
import app.model.wordflow.WorkFlow;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository("userDao")
public class UserDaoImpl extends HibernateBaseGenericDAOImpl<User,Integer> implements UserDao {


    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public UserDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public User findBySSO(String sso) {
        return getbyParam("ssoId",sso);
    }

    @Override
    public void delete(User entity) {
        super.delete(entity);
    }

    @Override
    public List<User> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(User entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(User entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(User entity) {
        super.update(entity);
    }

    @Override
    public User get(Integer id) {
        return super.get(id);
    }

    @Override
    public User load(Integer id) {
        return super.load(id);
    }

    @Override
    public User getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<User> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }
}
