package api.transport.controller;

import api.transport.enums.CarrierStatus;
import api.transport.model.Carrier;
import api.transport.service.ICarrierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/carriers")
public class CarrierController
{
    private final ICarrierService service;

    @PostMapping()
    public ResponseEntity<Carrier> save(@Valid @RequestBody Carrier obj) throws Exception {

        Carrier entity = service.save(obj);

        return new ResponseEntity<>(entity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carrier> update(@PathVariable("id") Integer id, @Valid @RequestBody Carrier obj) throws Exception {
        obj.setId(id);
        Carrier entity = service.update(obj, id);
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carrier> findById(@PathVariable("id") Integer id) throws Exception {
        Carrier entity = service.findById(id);

        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Carrier>> findAll() throws Exception {
        List<Carrier> data = service.findAll().stream()
                .filter(c -> c.getUser().isEnabled())
                .toList();

        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/list-status")
    public List<CarrierStatus> getAllCarrierStatuses() {
        return Arrays.stream(CarrierStatus.values())
                .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Integer id) throws Exception {
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
