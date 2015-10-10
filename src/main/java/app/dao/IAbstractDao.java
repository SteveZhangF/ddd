package app.dao;

import java.io.Serializable;

/**
 * Created by steve on 10/9/15.
 */
public interface IAbstractDao<PK extends Serializable, T> {
    T getByKey(PK key);
    void persist(T entity) ;
    void delete(T entity);
}