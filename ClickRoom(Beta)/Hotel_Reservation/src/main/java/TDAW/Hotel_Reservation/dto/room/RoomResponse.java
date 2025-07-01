package TDAW.Hotel_Reservation.dto.room;

import java.math.BigDecimal;

public record RoomResponse(
        Long id,
        Long hotelID,
        String hotelName,
        RoomTypeDTO roomTypeDTO,
        BigDecimal basePrice
) {}
