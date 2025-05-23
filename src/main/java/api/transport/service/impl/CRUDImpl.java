package api.transport.service.impl;

import api.transport.exception.ModelNotFoundException;
import api.transport.repo.IGenericRepo;
import api.transport.service.ICRUD;

import java.util.List;

import static api.transport.util.ConstantUtil.RESOURCE_NOT_FOUND;

public abstract class CRUDImpl<T, ID> implements ICRUD<T, ID>
{
    protected abstract IGenericRepo<T, ID> getRepo();

    @Override
    public T save(T t) throws Exception {
        return getRepo().save(t);
    }

    @Override
    public T update(T t, ID id) throws Exception {
        getRepo().findById(id).orElseThrow(() -> new ModelNotFoundException(RESOURCE_NOT_FOUND + ": " + id));
        return getRepo().save(t);
    }

    @Override
    public List<T> findAll() throws Exception {
        return getRepo().findAll();
    }

    @Override
    public T findById(ID id) throws Exception {
        return getRepo().findById(id).orElseThrow(()-> new ModelNotFoundException(RESOURCE_NOT_FOUND + ": " + id));
    }

    @Override
    public void deleteById(ID id) throws Exception {
        getRepo().findById(id).orElseThrow(() -> new ModelNotFoundException(RESOURCE_NOT_FOUND + ": " + id));
        getRepo().deleteById(id);
    }
}
