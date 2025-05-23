package api.transport.security;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import static api.transport.util.ConstantUtil.REGEXP_EMAIL;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtRequest implements Serializable
{
    @NotBlank(message = "El email es obligatorio")
    @Email( regexp = REGEXP_EMAIL, message = "El formato de email es incorrecto")
    private String username;

    @NotBlank(message = "El password es obligatorio")
    private String password;
}
