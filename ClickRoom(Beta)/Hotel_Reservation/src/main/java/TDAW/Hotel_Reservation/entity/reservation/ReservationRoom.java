package TDAW.Hotel_Reservation.entity.reservation;

import TDAW.Hotel_Reservation.entity.room.Room;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRoom {
    @EmbeddedId
    private ReservationRoomId id;

    @ManyToOne
    @MapsId("reservationId")
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne
    @MapsId("roomId")
    @JoinColumn(name = "room_id")
    private Room room;

    private BigDecimal finalPrice;
    private BigDecimal taxes;
}

