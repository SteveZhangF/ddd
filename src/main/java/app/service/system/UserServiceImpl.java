package app.service.system;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.dao.system.UserDao;
import app.model.user.User;

@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao dao;

	public User findById(int id) {
		return dao.findById(id);
	}

	public User findBySso(String sso) {
		return dao.findBySSO(sso);
	}

	@Override
	public void save(User user) {
		dao.save(user);
	}

	@Override
	public void update(User user) {
		User ent = dao.findById(user.getId());
		if(ent!=null){
			ent.setEmail(user.getEmail());
			ent.setPassword(user.getPassword());
			ent.setState(user.getState());
			ent.setUserProfiles(user.getUserProfiles());
		}
	}

}
