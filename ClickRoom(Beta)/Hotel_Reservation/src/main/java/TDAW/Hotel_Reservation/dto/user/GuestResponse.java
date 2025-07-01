package TDAW.Hotel_Reservation.dto.user;

import TDAW.Hotel_Reservation.dto.reservation.ReservationResponse;

import java.time.LocalDate;
import java.util.List;

public record GuestResponse(
        Long id,
        String email,
        String passwordHash,
        String firstName,
        String lastName,
        String phone,
        String passportNumber,
        String nationality,
        LocalDate birthdate,
        List<ReservationResponse> reservationResponses
) {}
