package api.transport.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Client
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 8)
    private String dni;

    @Column(nullable = false, length = 80)
    private String fullName;

    @Column(nullable = false, length = 9)
    private String phone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_user", unique = true, nullable = false, foreignKey = @ForeignKey(name = "FK_CLIENT_USER"))
    private User user;
}
