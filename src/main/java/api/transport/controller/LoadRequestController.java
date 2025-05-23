package api.transport.controller;


import api.transport.model.LoadRequest;
import api.transport.service.ILoadRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/loadrequests")
public class LoadRequestController 
{
    private final ILoadRequestService service;

    @PostMapping()
    public ResponseEntity<LoadRequest> save(@Valid @RequestBody LoadRequest obj) throws Exception {

        LoadRequest entity = service.save(obj);

        return new ResponseEntity<>(entity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoadRequest> update(@PathVariable("id") Integer id, @Valid @RequestBody LoadRequest obj) throws Exception {
        obj.setId(id);
        LoadRequest entity = service.update(obj, id);

        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoadRequest> findById(@PathVariable("id") Integer id) throws Exception {
        LoadRequest entity = service.findById(id);
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<LoadRequest>> findAll() throws Exception {
        List<LoadRequest> data = service.findAll().stream()
                .toList();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Integer id) throws Exception {
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
