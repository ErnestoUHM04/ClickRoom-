package TDAW.Hotel_Reservation.entity.reservation;

import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import TDAW.Hotel_Reservation.entity.user.guest.Guest;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    private LocalDate checkIn;
    private LocalDate checkOut;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDIENTE;

    private BigDecimal total;
    private BigDecimal discount;
    private BigDecimal finalPrice;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<ReservationRoom> rooms = new ArrayList<>();
}