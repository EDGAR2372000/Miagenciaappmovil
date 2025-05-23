package api.transport.security;

import api.transport.exception.CustomErrorResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;

import static api.transport.util.ConstantUtil.TOKEN_NOT_VALID;


@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint, Serializable
{

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        String exceptionMessage = request.getAttribute("exception").toString();

        if (exceptionMessage == null)
        {
            exceptionMessage = TOKEN_NOT_VALID;
        }

        CustomErrorResponse errorResponse = new CustomErrorResponse(LocalDateTime.now(), exceptionMessage, request.getRequestURI());
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.getWriter().write(convertObjectToJson(errorResponse));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    }

    private String convertObjectToJson(Object object) throws JsonProcessingException {
        if (object == null)
        {
            return null;
        }
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        return mapper.writeValueAsString(object);
    }
}
