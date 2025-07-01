package TDAW.Hotel_Reservation.dto.reservation;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ReservationDTO(
        @NotNull(message = "El ID de hotel es obligatorio")
        Long hotelId,

        @NotNull(message = "El ID de tipo de habitación es obligatorio")
        Long roomTypeId,

        @NotNull
        @Min(value = 1, message = "Debe reservar al menos una habitación")
        Long number,

        @NotNull(message = "La fecha de reservación es obligatoria")
        @FutureOrPresent(message = "La fecha de reservación debe ser hoy o una fecha futura")
        LocalDate checkIn,

        @NotNull(message = "La fecha de reservación es obligatoria")
        @FutureOrPresent(message = "La fecha de reservación debe ser hoy o una fecha futura")
        LocalDate checkOut,

        @NotNull(message = "El ID del huésped es obligatorio")
        Long guestId,

        String code
) {
}
