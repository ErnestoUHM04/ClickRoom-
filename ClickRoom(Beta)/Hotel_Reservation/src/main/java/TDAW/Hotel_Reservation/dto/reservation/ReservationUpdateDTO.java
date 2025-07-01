package TDAW.Hotel_Reservation.dto.reservation;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ReservationUpdateDTO(
        @NotNull
        Long reservationId,
        @FutureOrPresent(message = "La fecha de reservación debe ser hoy o futura")
        LocalDate newCheckIn,
        @FutureOrPresent(message = "La fecha de reservación debe ser hoy o futura")
        LocalDate newCheckOut,
        Long newRoomCount,
        Long newRoomTypeId,
        String newDiscountCode
) {}
