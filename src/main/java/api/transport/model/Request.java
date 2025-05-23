package api.transport.model;

import api.transport.enums.LoadRequestStatus;
import api.transport.enums.RequestStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Request
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, columnDefinition = "decimal(6, 2)")
    private Double suggestedPrice;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Column(nullable = false)
    private LocalDateTime datetime;

    //@JsonIncludeProperties({"fullName", "phone", "dni"})
    @ManyToOne
    @JoinColumn(name = "id_carrier", nullable = false, foreignKey = @ForeignKey(name = "FK_request_load_request"))
    private Carrier carrier;

    @JsonIgnoreProperties({"requests"})
    @ManyToOne
    @JoinColumn(name = "id_load_request", nullable = false, foreignKey = @ForeignKey(name = "FK_price_suggestion_load_request"))
    private LoadRequest loadRequest;
}
