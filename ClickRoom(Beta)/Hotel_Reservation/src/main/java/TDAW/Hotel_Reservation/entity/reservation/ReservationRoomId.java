package TDAW.Hotel_Reservation.entity.reservation;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRoomId implements Serializable {
    private Long reservationId;
    private Long roomId;
}
