package api.transport.service.impl;

import api.transport.model.Client;
import api.transport.repo.IClientRepo;
import api.transport.repo.IGenericRepo;
import api.transport.service.IClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl extends CRUDImpl<Client, Integer> implements IClientService
{
    private final IClientRepo repo;

    @Override
    protected IGenericRepo<Client, Integer> getRepo() {
        return repo;
    }
}
