package api.transport.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ConstantUtil
{
    public static final String RESOURCE_NOT_FOUND = "Recurso no encontrado: ";

    public static final String TOKEN_NOT_VALID = "Token no valido";

    public static final String REGEXP_EMAIL = "(?i)^[a-zA-Z0-9._%+-]+@(hotmail\\.com|outlook\\.com|yahoo\\.com|gmail\\.com)$";

    public static final long JWT_TOKEN_VALIDITY = 3L * 60 * 60 * 1000;
}
