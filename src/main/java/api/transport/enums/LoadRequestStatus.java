package api.transport.enums;

import lombok.Getter;

@Getter
public enum LoadRequestStatus
{
    PUBLICADO,
    ASIGNADO,
    RECOGIDO,
    RUTA,
    COMPLETADO;
}
