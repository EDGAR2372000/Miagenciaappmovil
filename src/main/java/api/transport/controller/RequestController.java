package api.transport.controller;

import api.transport.model.Request;
import api.transport.service.IRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/requests")
public class RequestController
{
    private final IRequestService service;

    @PostMapping()
    public ResponseEntity<Request> save(@Valid @RequestBody Request obj) throws Exception {

        Request entity = service.save(obj);

        return new ResponseEntity<>(entity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Request> update(@PathVariable("id") Integer id, @Valid @RequestBody Request obj) throws Exception {
        obj.setId(id);
        Request entity = service.update(obj, id);

        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> findById(@PathVariable("id") Integer id) throws Exception {
        Request entity = service.findById(id);
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Request>> findAll() throws Exception {
        List<Request> data = service.findAll().stream()
                .toList();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Integer id) throws Exception {
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
