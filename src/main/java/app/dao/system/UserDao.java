package app.dao.system;

import app.model.user.User;
import app.newDao.IBaseGenericDAO;

import java.util.List;

public interface UserDao extends IBaseGenericDAO<User,Integer>{
    public User findBySSO(String sso);

}
