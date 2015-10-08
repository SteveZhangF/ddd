package app.dao.system;

import app.model.user.User;

public interface UserDao {

   User findById(int id);
    
   User findBySSO(String sso);
   
   void save(User user);
   
}
