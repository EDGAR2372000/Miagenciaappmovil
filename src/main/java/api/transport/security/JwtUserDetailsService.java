package api.transport.security;


import api.transport.model.User;
import api.transport.repo.IUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;


@Service
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {

    private final IUserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repo.findOneByEmail(username);

        if(user == null){
            throw new UsernameNotFoundException("Username not found: " + username);
        }

        // Creamos una sola autoridad a partir de tu enum .role
        GrantedAuthority authority =
                new SimpleGrantedAuthority(user.getRole().name());

        // Devolvemos el UserDetails con esa autoridad
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),            // o user.getUsername(), según tengas
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
