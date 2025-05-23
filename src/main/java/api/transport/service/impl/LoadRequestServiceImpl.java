package api.transport.service.impl;

import api.transport.enums.LoadRequestStatus;
import api.transport.exception.LoadRequestStatusException;
import api.transport.model.LoadRequest;
import api.transport.repo.IGenericRepo;
import api.transport.repo.ILoadRequestRepo;
import api.transport.service.ILoadRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoadRequestServiceImpl extends CRUDImpl<LoadRequest, Integer> implements ILoadRequestService
{
    private final ILoadRequestRepo repo;

    @Override
    protected IGenericRepo<LoadRequest, Integer> getRepo() {
        return repo;
    }

    @Override
    public LoadRequest save(LoadRequest loadRequest) throws Exception {
        loadRequest.setDatetime(LocalDateTime.now());
        loadRequest.setStatus(LoadRequestStatus.PUBLICADO);
        return super.save(loadRequest);
    }

    @Override
    public LoadRequest update(LoadRequest loadRequest, Integer integer) throws Exception {
        blockUpdateWhenStatusIsComplete(loadRequest);
        return super.update(loadRequest, integer);
    }

    private void blockUpdateWhenStatusIsComplete(LoadRequest loadRequest) throws Exception {
        LoadRequest obj = findById(loadRequest.getId());
        if (obj.getStatus() == LoadRequestStatus.COMPLETADO) {
            throw new LoadRequestStatusException("No se puede actualizar la solicitud de carga porque ya está completada");
        }
    }
}
