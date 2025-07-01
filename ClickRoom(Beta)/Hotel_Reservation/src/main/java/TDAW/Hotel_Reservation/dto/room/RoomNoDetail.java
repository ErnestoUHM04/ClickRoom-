package TDAW.Hotel_Reservation.dto.room;

import java.math.BigDecimal;

public record RoomNoDetail(
        RoomTypeDTO roomTypeID,
        Long number,
        BigDecimal basePrice
) {}
