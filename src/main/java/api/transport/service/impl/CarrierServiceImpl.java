package api.transport.service.impl;

import api.transport.model.Carrier;
import api.transport.repo.ICarrierRepo;
import api.transport.repo.IGenericRepo;
import api.transport.service.ICarrierService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarrierServiceImpl extends CRUDImpl<Carrier, Integer> implements ICarrierService
{

    private final ICarrierRepo repo;

    @Override
    protected IGenericRepo<Carrier, Integer> getRepo() {
        return repo;
    }

}
