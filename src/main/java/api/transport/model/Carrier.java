package api.transport.model;

import api.transport.enums.CarrierStatus;
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
public class Carrier
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

    @Column(nullable = false, length = 7, unique = true)
    private String licensePlate;

    @Column(nullable = false, length = 20, unique = true)
    private String driverLicense;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 80)
    private CarrierStatus status;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_user", unique = true, nullable = false, foreignKey = @ForeignKey(name = "FK_CARRIER_USER"))
    private User user;
}
