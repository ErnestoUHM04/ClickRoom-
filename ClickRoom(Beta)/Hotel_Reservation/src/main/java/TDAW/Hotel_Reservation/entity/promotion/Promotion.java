package TDAW.Hotel_Reservation.entity.promotion;

import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long promotionId;

    @Column(unique = true)
    private String code;

    private BigDecimal discountPercent;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxUses;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}