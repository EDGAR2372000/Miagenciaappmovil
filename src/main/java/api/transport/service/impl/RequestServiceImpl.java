package api.transport.service.impl;

import api.transport.enums.CarrierStatus;
import api.transport.enums.LoadRequestStatus;
import api.transport.enums.RequestStatus;
import api.transport.exception.LoadRequestStatusException;
import api.transport.model.Carrier;
import api.transport.model.LoadRequest;
import api.transport.model.Request;
import api.transport.repo.IGenericRepo;
import api.transport.repo.IRequestRepo;
import api.transport.service.ICarrierService;
import api.transport.service.ILoadRequestService;
import api.transport.service.IRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RequestServiceImpl extends CRUDImpl<Request, Integer> implements IRequestService
{
    private final IRequestRepo repo;
    private final ILoadRequestService loadRequestService;
    private final ICarrierService carrierService;

    @Override
    protected IGenericRepo<Request, Integer> getRepo() {
        return repo;
    }

    @Override
    public Request save(Request request) throws Exception {
        request.setDatetime(LocalDateTime.now());
        request.setStatus(RequestStatus.PENDIENTE);
        return super.save(request);
    }

    @Override
    public Request update(Request request, Integer integer) throws Exception {
        blockUpdateWhenStatusIsRejected(request);

        Request obj = updateByStatus(request);
        return super.update(obj, integer);
    }

    private Request updateByStatus(Request request) throws Exception {

        if(request.getStatus() == RequestStatus.ACEPTADO)
        {
            LoadRequest entity = loadRequestService.findById(request.getLoadRequest().getId());
            Carrier carrier = carrierService.findById(request.getCarrier().getId());

            entity.setStatus(LoadRequestStatus.ASIGNADO);
            carrier.setStatus(CarrierStatus.NO_DISPONIBLE);
            entity.setCarrier(carrier);

            carrierService.update(carrier, carrier.getId());
            loadRequestService.update(entity, entity.getId());

            request.setLoadRequest(entity);
        }

        request.setDatetime(LocalDateTime.now());

        return request;
    }

    private void blockUpdateWhenStatusIsRejected(Request request) throws Exception {
        Request obj = findById(request.getId());
        if (obj.getStatus() == RequestStatus.RECHAZADO || obj.getStatus() == RequestStatus.ACEPTADO)
        {
            throw new LoadRequestStatusException("No se puede actualizar la solicitud de carga porque ya está rechazada o aceptada");
        }
    }
}
