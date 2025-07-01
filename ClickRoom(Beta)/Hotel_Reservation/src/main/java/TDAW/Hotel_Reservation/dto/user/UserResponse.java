package TDAW.Hotel_Reservation.dto.user;

public record UserResponse(
        Long id,
        String email,
        String passwordHash,
        String firstName,
        String lastName,
        String phone
) {}
