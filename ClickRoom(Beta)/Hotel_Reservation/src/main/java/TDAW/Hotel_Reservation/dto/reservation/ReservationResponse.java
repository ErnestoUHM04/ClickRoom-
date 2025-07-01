package TDAW.Hotel_Reservation.dto.reservation;

import TDAW.Hotel_Reservation.entity.reservation.ReservationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReservationResponse(
        Long reservationId,
        Long guestId,
        Long hotelId,
        Long number,
        String roomType,
        LocalDate checkIn,
        LocalDate checkOut,
        ReservationStatus reservationStatus,
        BigDecimal total,
        BigDecimal discount,
        BigDecimal finalPrice
) {}
