package api.transport.model;

import api.transport.enums.LoadRequestStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class LoadRequest
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 80)
    private String origin;

    @Column(nullable = false, length = 80)
    private String destination;

    @Column(nullable = false, length = 300)
    private String loadDetails;

    @Column(nullable = false)
    private String weight;

    @Column(nullable = false, length = 10)
    private String operation;

    @Column(nullable = false)
    private Double tariff;

    @Column(nullable = false)
    private LocalDateTime datetime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LoadRequestStatus status;

    @ManyToOne
    @JoinColumn(name = "id_client", nullable = false, foreignKey = @jakarta.persistence.ForeignKey(name = "FK_LOAD_REQUEST_CLIENT"))
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id_carrier", foreignKey = @jakarta.persistence.ForeignKey(name = "FK_LOAD_REQUEST_CARRIER"))
    private Carrier carrier;

    @JsonIgnoreProperties({"loadRequest"})
    @OneToMany(mappedBy = "loadRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Request> requests;
}
