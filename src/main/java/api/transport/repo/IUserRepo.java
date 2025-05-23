package api.transport.repo;

import api.transport.model.User;

public interface IUserRepo extends IGenericRepo<User, Integer>
{
    User findOneByEmail(String username);
}
