package app.service.system;

import app.model.user.User;
import app.newService.IBaseGenericService;

import java.util.List;

public interface UserService extends IBaseGenericService<User,Integer> {

    User findById(int id);

    User findBySso(String sso);

    void save(User user);

    void update(User user);

    List<User> list();

}