/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.newDao;

/**
 * Created by steve on 10/12/15.
 */

import java.io.Serializable;
import java.util.List;

/**
 * @param <T>  实体类
 * @param <PK> 主键类，必须实现Serializable接口
 * @author zj
 * @version V1.0
 * @ClassName：IBaseGenericDAO
 * @Description：TODO(IBaseGenericDAO DAO层泛型接口，定义基本的DAO功能 )
 * @date：Jul 9, 2012 1:32:07 PM
 */
public abstract interface IBaseGenericDAO<T, PK extends Serializable> {

    /**
     * 按主键取记录
     *
     * @param id 主键值
     * @return 记录实体对象，如果没有符合主键条件的记录，则返回null
     */
    public abstract T get(PK id);

    /**
     * 按主键取记录
     *
     * @param id 主键值
     * @return 记录实体对象，如果没有符合主键条件的记录，则 throw DataAccessException
     */
    public abstract T load(PK id);

    /**
     * 获取全部实体
     *
     * @return 返回一个list集合数据
     */
    public abstract List<T> loadAll();

    /**
     * 修改一个实体对象（UPDATE一条记录）
     *
     * @param entity 实体对象
     */
    public abstract void update(T entity);

    /**
     * 插入一个实体（在数据库INSERT一条记录）
     *
     * @param entity 实体对象
     */
    public abstract void save(T entity);

    /**
     * 增加或更新实体
     *
     * @param entity 实体对象
     */
    public abstract void saveOrUpdate(T entity);

    /**
     * 删除指定的实体
     *
     * @param entity 实体对象
     */
    public abstract void delete(T entity);

    /**
     * get object based on param(field)
     * @param param param name
     * @param value param value
     * */
    public abstract T getbyParam(String param, Object value);

    public abstract List<T> getListbyParam(String param, Object value);

    public abstract List<T> getListbyField(String[] field);

}
