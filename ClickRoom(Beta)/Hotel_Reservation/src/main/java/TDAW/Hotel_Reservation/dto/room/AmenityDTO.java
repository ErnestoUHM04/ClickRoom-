package TDAW.Hotel_Reservation.dto.room;

import jakarta.validation.constraints.NotBlank;

public record AmenityDTO(
        Long id,
        @NotBlank
        String name,
        @NotBlank
        String icon
) {}