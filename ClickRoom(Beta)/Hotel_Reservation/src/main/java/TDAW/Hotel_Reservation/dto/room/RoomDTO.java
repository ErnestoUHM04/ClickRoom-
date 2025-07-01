package TDAW.Hotel_Reservation.dto.room;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RoomDTO(
        Long id,
        @NotNull
        Long hotelID,
        @NotNull
        RoomTypeDTO roomTypeDTO,
        @NotNull
        BigDecimal basePrice
){}
