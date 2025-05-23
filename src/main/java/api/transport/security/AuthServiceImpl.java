package api.transport.security;

import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthServiceImpl
{
    public boolean hasAccess(String path)
    {
        boolean response = false;

        String role = switch (path) {
            case "saveUser", "updateUser",
                 "deleteUser" -> "ADMINISTRADOR";

            default -> "";
        };

        String[] methodRoles = role.split(",");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        for (GrantedAuthority ga : auth.getAuthorities())
        {
            String rolUser  = ga.getAuthority();
            for (String methodRole : methodRoles)
            {
                if (rolUser.equalsIgnoreCase(methodRole))
                {
                    response = true;
                    break;
                }
            }
        }

        return response;
    }
}
