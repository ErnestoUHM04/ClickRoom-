package TDAW.Hotel_Reservation.entity.room;

import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    private BigDecimal basePrice;

    @ElementCollection
    @CollectionTable(name = "room_bookings", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "booking_date")
    private List<LocalDate> booking;
}