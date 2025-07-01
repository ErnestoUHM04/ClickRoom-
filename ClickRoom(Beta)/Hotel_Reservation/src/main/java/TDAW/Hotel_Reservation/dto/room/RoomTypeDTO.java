package TDAW.Hotel_Reservation.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RoomTypeDTO(
        Long id,
        @NotBlank
        String name,
        @NotBlank
        String description,
        @NotNull
        Integer maxCapacity,
        @NotEmpty
        List<AmenityDTO> amenityCreates
) {}
