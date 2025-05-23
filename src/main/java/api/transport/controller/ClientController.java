package api.transport.controller;


import api.transport.model.Client;
import api.transport.service.IClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/clients")
public class ClientController
{
    private final IClientService service;

    @PostMapping()
    public ResponseEntity<Client> save(@Valid @RequestBody Client obj) throws Exception {

        Client entity = service.save(obj);

        return new ResponseEntity<>(entity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable("id") Integer id, @Valid @RequestBody Client obj) throws Exception {
        obj.setId(id);
        Client entity = service.update(obj, id);

        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> findById(@PathVariable("id") Integer id) throws Exception {
        Client entity = service.findById(id);
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Client>> findAll() throws Exception {
        List<Client> data = service.findAll().stream()
                .filter(c -> c.getUser().isEnabled())
                .toList();

        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Integer id) throws Exception {
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
