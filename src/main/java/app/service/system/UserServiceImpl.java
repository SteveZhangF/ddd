package app.service.system;

import app.dao.system.UserDao;
import app.model.user.User;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("userService")
@Transactional
public class UserServiceImpl extends BaseGenericServiceImpl<User, Integer> implements UserService {

    @Autowired
    private UserDao dao;

    public User findById(int id) {
        return dao.get(id);
    }

    public User findBySso(String sso) {
        return dao.findBySSO(sso);
    }

    @Override
    public void save(User user) {
        dao.save(user);
    }

    @Override
    public void saveOrUpdate(User entity) {
        dao.saveOrUpdate(entity);
    }

    @Override
    public void delete(User entity) {
        dao.delete(entity);
    }

    @Override
    public User get(Integer id) {
        return dao.get(id);
    }

    @Override
    public User load(Integer id) {
        return dao.load(id);
    }

    @Override
    public List<User> loadAll() {
        return dao.loadAll();
    }

    @Override
    public List<User> list() {
        return dao.loadAll();
    }

    @Override
    public void update(User entity) {
        dao.update(entity);
    }
}
