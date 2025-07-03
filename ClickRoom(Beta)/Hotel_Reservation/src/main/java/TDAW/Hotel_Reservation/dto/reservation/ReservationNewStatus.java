package TDAW.Hotel_Reservation.dto.reservation;

import TDAW.Hotel_Reservation.entity.reservation.ReservationStatus;
import jakarta.validation.constraints.NotNull;

public record ReservationNewStatus(
        @NotNull
        Long reservationId,
        @NotNull
        ReservationStatus reservationStatus
) {
}
