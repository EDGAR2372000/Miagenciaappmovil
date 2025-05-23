package api.transport.exception;


//@ResponseStatus(HttpStatus.CONFLICT)  // ó BAD_REQUEST, según semántica
public class LoadRequestStatusException extends RuntimeException {

    public LoadRequestStatusException(String mensaje) {
        super(mensaje);
    }
}